"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

interface Props{
    fetchFiles: () => Promise<void>;
}


export function DataUpload({fetchFiles}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  
    // Dateien und Zuweisungen laden
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
        setStatus("Bitte wählen Sie eine Datei aus.");
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
          setStatus("Datei erfolgreich hochgeladen");
          fetchFiles();
        } else {
          setStatus("Fehler beim Hochladen der Datei");
        }
      } catch (error) {
        setStatus("Fehler beim Hochladen der Datei: " + (error as Error).message);
      }
    };

    return (
        <div>
        <h2 className="text-2xl font-semibold mb-4">Datei hochladen</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Verstecktes Input-Feld */}
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />

        {/* Button für die Dateiauswahl */}
        <Button
            type="button"
            onClick={handleFileButtonClick}
            className="w-auto text-center bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-gray-500 flex justify-center items-center"
        >
            <Folder className="h-5 w-5" />
        </Button>

        {/* Anzeige des Dateinamens */}
        {file && (
            <p className="text-sm text-gray-700">
            Ausgewählte Datei: <strong>{file.name}</strong>
            </p>
        )}

        {/* Upload-Button */}
        <Button 
            type="submit"
            className="w-auto text-center bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 disabled:bg-gray-500 flex justify-center items-center"
        >
            Hochladen
        </Button>
        </form>
        <p className="mt-4 text-sm text-gray-500">{status}</p>
        </div>
    );
}