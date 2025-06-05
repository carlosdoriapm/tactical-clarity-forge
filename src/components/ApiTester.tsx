
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ApiTester = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const { toast } = useToast();

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      setAuthToken(session.access_token);
      toast({
        title: "Token Retrieved",
        description: "Authentication token copied to field",
      });
    } else {
      toast({
        title: "No Session",
        description: "Please log in first",
        variant: "destructive",
      });
    }
  };

  const testWarLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('war-logs', {
        body: {
          dilemma: "Test dilemma from frontend",
          decision_path: "OPTION 1 → test / OPTION 2 → fail",
          commands: {
            mindset: "Test mindset command",
            body: "Test body command"
          },
          intensity: "TACTICAL",
          result: "testing"
        }
      });

      if (error) throw error;
      setResponse(JSON.stringify(data, null, 2));
      toast({
        title: "Success",
        description: "War log created successfully",
      });
    } catch (error) {
      setResponse(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testRituals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rituals');

      if (error) throw error;
      setResponse(JSON.stringify(data, null, 2));
      toast({
        title: "Success",
        description: "Rituals fetched successfully",
      });
    } catch (error) {
      setResponse(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testWarCodeFragments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('war-code-fragments', {
        body: {
          raw_phrase: "Test phrase from frontend",
          symbol_keyword: "test",
          mapped_glyph: "test_glyph"
        }
      });

      if (error) throw error;
      setResponse(JSON.stringify(data, null, 2));
      toast({
        title: "Success",
        description: "War code fragment created successfully",
      });
    } catch (error) {
      setResponse(`Error: ${error.message}`);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPostmanConfig = () => {
    const config = {
      baseUrl: "https://lygbrcsdjjwzdmyxbmbu.supabase.co/functions/v1",
      authToken: authToken || "Get token first",
      userId: "Extracted from auth token automatically",
      endpoints: {
        command: "/ai-chat",
        warLogs: "/war-logs", 
        rituals: "/rituals",
        warCodeFragments: "/war-code-fragments"
      },
      headers: {
        "Authorization": `Bearer ${authToken || "YOUR_TOKEN_HERE"}`,
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Z2JyY3Nkamp3emRteXhibWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDU5MDQsImV4cCI6MjA2NDQ4MTkwNH0.Kio3p7zQRvA0vg8DUEtWNl0jgpyHikh5fu7pMnXarls"
      }
    };
    
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    toast({
      title: "Copied!",
      description: "Postman configuration copied to clipboard",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Testing Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={getAuthToken} variant="outline">
              Get Auth Token
            </Button>
            <Button onClick={copyPostmanConfig} variant="outline">
              Copy Postman Config
            </Button>
          </div>
          
          {authToken && (
            <div>
              <label className="text-sm font-medium">Current Auth Token:</label>
              <Input value={authToken.substring(0, 50) + "..."} readOnly className="mt-1" />
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={testWarLogs} disabled={loading}>
              Test War Logs
            </Button>
            <Button onClick={testRituals} disabled={loading}>
              Test Rituals
            </Button>
            <Button onClick={testWarCodeFragments} disabled={loading}>
              Test War Code
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium">API Response:</label>
            <Textarea
              value={response}
              readOnly
              className="mt-1 h-40 font-mono text-sm"
              placeholder="API responses will appear here..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Postman Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. Update your Postman variables:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• baseUrl: https://lygbrcsdjjwzdmyxbmbu.supabase.co/functions/v1</li>
              <li>• Add apikey header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Z2JyY3Nkamp3emRteXhibWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDU5MDQsImV4cCI6MjA2NDQ4MTkwNH0.Kio3p7zQRvA0vg8DUEtWNl0jgpyHikh5fu7pMnXarls</li>
            </ul>
          </div>
          <div>
            <strong>2. Update endpoint paths:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Command: /ai-chat</li>
              <li>• War Logs: /war-logs</li>
              <li>• Rituals: /rituals</li>
              <li>• War Code: /war-code-fragments</li>
            </ul>
          </div>
          <div>
            <strong>3. Headers for each request:</strong>
            <ul className="ml-4 mt-1 space-y-1">
              <li>• Authorization: Bearer [your-token]</li>
              <li>• Content-Type: application/json</li>
              <li>• apikey: [supabase-anon-key]</li>
            </ul>
          </div>
          <div>
            <strong>4. Remove user_id from request bodies</strong> - it's extracted from the auth token automatically.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTester;
