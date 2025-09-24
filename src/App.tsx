import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import NotesPage from "./pages/NotesPage";
import NoteDetail from "./pages/NoteDetail";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "green",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
            },
          },
          error: {
            style: {
              background: "red",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
            },
          },
        }}
      />
    </>
  );
}

export default App;
