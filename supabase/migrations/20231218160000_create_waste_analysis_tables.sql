-- Enable the pgcrypto extension for UUID generation
create extension if not exists "pgcrypto";

-- Create the waste_analyses table
create table if not exists public.waste_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  image_url text not null,
  analysis_result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.waste_analyses enable row level security;

-- Create storage bucket for waste images
insert into storage.buckets (id, name, public)
values ('waste-images', 'waste-images', true)
on conflict (id) do nothing;

-- Set up storage policies for waste images
create policy "Public access for waste images"
  on storage.objects for select
  using (bucket_id = 'waste-images');

create policy "Users can upload waste images"
  on storage.objects for insert
  with check (
    bucket_id = 'waste-images' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own waste images"
  on storage.objects for update
  using (
    bucket_id = 'waste-images' 
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

create policy "Users can delete their own waste images"
  on storage.objects for delete
  using (
    bucket_id = 'waste-images' 
    and auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Set up RLS policies for waste_analyses table
create policy "Users can view their own analyses"
  on public.waste_analyses for select
  using (auth.uid() = user_id);

create policy "Users can create their own analyses"
  on public.waste_analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analyses"
  on public.waste_analyses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own analyses"
  on public.waste_analyses for delete
  using (auth.uid() = user_id);

-- Create a function to get the current user's ID
create or replace function auth.uid()
returns uuid
language sql stable
as $$
  select 
    nullif(
      current_setting('request.jwt.claims', true)::json->>'sub',
      ''
    )::uuid
  
  union
  
  select null::uuid
  where current_setting('request.jwt.claims', true)::json->>'sub' is null
$$;

-- Create indexes for better performance
create index if not exists idx_waste_analyses_user_id 
  on public.waste_analyses(user_id);

create index if not exists idx_waste_analyses_created_at 
  on public.waste_analyses(created_at);

-- Create a view for the dashboard
create or replace view public.waste_analysis_dashboard as
select 
  wa.*,
  wa.analysis_result->>'materialType' as material_type,
  (wa.analysis_result->'market_value'->>'min')::numeric as min_value,
  (wa.analysis_result->'market_value'->>'max')::numeric as max_value,
  (wa.analysis_result->>'qualityScore')::numeric as quality_score,
  (wa.analysis_result->>'contaminationLevel')::numeric as contamination_level,
  (wa.analysis_result->>'confidenceScore')::numeric as confidence_score
from public.waste_analyses wa
where auth.uid() = wa.user_id;

-- Grant necessary permissions
grant select, insert, update, delete 
on public.waste_analyses 
to authenticated;

grant select
on public.waste_analysis_dashboard
to authenticated;

-- Create a function to get analysis statistics
create or replace function public.get_waste_analysis_stats(user_id_param uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  stats jsonb;
begin
  select jsonb_build_object(
    'total_analyses', count(*),
    'avg_quality', avg((analysis_result->>'qualityScore')::numeric),
    'avg_contamination', avg((analysis_result->>'contaminationLevel')::numeric),
    'total_value', sum((analysis_result->'market_value'->>'min')::numeric),
    'by_material', (
      select jsonb_object_agg(
        material_type, 
        jsonb_build_object(
          'count', count(*),
          'avg_quality', avg(quality_score),
          'avg_value', avg((min_value + max_value) / 2)
        )
      )
      from (
        select 
          analysis_result->>'materialType' as material_type,
          (analysis_result->>'qualityScore')::numeric as quality_score,
          (analysis_result->'market_value'->>'min')::numeric as min_value,
          (analysis_result->'market_value'->>'max')::numeric as max_value
        from public.waste_analyses
        where user_id = user_id_param
      ) subq
      group by material_type
    )
  )
  into stats
  from public.waste_analyses
  where user_id = user_id_param;
  
  return stats;
end;
$$;

-- Grant execute permission on the function
grant execute on function public.get_waste_analysis_stats(uuid) to authenticated;
