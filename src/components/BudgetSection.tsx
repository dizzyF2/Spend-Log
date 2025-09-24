import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setBudget } from "@/api/api";
import toast from "react-hot-toast";

interface BudgetSectionProps {
    noteId: number;
    budget: number | null;
    onUpdated: () => void;
}

export default function BudgetSection({ noteId, budget, onUpdated }: BudgetSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [amount, setAmount] = useState(budget?.toString() || "");

    const handleSave = async () => {
        try {
            const value = parseFloat(amount);
            if (isNaN(value) || value <= 0) {
                toast.error("Please enter a valid budget amount");
                return;
            }
            await setBudget(noteId, value);
            toast.success("Budget updated");
            setIsEditing(false);
            onUpdated();
        } catch (err) {
            console.error("Failed to set budget", err);
            toast.error("Failed to update budget");
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Budget</h2>

            {isEditing ? (
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-32"
                    />
                    <Button size="sm" onClick={handleSave}>
                        Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                        {budget ? `Current budget: $${budget}` : "No budget set"}
                    </p>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        {budget ? "Edit" : "Set Budget"}
                    </Button>
                </div>
            )}
        </div>
    );
}
