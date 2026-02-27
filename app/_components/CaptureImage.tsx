"use client";
import type React from "react";
import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";

export function CaptureImage() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match("image.*")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImage(e.target.result as string);
            setResultText(null);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
          setResultText(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleExtract = async () => {
    if (!image) return;
    setIsLoading(true);
    setResultText(null);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Analyze this food image" }),
      });
      const data = await response.json();
      if (response.ok && data.result) {
        setResultText(data.result);
      } else {
        alert("Error: " + (data.error || "No response received"));
      }
    } catch (err) {
      alert("Connection error occurred!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            AI Image Captioning{" "}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {image ? (
              <div className="relative w-full overflow-hidden rounded-md aspect-video">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="py-8">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop an image here
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
          {image && (
            <Button
              className="w-full"
              onClick={handleExtract}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Extract Info"
              )}
            </Button>
          )}
          {resultText && (
            <div className="p-3 bg-white border rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-900">{resultText}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-center text-gray-500 justify-center">
          Upload an image to generete n AI-powered caption
        </CardFooter>
      </Card>
    </div>
  );
}
