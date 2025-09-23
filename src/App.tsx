import { Toaster } from "react-hot-toast";


function App() {


  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
            success: {
              style: {
                background: "green",
                color: "white",
                padding: '16px',
                borderRadius: '8px',
              }
            },
            error: {
              style: {
                background: "red",
                color: "white",
                padding: '16px',
                borderRadius: '8px',
              }
            }
        }}
      />
    </>
  );
}

export default App;
