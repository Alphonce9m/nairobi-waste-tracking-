import { Metadata } from 'next';
import { WasteAnalysis } from '@/components/waste/WasteAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Waste Analysis | Nairobi Waste Tracking',
  description: 'Get instant AI-powered analysis of your waste materials',
};

export default function AnalyzePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI-Powered Waste Analysis
          </h1>
          <p className="text-muted-foreground">
            Upload photos of your waste materials to get instant analysis of composition, 
            quality, and market value.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <WasteAnalysis />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="font-medium">1. Upload Photo</div>
                  <p className="text-muted-foreground">
                    Take or upload a clear photo of your waste material in good lighting.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">2. AI Analysis</div>
                  <p className="text-muted-foreground">
                    Our AI analyzes the material composition, quality, and potential value.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">3. Get Insights</div>
                  <p className="text-muted-foreground">
                    Receive detailed analysis and recommendations to maximize value.
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Supported Materials</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  {[
                    'Plastics (PET, HDPE, LDPE, PP)',
                    'Metals (Aluminum, Copper, Steel)',
                    'Paper & Cardboard',
                    'Electronics (E-waste)',
                    'Organic Waste',
                    'Glass',
                    'Textiles',
                    'Construction Waste'
                  ].map((material, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                      <span className="text-muted-foreground">{material}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
