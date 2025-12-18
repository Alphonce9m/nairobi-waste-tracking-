import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number = 400, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const apiClient = {
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const { data, error } = await supabase
      .from(url)
      .select('*')
      .match(params || {});

    if (error) {
      throw new ApiError(error.message, error.code);
    }

    return data as T;
  },

  async getById<T>(url: string, id: string): Promise<T> {
    const { data, error } = await supabase
      .from(url)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new ApiError(error.message, error.code);
    }

    return data as T;
  },

  async post<T>(url: string, body: any): Promise<T> {
    const { data, error } = await supabase
      .from(url)
      .insert([body])
      .select()
      .single();

    if (error) {
      throw new ApiError(error.message, error.code);
    }

    return data as T;
  },

  async put<T>(url: string, id: string, updates: any): Promise<T> {
    const { data, error } = await supabase
      .from(url)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new ApiError(error.message, error.code);
    }

    return data as T;
  },

  async delete(url: string, id: string): Promise<boolean> {
    const { error } = await supabase
      .from(url)
      .delete()
      .eq('id', id);

    if (error) {
      throw new ApiError(error.message, error.code);
    }

    return true;
  },

  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      throw new ApiError(error.message, 400);
    }

    return data;
  },

  async getFileUrl(bucket: string, path: string) {
    const { data } = await supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }
};
