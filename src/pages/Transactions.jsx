import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import TransactionTable from "../components/TransactionTable";
import TransactionModal from "../components/TransactionModal";
import { exportToCSV } from "../utils/exportCSV";
import toast from "react-hot-toast";

export default function Transactions() {
  const { role, filteredTransactions } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx,    setEditTx]    = useState(null);

  useEffect(() => {
    const handler = () => { setEditTx(null); setModalOpen(true); };
    window.addEventListener("open-add-modal", handler);
    return () => window.removeEventListener("open-add-modal", handler);
  }, []);

  const handleEdit = (tx) => {
    setEditTx(tx);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTx(null);
  };

  const handleExport = () => {
    if (!filteredTransactions.length) {
      toast.error("No transactions to export!");
      return;
    }
    exportToCSV(filteredTransactions);
    toast.success(`Exported ${filteredTransactions.length} transactions as CSV!`);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page heading ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#ddeeff]">Transactions</h2>
          <p className="text-[12px] text-[#4d7799] mt-1">
            View, search, filter and manage all your transactions
          </p>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3 shrink-0">

          {/* CSV Export — always visible */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-[#4d7799] border border-[#16263d] hover:border-[#00d9a6]/40 hover:text-[#00d9a6] bg-white/[0.02] transition-all duration-200"
          >
            <Download size={14} />
            Export CSV
          </button>

          {/* Add — admin only */}
          {role === "admin" && (
            <button
              onClick={() => { setEditTx(null); setModalOpen(true); }}
              className="flex items-center gap-2 bg-[#00d9a6] text-[#060d1c] font-bold text-[13px] px-4 py-2 rounded-xl hover:opacity-85 transition-opacity"
            >
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* ── Viewer notice ── */}
      {role === "viewer" && (
        <div className="bg-[#00d9a6]/5 border border-[#00d9a6]/20 rounded-xl px-4 py-3 text-[12px] text-[#00d9a6]">
          👁 You are in <strong>Viewer</strong> mode. Switch to Admin using the role selector in the top bar to add or edit transactions.
        </div>
      )}

      {/* ── Table ── */}
      <TransactionTable onEdit={handleEdit} />

      {/* ── Modal ── */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={handleClose}
        editTx={editTx}
      />

    </div>
  );
}