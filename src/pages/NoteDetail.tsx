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

            console.log("Fetching budget for noteId:", noteId, typeof noteId);
            const budgetData = await getBudget(noteId);
            setBudget(budgetData);
        } catch (err) {
            console.error("Failed to fetch note detail", err);
            toast.error("Failed to fetch note detail");
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

    const handleDeleteEntry = async (id: number) => {
        if (confirm("Delete this entry?")) {
            await deleteEntry(id);
            fetchData();
        }
    };

    const handleSaveTitle = async () => {
        if (note && titleInput.trim()) {
            await updateNote(note.id, titleInput.trim());
            setNote({ ...note, title: titleInput.trim() });
            setIsEditingTitle(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <header className="flex justify-between items-center">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Back
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
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsEditingTitle(false)}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl font-bold">
                                {note?.title || `Note #${noteId}`}
                            </h1>
                            <Button size="sm" variant="ghost" onClick={() => setIsEditingTitle(true)}>
                                Edit
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <BudgetSection noteId={noteId} budget={budget} onUpdated={fetchData} />

                    {budget !== null && (
                        <div className="p-3 border rounded-lg bg-gray-50">
                            <p className="font-medium">Remaining Budget:</p>
                            <p
                                className={`text-lg font-bold ${
                                    remainingBudget !== null && remainingBudget < 0
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
                            <h2 className="font-semibold text-lg">Entries</h2>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setEditingEntry(null);
                                    setIsModalOpen(true);
                                }}
                            >
                                Add Entry
                            </Button>
                        </div>

                        {entries.length === 0 ? (
                            <p>No entries yet.</p>
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
                                                Spent: {entry.amount} |{" "}
                                                {new Date(entry.created_at).toLocaleString()}
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
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteEntry(entry.id)}
                                            >
                                                Delete
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
        </div>
    );
}
