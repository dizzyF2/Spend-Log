use serde::{Serialize, Deserialize};
use rusqlite::{params, Connection, Result};

#[derive(Serialize, Deserialize)]
pub struct Entry {
    pub id: i64,
    pub note_id: i64,
    pub description: String,
    pub amount: f64,
    pub created_at: i64,
}

impl Entry {
    pub fn create(conn: &Connection, note_id: i64, description: &str, amount: f64) -> Result<Entry> {
        let now = chrono::Utc::now().timestamp();
        conn.execute(
            "INSERT INTO entries (note_id, description, amount, created_at) VALUES (?1, ?2, ?3, ?4)",
            params![note_id, description, amount, now],
        )?;
        let id = conn.last_insert_rowid();
        Ok(Entry {
            id,
            note_id,
            description: description.to_string(),
            amount,
            created_at: now,
        })
    }

    pub fn all_for_note(conn: &Connection, note_id: i64) -> Result<Vec<Entry>> {
        let mut stmt = conn.prepare(
            "SELECT id, note_id, description, amount, created_at 
            FROM entries 
            WHERE note_id = ?1 
            ORDER BY created_at DESC"
        )?;
        let entries = stmt.query_map([note_id], |row| {
            Ok(Entry {
                id: row.get(0)?,
                note_id: row.get(1)?,
                description: row.get(2)?,
                amount: row.get(3)?,
                created_at: row.get(4)?,
            })
        })?;
        Ok(entries.filter_map(Result::ok).collect())
    }

    pub fn update(conn: &Connection, id: i64, description: &str, amount: f64) -> Result<()> {
        conn.execute(
            "UPDATE entries SET description = ?1, amount = ?2 WHERE id = ?3",
            params![description, amount, id],
        )?;
        Ok(())
    }

    pub fn delete(conn: &Connection, id: i64) -> Result<()> {
        conn.execute("DELETE FROM entries WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn sum_all(conn: &Connection) -> Result<f64> {
        let mut stmt = conn.prepare("SELECT IFNULL(SUM(amount), 0) FROM entries")?;
        let sum: f64 = stmt.query_row([], |row| row.get(0))?;
        Ok(sum)
    }

    pub fn sum_for_note(conn: &Connection, note_id: i64) -> Result<f64> {
        let mut stmt = conn.prepare("SELECT IFNULL(SUM(amount), 0) FROM entries WHERE note_id = ?1")?;
        let sum: f64 = stmt.query_row([note_id], |row| row.get(0))?;
        Ok(sum)
    }
}
