"use client";

import React, { useState, useRef, useEffect } from "react";
import   Sidebar   from "@/components/LiveView/Sidebar";
import { LoggerControl } from "@/components/Settings/LoggerControl";
import { DataUpload } from "./DataUpload";
import { Card } from "../ui/card";



export default function Settings() {
  const [availableFiles, setAvailableFiles] = useState<string[]>([]); // Verfügbare Dateien

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
      <div className="flex-col gap-2 p-4">
        <Card className="mb-4 p-4">
          <LoggerControl fetchFiles={fetchFiles} availableFiles={availableFiles} setAvailableFiles={setAvailableFiles}>

          </LoggerControl>
        </Card>

        <Card className="mb-4 p-4">
          <DataUpload fetchFiles={fetchFiles}>

          </DataUpload>
        </Card>

      </div>
    </div>
  );
}
