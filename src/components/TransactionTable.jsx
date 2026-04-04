import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";

const fmt    = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const inputClass = `
  bg-white/[0.04] border border-[#16263d] rounded-lg
  px-3 py-2 text-[12px] text-[#ddeeff] outline-none
  focus:border-[#00d9a6]/50 transition-colors
`;

export default function TransactionTable({ onEdit }) {
  const {
    filteredTransactions,
    role,
    search, setSearch,
    filterType, setFilterType,
    filterCat, setFilterCat,
    sortBy, setSortBy,
    deleteTransaction,
  } = useApp();

  return (
    <div className="flex flex-col gap-4">

      {/* ── Filters Bar ── */}
      <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl px-5 py-4">
        <div className="flex flex-wrap gap-3">

          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search transactions…"
            className={`${inputClass} flex-1 min-w-40`}
          />

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={inputClass}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={inputClass}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount ↓</option>
            <option value="amount-asc">Amount ↑</option>
          </select>

        </div>

        {/* Result count */}
        <p className="text-[11px] text-[#4d7799] mt-3">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl">

        {filteredTransactions.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-5xl">📭</span>
            <p className="text-[15px] font-semibold text-[#ddeeff]">No transactions found</p>
            <p className="text-[12px] text-[#4d7799]">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto px-1">
            <table className="w-full min-w-[860px] border-collapse">

              {/* Head */}
              <thead>
                <tr className="border-b border-[#16263d] bg-[#16263d]/40">
                  {["Date", "Description", "Category", "Type", "Amount", ...(role === "admin" ? ["Actions"] : [])].map((h) => (
                    // <th
                    //   key={h}
                    //   className={`
                    //     px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#4d7799]
                    //     ${h === "Amount" ? "text-right" : "text-left"}
                    //     ${h === "Actions" ? "text-center" : ""}
                    //   `}
                    // >
                    <th
                   key={h}
                  className={`
                  px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#4d7799]

                 ${h === "Date" ? "pl-8 text-left" : ""}
                 ${h === "Amount" ? "pr-3 text-right" : ""}
                 ${h === "Actions" ? "pr-6 text-right" : ""}
                 ${h !== "Amount" && h !== "Actions" && h !== "Date" ? "text-left" : ""}
                `}
               >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filteredTransactions.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    className={`
                      border-b border-[#16263d]/40
                      hover:bg-white/2 transition-colors
                      ${idx % 2 === 0 ? "" : "bg-white/1"}
                    `}
                  >
                    {/* Date */}
                    <td className="px-4 py-3 pr-8 text-[11px] text-[#4d7799] font-mono whitespace-nowrap">
                      {fmtDate(tx.date)}
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 text-[13px] text-[#ddeeff]">
                      {tx.description}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#4d7799]/20 text-[#4d7799]">
                        {tx.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span
                        className={`
                          px-3 py-1 rounded-full text-[10px] font-semibold
                          ${tx.type === "income"
                            ? "bg-[#00d9a6]/15 text-[#00d9a6]"
                            : "bg-[#ff6b71]/15 text-[#ff6b71]"
                          }
                        `}
                      >
                        {tx.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`
                        px-4 py-3 pr-5 font-mono font-bold text-right text-[13px]
                        ${tx.type === "income" ? "text-[#00d9a6]" : "text-[#ff6b71]"}
                      `}
                    >
                      {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                    </td>

                    {/* Admin actions */}
                    {role === "admin" && (
                      <td className="px-4 py-3 pr-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(tx)}
                            className="px-3 py-1 rounded-md text-[11px] font-semibold bg-[#f5c842]/10 border border-[#f5c842]/30 text-[#f5c842] hover:opacity-75 transition-opacity"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="px-3 py-1 rounded-md text-[11px] font-semibold bg-[#ff6b71]/10 border border-[#ff6b71]/30 text-[#ff6b71] hover:opacity-75 transition-opacity"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}