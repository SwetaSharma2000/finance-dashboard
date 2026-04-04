import { Menu, KeyRound, Eye, } from "lucide-react";
import { useApp } from "../context/AppContext";

const pageTitles = {
  dashboard:    { title: "Dashboard",    sub: "March 2025 · Personal Finance"              },
  transactions: { title: "Transactions", sub: "Manage and explore your transactions"       },
  insights:     { title: "Insights",     sub: "Understand your spending patterns"          },
};

export default function Topbar({ activePage, sidebarOpen, setSidebarOpen }) {
  const { role, setRole } = useApp();
  const { title, sub } = pageTitles[activePage];

  return (
    <header className="flex items-center justify-between px-6 h-[58px] bg-[#08111f] border-b border-[#16263d] shrink-0">

      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="text-[#4d7799] hover:text-[#ddeeff] transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-[15px] font-bold text-[#ddeeff]">{title}</h1>
          <p className="text-[10px] text-[#4d7799]">{sub}</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Role badge */}
        <div className={`
          flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold border
          ${role === "admin"
            ? "bg-[#f5c842]/10 border-[#f5c842]/40 text-[#f5c842]"
            : "bg-[#00d9a6]/10 border-[#00d9a6]/30 text-[#00d9a6]"
          }
        `}>
          {role === "admin"
            ? <KeyRound size={11} />
            : <Eye size={11} />
          }
          {role === "admin" ? "Admin" : "Viewer"}
        </div>

        {/* Role switcher */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-[#16263d] rounded-lg px-3 py-[5px]">
          <span className="text-[9px] text-[#4d7799] font-bold uppercase tracking-wider">
            Role
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={`
              bg-transparent border-none text-[12px] font-bold
              cursor-pointer outline-none
              ${role === "admin" ? "text-[#f5c842]" : "text-[#00d9a6]"}
            `}
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

     

      </div>
    </header>
  );
}

