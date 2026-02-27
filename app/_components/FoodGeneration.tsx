"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const FoodGeneration = () => {
  const [prompt, setPrompt] = useState<string>(
    "I just made a delicious plate of Spaghetti Carbonara using spaghetti, eggs, Parmesan cheese, pancetta, black pepper, garlic, and a pinch of salt.",
  );
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [extractedInfo, setExtractedInfo] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateImageAndExtract = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);
    setExtractedInfo([]);

    try {
      const extractRes = await fetch("/api/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const extractData = await extractRes.json();
      if (!extractRes.ok)
        throw new Error(extractData.error || "Extraction failed");
      const infoArray = extractData.result
        .split(",")
        .map((s: string) => s.trim());
      setExtractedInfo(infoArray);
      const imageRes = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: extractData.result }),
      });
      const imageData = await imageRes.json();
      if (!imageRes.ok)
        throw new Error(imageData.error || "Image generation failed");

      setResultImage(imageData.image);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="container max-w-3xl p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">AI Food Creator</h1>
      <div className="space-y-4">
        <Textarea
          placeholder="Enter a food description (e.g., 'Try our new spicy chicken ramen...')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px]"
        />
        <Button
          onClick={generateImageAndExtract}
          disabled={isLoading || !prompt.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
            </>
          ) : (
            "Generate Image & Extract Info"
          )}
        </Button>

        {error && (
          <div className="p-3 text-red-500 rounded bg-red-50 border border-red-200">
            {error}
          </div>
        )}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg bg-gray-50">
              <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
              <p className="mt-4 text-gray-500">Working on it...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {extractedInfo && (
              <div className="flex flex-wrap  flex-col gap-3 p-4 border rounded-lg card">
                  <h2 className="mb-2 text-lg gap-2 font-semibold">Extracted Info</h2>
                  <div className="flex  gap-2">
                    {extractedInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {info}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {resultImage && (
                <div className="overflow-hidden border rounded-xl shadow-lg">
                  <img
                    src={resultImage}
                    alt="Generated food"
                    className="w-full h-auto transition-all hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
