import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    updateNote,
    getNotes,
    getBudget,
} from "@/api/api";
import { Entry, Note } from "@/types";
import { Button } from "@/components/ui/button";
import BudgetSection from "@/components/BudgetSection";
import EntryModal from "@/components/EntryModal";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const noteId = Number(id);

    const [note, setNote] = useState<Note | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [budget, setBudget] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleInput, setTitleInput] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);

    const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const remainingBudget = budget !== null ? budget - totalSpent : null;

    useEffect(() => {
        fetchData();
    }, [noteId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const notes = await getNotes();
            const currentNote = notes.find((n) => n.id === noteId) || null;
            setNote(currentNote);
            setTitleInput(currentNote?.title ?? "");

            const entriesData = await getEntries(noteId);
            setEntries(entriesData);

            const budgetData = await getBudget(noteId);
            setBudget(budgetData);
        } catch (err) {
            console.error("فشل في جلب تفاصيل الملاحظة", err);
            toast.error("فشل في جلب تفاصيل الملاحظة");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEntry = async (description: string, amount: number, entryId?: number) => {
        if (entryId) {
            await updateEntry(entryId, description, amount);
        } else {
            await createEntry(noteId, description, amount);
        }
        fetchData();
    };

    const handleDeleteEntry = (entry: Entry) => {
        setEntryToDelete(entry);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (entryToDelete) {
            await deleteEntry(entryToDelete.id);
            fetchData();
            setEntryToDelete(null);
        }
        setConfirmOpen(false);
    };

    const handleSaveTitle = async () => {
        if (note && titleInput.trim()) {
            await updateNote(note.id, titleInput.trim());
            setNote({ ...note, title: titleInput.trim() });
            setIsEditingTitle(false);
        }
    };

    const formatDate = (date: string | number | Date) => {
        const d = typeof date === "number"
            ? new Date(date * 1000)
            : new Date(date);

        return d.toLocaleString("ar-EG", {
            timeZone: "Africa/Cairo",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="p-4 space-y-4">
            <header className="flex justify-between items-center">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    العودة
                </Button>

                <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                        <>
                            <Input
                                value={titleInput}
                                onChange={(e) => setTitleInput(e.target.value)}
                                className="w-64"
                            />
                            <Button size="sm" onClick={handleSaveTitle}>
                                حفظ
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditingTitle(false)}
                            >
                                إلغاء
                            </Button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl font-bold">
                                {note?.title || `الملاحظة #${noteId}`}
                            </h1>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(true)}>
                                تعديل
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {loading ? (
                <p>جارٍ التحميل...</p>
            ) : (
                <>
                    <BudgetSection noteId={noteId} budget={budget} onUpdated={fetchData} />

                    {budget !== null && (
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="font-medium">الميزانية المتبقية:</p>
                            <p
                                className={`text-lg font-bold ${
                                    remainingBudget !== null && remainingBudget <= 500
                                        ? "text-red-500"
                                        : "text-green-600"
                                }`}
                            >
                                {remainingBudget !== null ? remainingBudget : "-"}
                            </p>
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="font-semibold text-lg">الصرفيات</h2>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEditingEntry(null);
                                    setIsModalOpen(true);
                                }}
                            >
                                إضافة صرفية
                            </Button>
                        </div>

                        {entries.length === 0 ? (
                            <p>لا توجد صرفيات بعد.</p>
                        ) : (
                            <ul className="space-y-2">
                                {entries.map((entry) => (
                                    <li
                                        key={entry.id}
                                        className="p-3 border rounded-lg shadow-sm flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-medium">{entry.description}</p>
                                            <p className="text-sm text-gray-500">
                                                المصروف: {entry.amount} ج.م |{" "}
                                                {formatDate(entry.created_at)}
                                            </p>
                                        </div>
                                        <div className="space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setEditingEntry(entry);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                تعديل
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteEntry(entry)}
                                            >
                                                حذف
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}

            <EntryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEntry}
                entry={editingEntry}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="حذف الصرفية؟"
                message="هل أنت متأكد أنك تريد حذف هذه الصرفية؟ هذا الإجراء لا يمكن التراجع عنه."
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
