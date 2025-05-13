import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/VisitForm/DashBoard";
import VisitForm from "./components/VisitForm/VisitForm";
import MainNoteForm from "./components/VisitForm/MainNoteForm";
import MyForms from "./components/VisitForm/MyForms";
import ProtectedPage from "./components/ProtectedPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserForms from "./components/Admin/UserForms";
import InvoiceTable from "./components/Invoice/InvoiceTable";
import ClientManager from "./components/Clients/ClientManager";
import ReferralList from "./components/ReferralList"; // ✅ NEW

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
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
          element={
            <LoginForm
              onLogin={() => {
                setIsLoggedIn(true);
                const storedUser = localStorage.getItem("user");
                setUser(storedUser ? JSON.parse(storedUser) : null);
              }}
            />
          }
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <AdminDashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/user/:userId"
          element={
            isLoggedIn ? (
              <UserForms />
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
        <Route
          path="/invoice"
          element={
            isLoggedIn ? (
              <InvoiceTable />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/clients"
          element={
            isLoggedIn ? (
              <ClientManager onReturn={() => navigate("/dashboard")} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/referrals"
          element={
            isLoggedIn ? (
              <ReferralList />
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
