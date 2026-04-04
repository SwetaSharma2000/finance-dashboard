import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Toast from "./components/Toast";

export default function App() {
  const [activePage,  setActivePage]  = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    if (activePage === "dashboard")    return <Dashboard />;
    if (activePage === "transactions") return <Transactions />;
    if (activePage === "insights")     return <Insights />;
  };

  return (
    <div className="flex min-h-screen bg-[#060d1c] text-[#ddeeff] font-sans">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>

      {/* Global toast notifications */}
      <Toast />

    </div>
  );
}




