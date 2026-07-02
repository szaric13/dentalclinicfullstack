import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Toaster } from "react-hot-toast"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { ThemeProvider } from "./context/ThemeContext.jsx"
import { LanguageProvider } from "./context/LanguageContext.jsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "var(--card)",
                    color: "var(--card-foreground)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                  },
                  success: { iconTheme: { primary: "oklch(0.65 0.15 155)", secondary: "white" } },
                  error: { iconTheme: { primary: "oklch(0.58 0.21 25)", secondary: "white" } },
                }}
              />
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
