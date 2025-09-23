import { Entry, Note } from "@/types";
import { invoke } from "@tauri-apps/api/core";


// ---------- Notes ----------
export const createNote = (title: string) =>
    invoke<Note>("create_note", { title });

export const getNotes = () =>
    invoke<Note[]>("get_notes");

export const updateNote = (id: number, title: string) =>
    invoke<void>("update_note", { id, title });

export const deleteNote = (id: number) =>
    invoke<void>("delete_note", { id });


// ---------- Entries ----------
export const createEntry = (noteId: number, description: string, amount: number) =>
    invoke<Entry>("create_entry", { noteId, description, amount });

export const getEntries = (noteId: number) =>
    invoke<Entry[]>("get_entries", { noteId });

export const updateEntry = (id: number, description: string, amount: number) =>
    invoke<void>("update_entry", { id, description, amount });

export const deleteEntry = (id: number) =>
    invoke<void>("delete_entry", { id });

export const sumAllEntries = () =>
    invoke<number>("sum_all_entries");

export const sumEntriesForNote = (noteId: number) =>
    invoke<number>("sum_entries_for_note", { noteId });


// ---------- Budget ----------
export const setBudget = (amount: number) =>
    invoke<void>("set_budget", { amount });

export const getBudget = () =>
    invoke<number>("get_budget");

export const getRemainingBudget = () =>
    invoke<number>("get_remaining_budget");