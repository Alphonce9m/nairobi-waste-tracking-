'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

export function WasteAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsAnalyzing(true);
    setError(null);
    setProgress(10);
    
    try {
      // Upload the image to storage
      const formData = new FormData();
      formData.append('file', file);
      
      setProgress(20);
      
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      
      const { url } = await uploadRes.json();
      setProgress(50);
      
      // Analyze the image
      const analysisRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url }),
      });
      
      if (!analysisRes.ok) {
        const error = await analysisRes.json();
        throw new Error(error.error || 'Failed to analyze image');
      }
      
      const { data } = await analysisRes.json();
      setResult(data);
      setProgress(100);
      
      toast({
        title: 'Analysis Complete',
        description: 'Your waste material has been analyzed successfully.',
      });
    } catch (err) {
      console.error('Analysis failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  if (isAnalyzing) {
    return (
      <div className="space-y-4 p-6 border rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <h3 className="text-lg font-medium">Analyzing Waste Material</h3>
          <p className="text-sm text-muted-foreground">
            Our AI is examining the material composition and quality...
          </p>
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-6 border rounded-lg bg-destructive/10 border-destructive/30">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <h3 className="text-lg font-medium">Analysis Failed</h3>
        </div>
        <p className="text-sm">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => setError(null)}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6 p-6 border rounded-lg bg-card">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <h3 className="text-lg font-medium">Analysis Complete</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Material Type</h4>
            <p className="text-lg font-medium">{result.materialType}</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Quality Score</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-600" 
                      style={{ width: `${result.qualityScore}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{result.qualityScore}/100</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Contamination Level</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-amber-500" 
                      style={{ width: `${result.contaminationLevel}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{result.contaminationLevel}/100</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Confidence</h4>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-green-500" 
                      style={{ width: `${result.confidenceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(result.confidenceScore * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Estimated Value</h4>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-3xl font-bold text-primary">
                ${result.estimatedPricePerUnit.toFixed(2)} 
                <span className="text-sm font-normal text-muted-foreground">/ kg</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Market range: ${result.marketValue.min.toFixed(2)} - ${result.marketValue.max.toFixed(2)} {result.marketValue.currency}
              </p>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Composition</h4>
              <div className="space-y-2">
                {result.composition.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-medium">{item.material}</span>
                    <span>
                      {item.percentage}% 
                      <span className="text-muted-foreground text-xs ml-1">
                        ({(item.confidence * 100).toFixed(0)}% conf)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setResult(null)}
            className="flex-1"
          >
            Analyze Another
          </Button>
          <Button className="flex-1">
            List for Sale
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-3">
        <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Upload Waste Photos</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports JPG, PNG, WEBP (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
}
