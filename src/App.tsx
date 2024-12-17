import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Login from "./pages/Login"
import AdminPage from "./pages/AdminPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminEditArtist from "./pages/admin/AdminEditArtist"
import AdminLanguages from "./pages/admin/AdminLanguages"
import ArtistDetail from "./pages/ArtistDetail"
import LanguagePage from "./pages/LanguagePage"
import { AuthRoute } from "./components/auth/AuthRoute"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/language/:language" element={<LanguagePage />} />
        <Route path="/artist/:username" element={<ArtistDetail />} />
        <Route
          path="/admin"
          element={
            <AuthRoute>
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            </AuthRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="edit/:id" element={<AdminEditArtist />} />
          <Route path="languages" element={<AdminLanguages />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App