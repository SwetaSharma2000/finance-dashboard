import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";

const inputClass = `
  w-full bg-white/[0.04] border border-[#16263d] rounded-lg
  px-3 py-2 text-[13px] text-[#ddeeff] outline-none
  focus:border-[#00d9a6]/50 transition-colors
`;

const labelClass = `
  block text-[10px] font-bold uppercase tracking-widest
  text-[#4d7799] mb-2
`;

export default function TransactionModal({ isOpen, onClose, editTx }) {
  const { addTransaction, updateTransaction } = useApp();

  const emptyForm = {
    date: "",
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
  };

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editTx) {
      setForm({
        ...editTx,
        amount: Math.abs(editTx.amount).toString(),
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [editTx, isOpen]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    // Validation
    if (!form.date || !form.description.trim() || !form.amount) {
      setError("Please fill in all fields.");
      return;
    }
    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    const amt = parseFloat(form.amount);
    const finalTx = {
      ...form,
      amount: form.type === "expense" ? -Math.abs(amt) : Math.abs(amt),
    };

    if (editTx) {
      updateTransaction({ ...finalTx, id: editTx.id });
    } else {
      addTransaction(finalTx);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-[#060d1c]/90 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal box */}
      <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-7 w-full max-w-100 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-bold text-[#ddeeff]">
            {editTx ? "✏️ Edit Transaction" : "➕ New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#4d7799] hover:text-[#ddeeff] text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Date */}
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Monthly Salary"
              className={inputClass}
            />
          </div>

          {/* Amount + Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="0"
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputClass}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            >
              {categories
                .filter((c) => c !== "All")
                .map((c) => <option key={c}>{c}</option>)
              }
            </select>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-[#ff6b71] text-[12px] bg-[#ff6b71]/10 border border-[#ff6b71]/30 rounded-lg px-3 py-2">
              ⚠️ {error}
            </p>
          )}

        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#00d9a6] text-[#060d1c] font-bold text-[13px] py-2.5 rounded-xl hover:opacity-85 transition-opacity"
          >
            {editTx ? "Save Changes" : "Add Transaction"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-transparent text-[#4d7799] font-medium text-[13px] py-2.5 rounded-xl border border-[#16263d] hover:border-[#4d7799]/50 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}