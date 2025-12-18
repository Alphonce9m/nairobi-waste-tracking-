import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Camera, Image, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Analyze = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTakePhoto = () => {
    // This would be implemented to access the device camera
    toast({
      title: "Camera Access",
      description: "Camera access would be requested here in a production app.",
    });
  };

  const analyzeWaste = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResult = {
        materialType: "Plastic (PET)",
        confidence: 0.92,
        recyclingInfo: {
          recyclable: true,
          process: "Wash and place in recycling bin",
          facilities: ["Nairobi Central Recycling", "GreenCycle Kenya"]
        },
        environmentalImpact: {
          co2Saved: "0.5 kg",
          waterSaved: "12 liters",
          energySaved: "0.8 kWh"
        }
      };
      
      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your waste item successfully!",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Waste Analysis</h1>
        <p className="text-muted-foreground">Upload or take a photo to analyze waste materials</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="camera">
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Waste Image</CardTitle>
                <CardDescription>
                  Upload a clear photo of the waste item you want to analyze.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input 
                    id="picture" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
                {image && (
                  <div className="mt-4">
                    <img 
                      src={image} 
                      alt="Uploaded waste" 
                      className="rounded-lg max-h-64 mx-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="camera">
            <Card>
              <CardHeader>
                <CardTitle>Take a Photo</CardTitle>
                <CardDescription>
                  Use your device's camera to capture the waste item.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Camera access required</p>
                  <Button onClick={handleTakePhoto}>
                    Open Camera
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {image && activeTab === "upload" && (
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={analyzeWaste} 
              disabled={isAnalyzing}
              className="w-full max-w-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Waste"
              )}
            </Button>
          </div>
        )}

        {analysisResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Here's what we found about your waste item
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Material Type</h3>
                <p className="text-muted-foreground">{analysisResult.materialType}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </p>
              </div>

              <div>
                <h3 className="font-medium">Recycling Information</h3>
                <p className="text-muted-foreground">
                  {analysisResult.recyclingInfo.recyclable 
                    ? "✅ This item is recyclable" 
                    : "❌ This item is not recyclable"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysisResult.recyclingInfo.process}
                </p>
                {analysisResult.recyclingInfo.facilities.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Nearby Recycling Facilities:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {analysisResult.recyclingInfo.facilities.map((facility: string, index: number) => (
                        <li key={index}>{facility}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium">Environmental Impact</h3>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="font-bold text-primary">{analysisResult.environmentalImpact.co2Saved} CO₂</div>
                    <div className="text-xs text-muted-foreground">Saved</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="font-bold text-primary">{analysisResult.environmentalImpact.waterSaved}</div>
                    <div className="text-xs text-muted-foreground">Water Saved</div>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <div className="font-bold text-primary">{analysisResult.environmentalImpact.energySaved}</div>
                    <div className="text-xs text-muted-foreground">Energy Saved</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setAnalysisResult(null)}>
                Analyze Another Item
              </Button>
              <Button>Find Recycling Center</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analyze;
