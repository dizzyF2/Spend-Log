import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getNotes, createNote, deleteNote } from "@/api/api"
import type { Note } from "@/types"
import { Button } from "@/components/ui/button"
import NoteModal from "@/components/NoteModal"
import ConfirmModal from "@/components/ConfirmModal"
import toast from "react-hot-toast"
import { Plus, Trash2, FileText } from "lucide-react"

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        setLoading(true)
        try {
            const data = await getNotes()
            setNotes(data)
        } catch (err) {
            console.error("فشل في جلب الملاحظات", err)
            toast.error("فشل في جلب الملاحظات")
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (title: string) => {
        try {
            const newNote = await createNote(title)
            toast.success("تم إنشاء الملاحظة")
            navigate(`/notes/${newNote.id}`)
        } catch (err) {
            toast.error("فشل في إنشاء الملاحظة")
        }
    }

    const handleDeleteRequest = (note: Note) => {
        setNoteToDelete(note)
        setConfirmOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (noteToDelete !== null) {
            await deleteNote(noteToDelete.id)
            toast.success("تم حذف الملاحظة")
            fetchNotes()
            setNoteToDelete(null)
        }
        setConfirmOpen(false)
    }

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
        })
    }

    return (
        <div className="min-h-screen p-6 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="glass-card rounded-2xl p-8 mb-8 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent mb-2">
                        ملاحظاتي
                    </h1>
                    <p className="text-muted-foreground text-lg">نظم أفكارك وتتبع مصاريفك</p>
                </div>

                <div className="flex justify-end mb-8">
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-accent-foreground hover:shadow-lg transition-all duration-300 rounded-xl px-8 py-3"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        إنشاء ملاحظة جديدة
                    </Button>
                </div>

                {loading ? (
                    <p>جارٍ التحميل...</p>
                ) : notes.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center animate-slide-up">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                            <FileText className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">لا توجد ملاحظات بعد</h3>
                        <p className="text-muted-foreground mb-6">أنشئ أول ملاحظة لتبدأ تتبع مصاريفك</p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            size="lg"
                            className="bg-gradient-to-r from-primary to-accent-foreground rounded-xl"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            إنشاء أول ملاحظة
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group animate-slide-up"
                                onClick={() => navigate(`/notes/${note.id}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                        {note.title}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteRequest(note)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-muted-foreground text-left" dir="rtl">تم الإنشاء في: {formatDate(note.created_at)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <NoteModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreate}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="حذف الملاحظة؟"
                message="هل أنت متأكد أنك تريد حذف هذه الملاحظة؟ هذا الإجراء لا يمكن التراجع عنه."
                confirmLabel="حذف"
                cancelLabel="إلغاء"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}
