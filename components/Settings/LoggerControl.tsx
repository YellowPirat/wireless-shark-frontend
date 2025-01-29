"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Square, Save, Plus, Trash2 } from "lucide-react";

interface CANAssignment {
  CANSocket: string;
  DBCFile: string;
  YAMLFile: string;
}

interface Props {
  availableFiles: string[];
  setAvailableFiles: React.Dispatch<React.SetStateAction<string[]>>;
  fetchFiles: () => Promise<void>;
}

export function LoggerControl({ availableFiles, fetchFiles }: Props) {
  const [loggerStatus, setLoggerStatus] = useState<string>(""); // Logger-Status
  const [assignments, setAssignments] = useState<CANAssignment[]>([]); // CAN-Zuweisungen

  useEffect(() => {
    fetchAssignments();
    fetchFiles();
  }, []);

  // Zuweisungen vom Server holen
  const fetchAssignments = async () => {
    try {
      const response = await fetch('/assignments');
      if (response.ok) {
        const files = await response.json();
        setAssignments(files); // Setze die erhaltenen Dateien in den State
      } else {
        console.error("Fehler beim Abrufen der Dateien");
      }
    } catch (error) {
      console.error("Netzwerkfehler:", error);
    }
  };

  // Zuweisungen speichern
  const handleSaveAssignments = () => {
    fetch('/assignments', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignments),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Zuweisungen erfolgreich gespeichert!");
        } else {
          console.log("Fehler beim Speichern der Zuweisungen");
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

  const handleAddAssignment = () => {
    setAssignments((prevAssignments) => [
      ...prevAssignments,
      { CANSocket: "", DBCFile: "", YAMLFile: "" },
    ]);
  };

  const deleteAssignment = async (index: number) => {
    try {
      // Lösche die entsprechende Zeile im Backend
      const response = await fetch(`/assignments/${index}`, { method: "DELETE" });
      if (response.ok) {
        // Entferne die Zeile im Frontend
        setAssignments((prev) => prev.filter((_, i) => i !== index));
        alert("Zuweisung erfolgreich gelöscht!");
      } else {
        alert("Fehler beim Löschen der Zuweisung");
      }
    } catch (error) {
      console.error("Netzwerkfehler beim Löschen:", error);
    }
  };

  // Logger für eine Zeile starten
  const handleStartLogger = async (index: number) => {
    const selectedAssignment = assignments[index];
    if (!selectedAssignment.DBCFile || !selectedAssignment.YAMLFile) {
      setLoggerStatus("Bitte wählen Sie DBC- und YAML-Dateien für den ausgewählten Eintrag aus.");
      return;
    }

    try {
      const response = await fetch(`/logger/start?yaml=${selectedAssignment.YAMLFile}`, {
        method: "POST",
      });
      if (response.ok) {
        setLoggerStatus(`Logger für Zeile ${index + 1} gestartet`);
      } else {
        setLoggerStatus("Fehler beim Starten des Loggers");
      }
    } catch (error) {
      setLoggerStatus(`Netzwerkfehler: ${(error as Error).message}`);
    }
  };

  // Logger für eine Zeile stoppen
  const handleStopLogger = async (index: number) => {

    try {
      const response = await fetch("/logger/stop", { method: "POST" });
      if (response.ok) {
        setLoggerStatus(`Logger für Zeile ${index + 1} gestoppt`);
      } else {
        setLoggerStatus("Fehler beim Stoppen des Loggers");
      }
    } catch (error) {
      setLoggerStatus(`Netzwerkfehler: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Logger Steuerung</h2>

      {/* Tabelle zur Zuweisung */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200 rounded">
            <th className="border border-gray-300 px-4 py-2">CAN-Socket</th>
            <th className="border border-gray-300 px-4 py-2">DBC-Datei</th>
            <th className="border border-gray-300 px-4 py-2">YAML-Datei</th>
            <th className="border border-gray-300 px-4 py-2">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={assignment.CANSocket}
                  onChange={(e) => updateAssignment(index, "CANSocket", e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded"
                />
                </td>
              <td className="border border-gray-300 px-4 py-2">
                <select
                  value={assignment.DBCFile}
                  onChange={(e) => updateAssignment(index, "DBCFile", e.target.value)}
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
                  value={assignment.YAMLFile}
                  onChange={(e) => updateAssignment(index, "YAMLFile", e.target.value)}
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
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => handleStartLogger(index)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Start Logger"
                >
                  <Play className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleStopLogger(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Stop Logger"
                >
                  <Square className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteAssignment(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Löschen"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Zeile hinzufügen */}
      <Button
        type="button"
        onClick={handleAddAssignment}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        <Plus className="h-5 w-5 inline-block mr-2" /> Neue Zuweisung
      </Button>

      {/* Aktionen */}
      <div className="flex space-x-4">
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
