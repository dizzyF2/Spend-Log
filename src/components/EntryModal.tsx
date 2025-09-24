import { useState, useEffect } from "react";
import { Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (description: string, amount: number, entryId?: number) => void;
    entry?: Entry | null;
}

export default function EntryModal({ isOpen, onClose, onSave, entry }: EntryModalProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (entry) {
            setDescription(entry.description);
            setAmount(entry.amount.toString());
        } else {
            setDescription("");
            setAmount("");
        }
    }, [entry]);

    const handleSubmit = () => {
        const parsedAmount = parseFloat(amount);
        if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

        onSave(description, parsedAmount, entry?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-semibold">
                    {entry ? "Edit Entry" : "Add Entry"}
                </h2>

                <div className="space-y-2">
                    <Input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {entry ? "Update" : "Add"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
