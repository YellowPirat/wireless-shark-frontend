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
  const [loggerStatus, setLoggerStatus] = useState<string>(""); // Logger status
  const [assignments, setAssignments] = useState<CANAssignment[]>([]); // CAN assignments

  useEffect(() => {
    fetchAssignments();
    fetchFiles();
  }, []);

  // Fetch assignments from the server
  const fetchAssignments = async () => {
    try {
      const response = await fetch('/assignments');
      if (response.ok) {
        const files = await response.json();
        setAssignments(files); // Set the fetched files to state
      } else {
        console.error("Error fetching files");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // Save assignments
  const handleSaveAssignments = () => {
    fetch('/assignments', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignments),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Assignments successfully saved!");
        } else {
          console.log("Error saving assignments");
        }
      })
      .catch((err) => console.error("Error saving:", err));
  };

  // Update an assignment
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
      // Delete the corresponding row from the backend
      const response = await fetch(`/assignments/${index}`, { method: "DELETE" });
      if (response.ok) {
        // Remove the row from the frontend
        setAssignments((prev) => prev.filter((_, i) => i !== index));
        alert("Assignment successfully deleted!");
      } else {
        alert("Error deleting assignment");
      }
    } catch (error) {
      console.error("Network error when deleting:", error);
    }
  };

  // Start logger for a row
  const handleStartLogger = async (index: number) => {
    const selectedAssignment = assignments[index];
    if (!selectedAssignment.DBCFile || !selectedAssignment.YAMLFile) {
      setLoggerStatus("Please select DBC and YAML files for the selected entry.");
      return;
    }

    try {
      const response = await fetch(`/logger/start?yaml=${selectedAssignment.YAMLFile}`, {
        method: "POST",
      });
      if (response.ok) {
        setLoggerStatus(`Logger for row ${index + 1} started`);
      } else {
        setLoggerStatus("Error starting logger");
      }
    } catch (error) {
      setLoggerStatus(`Network error: ${(error as Error).message}`);
    }
  };

  // Stop logger for a row
  const handleStopLogger = async (index: number) => {

    try {
      const response = await fetch("/logger/stop", { method: "POST" });
      if (response.ok) {
        setLoggerStatus(`Logger for row ${index + 1} stopped`);
      } else {
        setLoggerStatus("Error stopping logger");
      }
    } catch (error) {
      setLoggerStatus(`Network error: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Logger Control</h2>

      {/* Table for assignments */}
      <table className="table-auto w-full border-collapse border border-gray-300 mb-4 rounded-lg">
        <thead>
          <tr className="bg-gray-200 rounded">
            <th className="border border-gray-300 px-4 py-2 w-32">CAN Socket</th>
            <th className="border border-gray-300 px-4 py-2 w-64">DBC File</th>
            <th className="border border-gray-300 px-4 py-2 w-64">YAML File</th>
            <th className="border border-gray-300 px-4 py-2 w-20">Actions</th>
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
                  <option value="">Select...</option>
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
                  <option value="">Select...</option>
                  {availableFiles.map((file) => (
                    <option key={file} value={file}>
                      {file}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center w-20">
                <div className="flex justify-between">
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
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add new assignment */}
      <Button
        type="button"
        onClick={handleAddAssignment}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        <Plus className="h-5 w-5 inline-block mr-2" /> New Assignment
      </Button>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button
          type="button"
          onClick={handleSaveAssignments}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <Save className="h-5 w-5" />
        </Button>
      </div>

      {/* Logger status */}
      <p className="mt-4 text-sm text-gray-600">
        <strong>Status:</strong> {loggerStatus}
      </p>
    </div>
  );
}
