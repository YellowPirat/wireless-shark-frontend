import {X} from "lucide-react";
import React from "react";

interface DeleteButtonProps {
    onDelete: () => void;
}

export default function DeleteButton({onDelete}: DeleteButtonProps) {
    return (
        <button
            onClick={onDelete}
            className="w-5 text-gray-800 z-20"
            aria-label="Delete widget"
        >
            <X size={16}/>
        </button>
    );
}