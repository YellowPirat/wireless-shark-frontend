import React from 'react';
import { Card } from "@/components/atoms/ui/card";

const SettingsView = () => (
  <Card className="p-4">
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Baud Rate</label>
        <select className="w-full p-2 border rounded">
          <option>125000</option>
          <option>250000</option>
          <option>500000</option>
          <option>1000000</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Interface</label>
        <input type="text" className="w-full p-2 border rounded" placeholder="can0"/>
      </div>
    </div>
  </Card>
);

export default SettingsView;