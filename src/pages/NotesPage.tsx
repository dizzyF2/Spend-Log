import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, createNote, deleteNote } from "@/api/api";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import NoteModal from "@/components/NoteModal";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const data = await getNotes();
            setNotes(data);
        } catch (err) {
            console.error("Failed to fetch notes", err);
            toast.error("Failed to fetch notes");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (title: string) => {
        try {
            const newNote = await createNote(title);
            toast.success("Note created");
            navigate(`/notes/${newNote.id}`);
        } catch (err) {
            toast.error("Failed to create note");
        }
    };

    const handleDeleteRequest = (id: number) => {
        setNoteToDelete(id);
        setConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (noteToDelete !== null) {
            await deleteNote(noteToDelete);
            toast.success("Note deleted");
            fetchNotes();
            setNoteToDelete(null);
        }
        setConfirmOpen(false);
    };

    const formatDate = (date: string | number | Date) => {
        const d = typeof date === "number"
            ? new Date(date * 1000)
            : new Date(date);

        return d.toLocaleString("en-EG", {
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
                <h1 className="text-xl font-bold">Spend Log Notes</h1>
                <Button onClick={() => setShowModal(true)}>New Note</Button>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : notes.length === 0 ? (
                <p>No notes yet. Create one to get started!</p>
            ) : (
                <ul className="space-y-2">
                    {notes.map((note) => (
                        <li
                            key={note.id}
                            className="flex justify-between items-center p-3 border rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/notes/${note.id}`)}
                        >
                            <div>
                                <p className="font-medium">{note.title}</p>
                                <p className="text-sm text-gray-500">
                                    {formatDate(note.created_at)}
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRequest(note.id);
                                }}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            <NoteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleCreate}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Note?"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
