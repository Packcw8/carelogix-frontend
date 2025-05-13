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
import ReferralList from "./components/ReferralList";
import Layout from "./components/Layout";
import ReferralUploadForm from "./components/ReferralUploadForm";
import MyInvoices from "./components/Invoice/MyInvoices";  // ✅ correct path


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

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={() => {
          setIsLoggedIn(true);
          const storedUser = localStorage.getItem("user");
          setUser(storedUser ? JSON.parse(storedUser) : null);
        }} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // ✅ All logged-in pages are now wrapped in Layout
  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} user={user} />} />
        <Route path="/admin" element={<AdminDashboard onLogout={handleLogout} user={user} />} />
        <Route path="/admin/user/:userId" element={<UserForms />} />
        <Route path="/form/visit" element={<><ProtectedPage /><VisitForm onReturn={() => navigate("/dashboard")} /></>} />
        <Route path="/form/main_note" element={<><ProtectedPage /><MainNoteForm onReturn={() => navigate("/dashboard")} /></>} />
        <Route path="/myforms" element={<MyForms onReturn={() => navigate("/dashboard")} />} />
        <Route path="/invoice" element={<InvoiceTable />} />
        <Route path="/clients" element={<ClientManager onReturn={() => navigate("/dashboard")} />} />
        <Route path="/referrals" element={<ReferralList />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
        <Route path="/referrals/upload" element={<ReferralUploadForm />} />
        <Route path="/Invoices" element={<MyInvoices />} />


      </Routes>
    </Layout>
  );
}

export default App;
