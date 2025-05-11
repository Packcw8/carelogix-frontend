import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/VisitForm/DashBoard";
import VisitForm from "./components/VisitForm/VisitForm";
import MainNoteForm from "./components/VisitForm/MainNoteForm";
import MyForms from "./components/VisitForm/MyForms";
import ProtectedPage from "./components/ProtectedPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />
        <Route
          path="/login"
          element={<LoginForm onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/form/visit"
          element={
            isLoggedIn ? (
              <>
                <ProtectedPage />
                <VisitForm onReturn={() => navigate("/dashboard")} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/form/main_note"
          element={
            isLoggedIn ? (
              <>
                <ProtectedPage />
                <MainNoteForm onReturn={() => navigate("/dashboard")} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/myforms"
          element={
            isLoggedIn ? (
              <MyForms onReturn={() => navigate("/dashboard")} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;




