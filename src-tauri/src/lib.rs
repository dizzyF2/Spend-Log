mod db;
mod models;

use db::init_db;
use tauri::AppHandle;

use models::note::Note;
use models::entry::Entry;
use models::budget::Budget;


// ---------------- NOTES ----------------
#[tauri::command]
fn create_note(app: AppHandle, title: String) -> Result<Note, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Note::create(&conn, &title).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_notes(app: AppHandle) -> Result<Vec<Note>, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Note::all(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_note(app: AppHandle, id: i64, title: String) -> Result<(), String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Note::update(&conn, id, &title).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_note(app: AppHandle, id: i64) -> Result<(), String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Note::delete(&conn, id).map_err(|e| e.to_string())
}

// ---------------- ENTRIES ----------------
#[tauri::command]
fn create_entry(app: AppHandle, note_id: i64, description: String, amount: f64) -> Result<Entry, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Entry::create(&conn, note_id, &description, amount).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_entries(app: AppHandle, note_id: i64) -> Result<Vec<Entry>, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Entry::all_for_note(&conn, note_id).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_entry(app: AppHandle, id: i64, description: String, amount: f64) -> Result<(), String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Entry::update(&conn, id, &description, amount).map_err(|e| e.to_string())
}

#[tauri::command]
fn delete_entry(app: AppHandle, id: i64) -> Result<(), String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Entry::delete(&conn, id).map_err(|e| e.to_string())
}

#[tauri::command]
fn sum_all_entries(app: AppHandle) -> Result<f64, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Entry::sum_all(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn sum_entries_for_note(app: AppHandle, note_id: i64) -> Result<f64, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Entry::sum_for_note(&conn, note_id).map_err(|e| e.to_string())
}

// ---------------- BUDGET ----------------
#[tauri::command]
fn set_budget(app: AppHandle, amount: f64) -> Result<(), String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Budget::set(&conn, amount).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_budget(app: AppHandle) -> Result<f64, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Budget::get(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_remaining_budget(app: AppHandle) -> Result<f64, String> {
    let conn = init_db(&app).map_err(|e| e.to_string())?;
    Budget::remaining(&conn).map_err(|e| e.to_string())
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // note
            create_note,
            get_notes,
            update_note,
            delete_note,
            // entry
            create_entry,
            get_entries,
            update_entry,
            delete_entry,
            sum_all_entries,
            sum_entries_for_note,
            //budget
            set_budget,
            get_budget,
            get_remaining_budget,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
