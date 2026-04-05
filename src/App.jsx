import { useState,useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Toast from "./components/Toast";

export default function App() {
  const [activePage,  setActivePage]  = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(
  window.innerWidth >= 1024
);

  
const renderPage = () => {
    if (activePage === "dashboard")    return <Dashboard />;
    if (activePage === "transactions") return <Transactions />;
    if (activePage === "insights")     return <Insights />;
  };

  return (
    <div className="flex min-h-screen bg-[#060d1c] text-[#ddeeff] font-sans ">

      {/* Mobile backdrop only */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (window.innerWidth < 1024) setSidebarOpen(false);
        }}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          activePage={activePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {renderPage()}
        </main>
      </div>

      <Toast />
    </div>
  );
}




