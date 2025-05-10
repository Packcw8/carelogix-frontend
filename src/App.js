import { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ProtectedPage from "./components/ProtectedPage";
import VisitForm from "./components/VisitForm/VisitForm";
import MainNoteForm from "./components/VisitForm/MainNoteForm";
import Dashboard from "./components/VisitForm/DashBoard";
import MyForms from "./components/VisitForm/MyForms"; // ✅ NEW import

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("auth_token"));
  const [view, setView] = useState(loggedIn ? "dashboard" : "login"); // login, register, dashboard, form, myforms
  const [formType, setFormType] = useState(null); // "visit" or "main_note"

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setLoggedIn(false);
    setView("login");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {!loggedIn ? (
        <>
          {view === "login" ? (
            <>
              <LoginForm onLogin={() => {
                setLoggedIn(true);
                setView("dashboard");
              }} />
              <p className="mt-4 text-sm">
                Don't have an account?{" "}
                <button className="text-blue-600 underline" onClick={() => setView("register")}>
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm />
              <p className="mt-4 text-sm">
                Already have an account?{" "}
                <button className="text-blue-600 underline" onClick={() => setView("login")}>
                  Login here
                </button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">CareLogix Dashboard</h2>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>

          {view === "dashboard" && (
            <Dashboard
              onStartVisitForm={() => {
                setFormType("visit");
                setView("form");
              }}
              onStartMainNoteForm={() => {
                setFormType("main_note");
                setView("form");
              }}
              onLogout={handleLogout}
              onView={(v) => setView(v)} // ✅ passed down
            />
          )}

          {view === "form" && (
            <>
              <ProtectedPage />
              {formType === "visit" && <VisitForm onReturn={() => setView("dashboard")} />}
              {formType === "main_note" && <MainNoteForm onReturn={() => setView("dashboard")} />}
            </>
          )}

          {view === "myforms" && ( // ✅ NEW VIEW
            <MyForms onReturn={() => setView("dashboard")} />
          )}
        </>
      )}
    </div>
  );
}

export default App;

