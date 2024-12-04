import React from 'react';
import { Card } from "@/components/atoms/ui/card";

const MCAPView = () => (
  <Card className="p-4">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Select MCAP File</label>
        <input type="file" className="w-full p-2 border rounded" accept=".mcap"/>
      </div>
      <div className="bg-muted p-4 rounded">
        <p className="text-muted-foreground">No file selected</p>
      </div>
    </div>
  </Card>
);

export default MCAPView;