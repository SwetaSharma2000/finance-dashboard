import { createContext, useContext, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { transactions as initialTransactions } from "../data/mockData";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role,         setRole]         = useState("viewer");
  const [search,       setSearch]       = useState("");
  const [filterType,   setFilterType]   = useState("all");
  const [filterCat,    setFilterCat]    = useState("All");
  const [sortBy,       setSortBy]       = useState("date-desc");

  const addTransaction = (tx) => {
    setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev]);
    toast.success("Transaction added successfully!");
  };

  const updateTransaction = (tx) => {
    setTransactions((prev) => prev.map((t) => t.id === tx.id ? tx : t));
    toast.success("Transaction updated!");
  };

  const deleteTransaction = (id) => {
    // Custom toast with undo feel
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>🗑️ Transaction deleted</span>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-[#ff6b71] text-[12px] font-bold underline"
        >
          Dismiss
        </button>
      </div>
    ), {
      icon: null,
      style: {
        background: "#0b1729",
        color: "#ddeeff",
        border: "1px solid #ff6b71/30",
        borderRadius: "14px",
        fontSize: "13px",
        padding: "12px 16px",
      },
    });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Role change toast
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") {
      toast.success("Switched to Admin — you can now add and edit transactions.");
    } else {
      toast("Switched to Viewer — read only mode.", {
        icon: "👁",
      });
    }
  };

  const summary = useMemo(() => {
    const march    = transactions.filter((t) => t.date.startsWith("2025-03"));
    const income   = march.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = march.filter((t) => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0);
    return {
      income,
      expenses,
      balance: income - expenses,
      savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let tx = [...transactions];
    if (filterType !== "all") tx = tx.filter((t) => t.type === filterType);
    if (filterCat  !== "All") tx = tx.filter((t) => t.category === filterCat);
    if (search) tx = tx.filter((t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
    tx.sort((a, b) => {
      if (sortBy === "date-desc")   return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc")    return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return Math.abs(b.amount) - Math.abs(a.amount);
      return Math.abs(a.amount) - Math.abs(b.amount);
    });
    return tx;
  }, [transactions, filterType, filterCat, search, sortBy]);

  const categorySpending = useMemo(() => {
    const cats = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + Math.abs(t.amount);
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <AppContext.Provider value={{
      transactions, filteredTransactions, summary, categorySpending,
      role, setRole: handleRoleChange,
      search,     setSearch,
      filterType, setFilterType,
      filterCat,  setFilterCat,
      sortBy,     setSortBy,
      addTransaction, updateTransaction, deleteTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);