"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Save } from "lucide-react";

interface CANAssignment {
  canSocket: string;
  dbcFile: string;
  yamlFile: string;
}

export function LoggerControl() {
  const [loggerStatus, setLoggerStatus] = useState<string>(""); // Logger-Status
  const [assignments, setAssignments] = useState<CANAssignment[]>([]); // CAN-Zuweisungen
  const [availableFiles, setAvailableFiles] = useState<string[]>([]); // Verfügbare Dateien
  const [selectedCanSocket, setSelectedCanSocket] = useState<string | null>(null); // Aktueller CAN-Socket

  // Dateien und Zuweisungen laden
  useEffect(() => {
    // Verfügbare Dateien abrufen
    fetch("http://localhost:8080/logger/configs")
      .then((res) => res.json())
      .then((data) => setAvailableFiles(data))
      .catch((err) => console.error("Fehler beim Abrufen der Dateien:", err));

    // Bestehende Zuweisungen abrufen
    fetch("http://localhost:8080/assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error("Fehler beim Abrufen der Zuweisungen:", err));
  }, []);

  // Logger starten
  const handleStartLogger = async () => {
    if (!selectedCanSocket) {
      setLoggerStatus("Bitte wählen Sie einen CAN-Socket aus.");
      return;
    }

    const selectedAssignment = assignments.find((a) => a.canSocket === selectedCanSocket);
    if (!selectedAssignment || !selectedAssignment.dbcFile || !selectedAssignment.yamlFile) {
      setLoggerStatus("Bitte wählen Sie DBC- und YAML-Dateien für den ausgewählten CAN-Socket aus.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/logger/start?config=${selectedAssignment.yamlFile}`, {
        method: "POST",
      });
      if (response.ok) {
        setLoggerStatus("Logger gestartet");
      } else {
        setLoggerStatus("Fehler beim Starten des Loggers");
      }
    } catch (error) {
      setLoggerStatus(`Netzwerkfehler: ${(error as Error).message}`);
    }
  };

  // Logger stoppen
  const handleStopLogger = async () => {
    try {
      const response = await fetch("http://localhost:8080/logger/stop", { method: "POST" });
      if (response.ok) {
        setLoggerStatus("Logger gestoppt");
      } else {
        setLoggerStatus("Fehler beim Stoppen des Loggers");
      }
    } catch (error) {
      setLoggerStatus(`Netzwerkfehler: ${(error as Error).message}`);
    }
  };

  // Zuweisungen speichern
  const handleSaveAssignments = () => {
    fetch("http://localhost:8080/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignments),
    })
      .then((res) => {
        if (res.ok) {
          alert("Zuweisungen erfolgreich gespeichert!");
        } else {
          alert("Fehler beim Speichern der Zuweisungen");
        }
      })
      .catch((err) => console.error("Fehler beim Speichern:", err));
  };

  // Zuweisung aktualisieren
  const updateAssignment = (index: number, field: keyof CANAssignment, value: string) => {
    const updatedAssignments = [...assignments];
    updatedAssignments[index][field] = value;
    setAssignments(updatedAssignments);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Logger Steuerung</h2>

      {/* Tabelle zur Zuweisung */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">CAN-Socket</th>
            <th className="border border-gray-300 px-4 py-2">DBC-Datei</th>
            <th className="border border-gray-300 px-4 py-2">YAML-Datei</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={assignment.canSocket}
                  onChange={(e) => updateAssignment(index, "canSocket", e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={assignment.dbcFile}
                  onChange={(e) => updateAssignment(index, "dbcFile", e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  <option value="">Wählen...</option>
                  {availableFiles.map((file) => (
                    <option key={file} value={file}>
                      {file}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={assignment.yamlFile}
                  onChange={(e) => updateAssignment(index, "yamlFile", e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                >
                  <option value="">Wählen...</option>
                  {availableFiles.map((file) => (
                    <option key={file} value={file}>
                      {file}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Aktionen */}
      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={handleStartLogger}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Play className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          onClick={handleStopLogger}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <Square className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          onClick={handleSaveAssignments}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Save className="h-5 w-5" />
        </Button>
      </div>

      {/* Logger-Status */}
      <p className="mt-4 text-sm text-gray-600">
        <strong>Status:</strong> {loggerStatus}
      </p>
    </div>
  );
}
