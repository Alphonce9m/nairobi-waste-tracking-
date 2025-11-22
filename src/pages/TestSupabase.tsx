import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TestSupabase = () => {
  const [message, setMessage] = useState('Testing connection...');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient();
        
        // Test the connection by checking if we can access the database
        const { data, error } = await supabase.from('groups').select('count').single();
        
        if (error) {
          setMessage(`Error: ${error.message}`);
          toast({
            title: "Connection Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setMessage('Successfully connected to Supabase!');
          toast({
            title: "Success!",
            description: "Your database connection is working properly.",
          });
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setMessage(`Connection test incomplete: ${errorMessage}`);
        toast({
          title: "Warning",
          description: "The 'groups' table might not exist yet. Please run the SQL setup.",
          variant: "default",
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, [toast]);

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Testing connection...' : message}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              disabled={loading}
            >
              Test Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSupabase;
