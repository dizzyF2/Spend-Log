use serde::{Serialize, Deserialize};
use rusqlite::{params, Connection, Result};

#[derive(Serialize, Deserialize)]
pub struct Note {
    pub id: i64,
    pub title: String,
    pub created_at: i64,
}

impl Note {
    pub fn create(conn: &Connection, title: &str) -> Result<Note> {
        let now = chrono::Utc::now().timestamp();
        conn.execute(
            "INSERT INTO notes (title, created_at) VALUES (?1, ?2)",
            params![title, now],
        )?;
        let id = conn.last_insert_rowid();
        Ok(Note { id, title: title.to_string(), created_at: now })
    }

    pub fn all(conn: &Connection) -> Result<Vec<Note>> {
        let mut stmt = conn.prepare("SELECT id, title, created_at FROM notes ORDER BY created_at DESC")?;
        let notes = stmt.query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                created_at: row.get(2)?,
            })
        })?;
        Ok(notes.filter_map(Result::ok).collect())
    }

    pub fn update(conn: &Connection, id: i64, title: &str) -> Result<()> {
        conn.execute("UPDATE notes SET title = ?1 WHERE id = ?2", params![title, id])?;
        Ok(())
    }

    pub fn delete(conn: &Connection, id: i64) -> Result<()> {
        conn.execute("DELETE FROM notes WHERE id = ?1", params![id])?;
        Ok(())
    }
}
