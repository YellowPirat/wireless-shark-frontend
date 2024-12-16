import React, { useState, useEffect } from 'react';

interface IndicatorProps {
    isConnected: boolean;
}
export default function ConnectionStatusIndicator({isConnected}: IndicatorProps) {
    const [isPinging, setIsPinging] = useState(false);
/*
    useEffect(() => {
        // Initial online status
        setIsOnline(navigator.onLine);

        // Event listeners for online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Ping effect interval
        const pingInterval = setInterval(() => {
            if (isOnline) {
                setIsPinging(true);
                setTimeout(() => setIsPinging(false), 1000);
            }
        }, 2000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(pingInterval);
        };
    }, [isOnline]);
    */

    return (
        <div style={{display: "flex", justifyContent: "space-between"}}>

            <div className="relative inline-block p-1">
                {/* Status indicator dot */}

                <div
                    className={`w-4 h-4 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                />

                {/* Ping effect animation */}
                {/*isConnected && (
                    <div

                        className="absolute inset-0 rounded-full animate-ping-slow"
                        style={{
                            backgroundColor: 'rgb(34, 197, 94, 0.5)' // semi-transparent green
                        }}
                    />
                )*/}
            </div>
            <p>{isConnected ? "Verbunden" : "Getrennt"}</p>
        </div>
    );
};