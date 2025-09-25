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
            const value = parseInt(amount);
            if (isNaN(value) || value <= 0) {
                toast.error("يرجى إدخال قيمة ميزانية صالحة");
                return;
            }
            await setBudget(noteId, value);
            toast.success("تم تحديث الميزانية");
            setIsEditing(false);
            onUpdated();
        } catch (err) {
            console.error("فشل في تعيين الميزانية", err);
            toast.error("فشل في تحديث الميزانية");
        }
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-2">الميزانية</h2>

            {isEditing ? (
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={amount}
                        min={0}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-32"
                    />
                    <Button size="sm" onClick={handleSave}>
                        حفظ
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        إلغاء
                    </Button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                        {budget ? `الميزانية الحالية: ${budget}ج.م` : "لم يتم تعيين ميزانية"}
                    </p>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        {budget ? "تعديل" : "تعيين الميزانية"}
                    </Button>
                </div>
            )}
        </div>
    );
}
