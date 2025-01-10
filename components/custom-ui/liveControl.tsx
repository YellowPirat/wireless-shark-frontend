import {RefreshCcw, Play, Pause, ListX, Upload, Download, CopyX} from "lucide-react";

interface LiveControlProps {
    isConnected: boolean;
    setShouldWSReconnect: (value: boolean) => void;
    wantLiveUpdate: boolean;
    setWantLiveUpdate: (value: boolean) => void;
    setShouldClearMessages: (value: boolean) => void;
    setShouldRemoveAllWidgets: (value: boolean) => void;
    setShouldSaveAllWidgets: (value: boolean) => void;
    setShouldLoadAllWidgets: (value: boolean) => void;
}

export default function LiveControl({
                                        isConnected,
                                        setShouldWSReconnect,
                                        wantLiveUpdate,
                                        setWantLiveUpdate,
                                        setShouldClearMessages,
                                        setShouldRemoveAllWidgets,
                                        setShouldSaveAllWidgets,
                                        setShouldLoadAllWidgets
                                    }: LiveControlProps) {
    return (
        <div>
            <div className="p-2" style={{display: "flex", justifyContent: "space-between"}}>
                <button
                    type="button"
                    className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    style={{display: "flex", justifyContent: "center"}}
                    onClick={() => setWantLiveUpdate(!wantLiveUpdate)}
                >
                    {wantLiveUpdate ? <Pause/> : <Play/>}
                </button>
                <div className="p-4"></div>
                <button
                    type="button"
                    className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-500"
                    style={{display: "flex", justifyContent: "center"}}
                    onClick={() => setShouldWSReconnect(true)}
                    disabled={isConnected}
                >
                    <RefreshCcw/>
                </button>
                <div className="p-4"></div>
                <button
                    type="button"
                    className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    style={{display: "flex", justifyContent: "center"}}
                    onClick={() => setShouldClearMessages(true)}
                >
                    <ListX/>
                </button>


            </div>
            <div className="p-2" style={{display: "flex", justifyContent: "space-between"}}>
                <button
                    type="button"
                    className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-500"
                    style={{display: "flex", justifyContent: "center"}}
                    onClick={() => setShouldLoadAllWidgets(true)}
                >
                    <Upload/>
                </button>
                <div className="p-4"></div>
                <button
                    type="button"
                    className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    style={{display: "flex", justifyContent: "center"}}
                    onClick={() => setShouldSaveAllWidgets(true)}
                >
                    <Download/>
                </button>
                <div className="p-4"></div>

                <button
                    type="button"
                    className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    style={{display: "flex", justifyContent: "center"}}
                    onClick={() => setShouldRemoveAllWidgets(true)}
                >
                    <CopyX/>
                </button>
            </div>
        </div>
    )
        ;
};