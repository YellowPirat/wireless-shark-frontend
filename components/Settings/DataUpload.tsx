"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

interface Props {
  fetchFiles: () => Promise<void>;
}

export function DataUpload({ fetchFiles }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load files and assignments
  useEffect(() => {
    //fetchFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("File uploaded successfully");
        fetchFiles();
      } else {
        setStatus("Failed to upload file");
      }
    } catch (error) {
      setStatus("Failed to upload file: " + (error as Error).message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Upload File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hidden input field */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Flex container for file name and folder button */}
        <div className="flex items-center space-x-2">
          {/* File name field with border */}
          <span
            className={`text-sm text-gray-700 border p-2 w-80 flex items-center ${
              file ? "border-gray-300" : "border-gray-400"
            } rounded-md`}
          >
            {file ? `${file.name}` : "Select File"}
          </span>


          {/* Folder button (without rounded left corner) */}
          <Button
            type="button"
            onClick={handleFileButtonClick}
            className="w-auto text-center bg-blue-500 text-white px-4 py-4 rounded-md hover:bg-blue-600 disabled:bg-gray-500 flex justify-center items-center"
          >
            <Folder className="h-5 w-5" />
          </Button>
        </div>

        {/* Upload Button */}
        <Button
          type="submit"
          className="w-auto text-center bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-gray-500 flex justify-center items-center"
        >
          Upload
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-500">{status}</p>
    </div>
  );
}
