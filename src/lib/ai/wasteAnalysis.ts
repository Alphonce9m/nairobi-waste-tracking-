import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for frontend development
});

export interface WasteAnalysis {
  materialType: string;
  composition: Array<{
    material: string;
    percentage: number;
    confidence: number;
  }>;
  qualityScore: number;
  estimatedPricePerUnit: number;
  marketValue: {
    min: number;
    max: number;
    currency: string;
  };
  contaminationLevel: number;
  recommendations: string[];
  confidenceScore: number;
}

export async function analyzeWasteImage(imageUrl: string): Promise<WasteAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this waste material and provide a detailed composition analysis. 
              Estimate the material type, composition percentages, quality score (0-100), 
              contamination level (0-100), and any recommendations for improving the material quality. 
              Also estimate the market value per unit.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Parse the response and return structured data
    return parseAnalysisResponse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing waste image:', error);
    throw new Error('Failed to analyze waste image');
  }
}

function parseAnalysisResponse(content: string | null): WasteAnalysis {
  // In a real implementation, you'd parse the AI response
  // This is a simplified example with mock data
  return {
    materialType: 'Mixed Plastics',
    composition: [
      { material: 'HDPE', percentage: 65, confidence: 0.92 },
      { material: 'LDPE', percentage: 20, confidence: 0.88 },
      { material: 'PP', percentage: 10, confidence: 0.85 },
      { material: 'Contaminants', percentage: 5, confidence: 0.78 },
    ],
    qualityScore: 82,
    estimatedPricePerUnit: 0.42,
    marketValue: {
      min: 0.38,
      max: 0.46,
      currency: 'USD',
    },
    contaminationLevel: 5,
    recommendations: [
      'Remove food residue to improve quality',
      'Separate by plastic type for better pricing',
      'Consider baling for more efficient transport'
    ],
    confidenceScore: 0.89
  };
}
