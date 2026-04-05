import { LayoutDashboard, ArrowLeftRight, Lightbulb } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";




const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight   },
  { id: "insights",     label: "Insights",     icon: Lightbulb        },
];

export default function Sidebar({ activePage, setActivePage, sidebarOpen }) {


   const [mounted, setMounted] = useState(false);   // ✅ INSIDE
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* DESKTOP — show ONLY when sidebarOpen */}
      
        

        <aside className={`
      hidden lg:flex flex-col bg-[#08111f] border-r border-[#16263d]
      shrink-0
      ${mounted ? "transition-all duration-300" : ""}
      ${sidebarOpen ? "w-52" : "w-14"}
      `}>
       <SidebarContent
       activePage={activePage}
       setActivePage={setActivePage}
       sidebarOpen={sidebarOpen}
       />
    </aside>
      

      {/* MOBILE — overlay */}
      <aside
        className={`
          lg:hidden flex flex-col bg-[#08111f] border-r border-[#16263d]
          fixed left-0 top-0 h-full z-50
          transition-all duration-300

           w-[75%] max-w-[280px]
          
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={true}
        />
      </aside>
    </>
  );
}

function SidebarContent({ activePage, setActivePage, sidebarOpen }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-[#16263d] min-h-[58px]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00d9a6] to-[#0099ff] flex items-center justify-center text-[#060d1c] font-bold text-base shrink-0">
          ₹
        </div>
        {sidebarOpen && (
          <span className="font-bold text-[15px] whitespace-nowrap text-[#ddeeff]">
            Zorvyn
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`
                w-full flex items-center gap-3 my-[2px] rounded-lg cursor-pointer
                transition-all duration-200 text-[13px] font-medium px-4 py-[10px]
                ${isActive
                  ? "bg-[#00d9a6]/10 text-[#00d9a6] border-l-[3px] border-[#00d9a6]"
                  : "text-[#4d7799] hover:text-[#ddeeff] hover:bg-white/5 border-l-[3px] border-transparent"
                }
              `}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} className="shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3 px-3 py-4 border-t border-[#16263d]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] flex items-center justify-center text-[13px] font-bold shrink-0 text-white">
          S
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-[13px] font-semibold whitespace-nowrap text-[#ddeeff]">
              Sweta Sharma
            </p>
            <RoleBadge />
          </div>
        )}
      </div>
    </>
  );
}

function RoleBadge() {
  const { role } = useApp();
  return (
    <p className={`text-[11px] font-medium capitalize ${role === "admin" ? "text-[#f5c842]" : "text-[#00d9a6]"}`}>
      {role}
    </p>
  );
}