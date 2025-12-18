import { NextResponse } from 'next/server';
import { analyzeWasteImage } from '@/lib/ai/wasteAnalysis';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }
    
    // Analyze the image using AI
    const analysis = await analyzeWasteImage(imageUrl);
    
    // Get the current user from the session (you'll need to implement this)
    // For now, we'll use a placeholder user ID
    const userId = 'user-123';
    
    // Store the analysis in the database
    const { data, error } = await supabase
      .from('waste_analyses')
      .insert([{ 
        user_id: userId,
        image_url: imageUrl,
        analysis_result: analysis 
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        id: data.id,
        ...analysis
      }
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze waste',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
