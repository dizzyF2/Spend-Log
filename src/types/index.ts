export interface Note {
    id: number;
    title: string;
    created_at: number;
}

export interface Entry {
    id: number;
    note_id: number;
    description: string;
    amount: number;
    created_at: number;
}