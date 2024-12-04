import React from 'react';
import { Card } from "@/components/atoms/ui/card";

const LiveView = () => (
  <Card className="p-4">
    <div className="space-y-2">
      <div className="p-2 bg-muted rounded">
        <div className="font-mono">ID: 0x123 | Data: 01 02 03 04</div>
      </div>
      <div className="p-2 bg-muted rounded">
        <div className="font-mono">ID: 0x456 | Data: FF EE DD CC</div>
      </div>
    </div>
  </Card>
);

export default LiveView;