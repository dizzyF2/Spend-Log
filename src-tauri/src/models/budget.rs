use rusqlite::{params, Connection, Result};

pub struct Budget;

impl Budget {
    pub fn set(conn: &Connection, amount: f64) -> Result<()> {
        conn.execute(
            "INSERT INTO budget (id, initial_amount) VALUES (1, ?1)
            ON CONFLICT(id) DO UPDATE SET initial_amount = excluded.initial_amount",
            params![amount],
        )?;
        Ok(())
    }

    
    pub fn get(conn: &Connection) -> Result<f64> {
        let mut stmt = conn.prepare("SELECT initial_amount FROM budget WHERE id = 1")?;
        let amount: f64 = stmt.query_row([], |row| row.get(0))?;
        Ok(amount)
    }

    
    pub fn remaining(conn: &Connection) -> Result<f64> {
        let initial = Self::get(conn)?;
        let mut stmt = conn.prepare("SELECT IFNULL(SUM(amount), 0) FROM entries")?;
        let spent: f64 = stmt.query_row([], |row| row.get(0))?;
        Ok(initial - spent)
    }
}
