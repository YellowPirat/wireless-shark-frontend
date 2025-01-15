interface IndicatorProps {
    isConnected: boolean;
}
export default function ConnectionStatusIndicator({isConnected}: IndicatorProps) {
    // const [isPinging, setIsPinging] = useState(false);

    return (
        <div className="pl-2 pr-1" style={{display: "flex", justifyContent: "space-between"}}>
            <p>{isConnected ? "Connected" : "Disconnected"}</p>
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

        </div>
    );
};