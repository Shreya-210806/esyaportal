import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database, UploadCloud } from "lucide-react";

export default function AdminImport() {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        toast({ title: "Invalid JSON format", description: "Please ensure the input is valid JSON array.", variant: "destructive" });
        return;
      }

      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const res = await fetch(`${apiUrl}/api/admin/import-masterdata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData)
      });
      
      const responseData = await res.json();
      if (responseData.success) {
        toast({ title: "Success", description: responseData.message });
        setData(""); // clear input on success
      } else {
        toast({ title: "Import failed", description: responseData.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Network error during import.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Import Master Data</h2>
          <p className="text-muted-foreground mt-1">
            Bulk upload whitelist consumers to the system via JSON.
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-primary" />
            Upload Master Consumers
          </CardTitle>
          <CardDescription>
            Paste a JSON array containing `ConsumerNumber`, `Email`, and `Phone`. 
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-4">
            <h4 className="text-sm font-semibold mb-2">Example format:</h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto p-4 bg-background rounded border">
              {`[
  {
    "ConsumerNumber": "CN-WXY918",
    "Email": "john.doe@example.com",
    "Phone": "9876543210"
  }
]`}
            </pre>
          </div>

          <textarea
            className="flex min-h-[300px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            placeholder="Paste your JSON array here..."
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <div className="flex justify-end pt-4 border-t">
             <Button
                size="lg"
                onClick={handleImport}
                disabled={isLoading || !data.trim()}
                className="gap-2"
              >
                <Database className="w-4 h-4" />
                {isLoading ? "Importing..." : "Run Import"}
              </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
