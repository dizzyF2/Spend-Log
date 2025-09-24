import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string) => void;
    initialTitle?: string;
}

export default function NoteModal({
    isOpen,
    onClose,
    onSave,
    initialTitle = "",
}: NoteModalProps) {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (title.trim()) {
            onSave(title.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
                <h2 className="text-lg font-semibold">
                    {initialTitle ? "Edit Note" : "New Note"}
                </h2>
                
                <Input
                    placeholder="Note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
