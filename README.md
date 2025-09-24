# Spend-Log

simple budgeting notes desktop app where users can create notes, assign a budget to each note, and track expenses through entries.

---

## ✨ Features

- 📝 Note Management – Create, edit, and organize notes for different spending categories.
- 💰 Expense Tracking – Add, update, and delete expense entries with descriptions and amounts.
- 📊 Budget Monitoring – Set budgets per note and track total spent vs. remaining budget.
- 🌐 Arabic UI – Fully translated interface for Arabic-speaking users.

---

## 🛠️ Technologies Used

- **Tauri** – For building secure and lightweight cross-platform apps.  
- **Rust** – Backend logic and database queries.  
- **React.js + TypeScript** – Frontend for a smooth UI/UX.  
- **SQLite3** – Local database for fast and reliable storage.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)  
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)  
- [SQLite3](https://www.sqlite.org/download.html)  

### Installation

```bash
# Clone the repository
git clone https://github.com/dizzyF2/Spend-Log.git
cd Spend-Log

# Install dependencies
npm install

# Run in development
npm run tauri dev

# Build for production
npm run tauri build
