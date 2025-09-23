use rusqlite::{Connection, Result};
use std::fs;
use std::path::PathBuf;
use tauri::path::BaseDirectory;
use tauri::AppHandle;
use tauri::Manager;


pub fn init_db(app: &AppHandle) -> Result<Connection> {
    let path: PathBuf = app
        .path()
        .resolve("spendlog.db", BaseDirectory::AppData)
        .unwrap();

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }

    let conn = Connection::open(path)?;

    
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER NOT NULL,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            created_at INTEGER NOT NULL,
            FOREIGN KEY(note_id) REFERENCES notes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY CHECK(id = 1),
            initial_amount REAL NOT NULL
        );
        INSERT OR IGNORE INTO budget(id, initial_amount) VALUES(1, 0);
        "
    )?;

    Ok(conn)
}
