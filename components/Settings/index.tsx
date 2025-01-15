"use client";

import React, { useState, useRef, useEffect } from "react";
import   Sidebar   from "@/components/LiveView/Sidebar";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { LoggerControl } from "@/components/Settings/LoggerControl";

export default function UploadData() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [availableFiles, setAvailableFiles] = useState<string[]>([]); // Verfügbare Dateien
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      const response = await fetch("http://localhost:8080/upload", {
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

  // Config-Dateien vom Backend abrufen
  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:8080/logger/files");
      if (response.ok) {
        const files = await response.json();
        setAvailableFiles(files); // Setze die erhaltenen Dateien in den State
      } else {
        console.error("Fehler beim Abrufen der Dateien");
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
    }
  };


  return (
    <div className="flex h-screen">
      {/* Sidebar links */}
      <Sidebar >
      </Sidebar>

      {/* Hauptinhalt rechts neben der Sidebar */}
      <main className="p-6 flex-1">
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

        {/* LoggerControl unterhalb der Upload-Section */}
        <div className="mt-8">
          <LoggerControl availableFiles={availableFiles} setAvailableFiles={setAvailableFiles} fetchFiles={fetchFiles}  />
        </div>
      </main>
    </div>
  );
}
