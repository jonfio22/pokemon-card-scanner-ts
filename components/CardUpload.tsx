"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";

interface CardUploadProps {
  onImageSelected: (imageData: string, file: File) => void;
  isLoading?: boolean;
}

export function CardUpload({ onImageSelected, isLoading }: CardUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Read file and create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      setPreview(imageData);
      onImageSelected(imageData, file);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <Card>
      <CardContent className="p-6">
        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Card preview"
                className="w-full h-auto rounded-lg border-2 border-slate-200"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={clearImage}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Upload className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900">
                    Upload a Pokemon Card
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Take a photo or upload from your device
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isLoading}
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Image
              </Button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
