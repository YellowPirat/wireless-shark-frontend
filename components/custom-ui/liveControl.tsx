import { RefreshCcw, Play, Trash2 } from "lucide-react";

interface LiveControlProps {
    isConnected: boolean;
}
export default function LiveControl({/*{isConnected}: LiveControlProps*/}) {
    return (
        <div className="p-2" style={{display: "flex", justifyContent: "space-between"}}>
            <button
                type="button"
                className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                style={{display: "flex", justifyContent: "center"}}
            >
                <RefreshCcw/>
            </button>
            <div className="p-4"></div>
            <button
                type="button"
                className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                style={{display: "flex", justifyContent: "center"}}
            >
                <Trash2/>
            </button>
            <div className="p-4"></div>

            <button
                type="button"
                className="w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                style={{display: "flex", justifyContent: "center"}}
            >
                <Play/>
            </button>
        </div>
    );
};