use rusqlite::{params, Connection, Result};

pub struct Budget;

impl Budget {
    pub fn set(conn: &Connection, note_id: i64, amount: f64) -> Result<()> {
        conn.execute(
            "INSERT INTO budgets (note_id, initial_amount) VALUES (?1, ?2)
            ON CONFLICT(note_id) DO UPDATE SET initial_amount = excluded.initial_amount",
            params![note_id, amount],
        )?;
        Ok(())
    }

    pub fn get(conn: &Connection, note_id: i64) -> Result<f64> {
        let mut stmt = conn.prepare("SELECT initial_amount FROM budgets WHERE note_id = ?1")?;
        let amount: f64 = stmt.query_row(params![note_id], |row| row.get(0))?;
        Ok(amount)
    }

    pub fn remaining(conn: &Connection, note_id: i64) -> Result<f64> {
        let initial = Self::get(conn, note_id)?;
        let mut stmt = conn.prepare("SELECT IFNULL(SUM(amount), 0) FROM entries WHERE note_id = ?1")?;
        let spent: f64 = stmt.query_row(params![note_id], |row| row.get(0))?;
        Ok(initial - spent)
    }
}
