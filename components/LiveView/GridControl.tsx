import ConnectionStatusIndicator from "@/components/custom-ui/connectionStatusIndicator";
import LiveControl from "@/components/custom-ui/liveControl";
import { Separator } from "@/components/ui/separator";

interface GridControlProps {
    isWSConnected: boolean;
    setShouldWSReconnect: (value: boolean) => void;
    wantLiveUpdate: boolean;
    setShouldClearMessages: (value: boolean) => void;
    setWantLiveUpdate: (value: boolean) => void;
    setShouldRemoveAllWidgets: (value: boolean) => void;
    setShouldSaveAllWidgets: (value: boolean) => void;
    setShouldLoadAllWidgets: (value: boolean) => void;
}

export default function GridControl({
                                        isWSConnected,
                                        setShouldWSReconnect,
                                        wantLiveUpdate,
                                        setShouldClearMessages,
                                        setWantLiveUpdate,
                                        setShouldRemoveAllWidgets,
                                        setShouldSaveAllWidgets,
                                        setShouldLoadAllWidgets
                                    }: GridControlProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Grid Control</h3>
            <ConnectionStatusIndicator isConnected={isWSConnected}/>
            <Separator/>
            <LiveControl isConnected={isWSConnected}
                         wantLiveUpdate={wantLiveUpdate}
                         setShouldWSReconnect={setShouldWSReconnect}
                         setWantLiveUpdate={setWantLiveUpdate}
                         setShouldClearMessages={setShouldClearMessages}
                         setShouldRemoveAllWidgets={setShouldRemoveAllWidgets}
                         setShouldSaveAllWidgets={setShouldSaveAllWidgets}
                         setShouldLoadAllWidgets={setShouldLoadAllWidgets}
            />
        </div>
    )
}