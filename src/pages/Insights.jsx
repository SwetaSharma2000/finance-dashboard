import { useApp } from "../context/AppContext";
import { monthlyData } from "../data/mockData";
import BarChartView from "../components/charts/BarChartView";

const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");

const COLORS = [
  "#00d9a6", "#f5c842", "#ff6b71",
  "#a78bfa", "#60a5fa", "#fb923c", "#4ade80"
];

export default function Insights() {
  const { categorySpending, summary } = useApp();

  const total       = categorySpending.reduce((s, c) => s + c.value, 0);
  const topCat      = categorySpending[0];
  const prev        = monthlyData[4]; // Feb
  const curr        = monthlyData[5]; // Mar
  const expDelta    = curr.expenses - prev.expenses;
  const expDeltaPct = Math.abs(Math.round((expDelta / prev.expenses) * 100));
  const isUp        = expDelta > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page heading ── */}
      <div>
        <h2 className="text-[18px] font-bold text-[#ddeeff]">Insights</h2>
        <p className="text-[12px] text-[#4d7799] mt-1">
          Understand your spending patterns and financial health
        </p>
      </div>

      {/* ── Key Insight Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Top spending */}
        <div className="bg-[#0b1729] border border-[#f5c842]/30 rounded-2xl p-5 bg-linear-to-br from-[#f5c842]/10 to-[#0b1729]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-2">🏆 Top Category</p>
          <p className="text-[20px] font-bold text-[#f5c842]">{topCat?.name ?? "—"}</p>
          <p className="text-[11px] text-[#4d7799] mt-1">{topCat ? fmt(topCat.value) + " spent" : "No data"}</p>
        </div>

        {/* Expense trend */}
        <div className={`bg-[#0b1729] rounded-2xl p-5 bg-linear-to-br to-[#0b1729] border ${isUp ? "border-[#ff6b71]/30 from-[#ff6b71]/10" : "border-[#00d9a6]/30 from-[#00d9a6]/10"}`}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-2">📊 Expense Trend</p>
          <p className={`text-[20px] font-bold ${isUp ? "text-[#ff6b71]" : "text-[#00d9a6]"}`}>
            {isUp ? "▲" : "▼"} {expDeltaPct}%
          </p>
          <p className="text-[11px] text-[#4d7799] mt-1">
            {fmt(prev.expenses)} → {fmt(curr.expenses)}
          </p>
        </div>

        {/* Saved */}
        <div className="bg-[#0b1729] border border-[#00d9a6]/30 rounded-2xl p-5 bg-linear-to-br from-[#00d9a6]/10 to-[#0b1729]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-2">🎯 Saved This Month</p>
          <p className="text-[20px] font-bold text-[#00d9a6]">{fmt(summary.income - summary.expenses)}</p>
          <p className="text-[11px] text-[#4d7799] mt-1">{summary.savingsRate}% of income</p>
        </div>

        {/* Highest single expense */}
        <div className="bg-[#0b1729] border border-[#a78bfa]/30 rounded-2xl p-5 bg-linear-to-br from-[#a78bfa]/10 to-[#0b1729]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-2">💼 Income (Mar)</p>
          <p className="text-[20px] font-bold text-[#a78bfa]">{fmt(curr.income)}</p>
          <p className="text-[11px] text-[#4d7799] mt-1">March 2025</p>
        </div>

      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar chart */}
        <div className="lg:col-span-2">
          <BarChartView />
        </div>

        {/* Category breakdown bars */}
        <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5">
          <p className="text-[13px] font-semibold text-[#ddeeff] mb-5">
            📂 Category Share
          </p>
          <div className="flex flex-col gap-4">
            {categorySpending.map((c, i) => {
              const pct = total > 0 ? Math.round((c.value / total) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#ddeeff] font-medium">{c.name}</span>
                    <span className="text-[#4d7799] font-mono">{pct}%</span>
                  </div>
                  <div className="h-1.25 bg-[#16263d] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tip */}
          {topCat && (
            <div className="mt-5 bg-[#00d9a6]/10 border border-[#00d9a6]/25 rounded-xl px-4 py-3 text-[11px] text-[#00d9a6]">
              💡 <strong>{topCat.name}</strong> is your biggest expense at{" "}
              {total > 0 ? Math.round((topCat.value / total) * 100) : 0}% of total spending.
            </div>
          )}
        </div>

      </div>

      {/* ── Monthly Comparison Table ── */}
      <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5">
        <p className="text-[13px] font-semibold text-[#ddeeff] mb-5">
          📅 Month-by-Month Comparison
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 border-collapse">
            <thead>
              <tr className="border-b border-[#16263d]">
                {["Month", "Income", "Expenses", "Saved", "Savings Rate"].map((h) => (
                  <th key={h} className="pb-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#4d7799]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, i) => {
                const saved = row.income - row.expenses;
                const rate  = Math.round((saved / row.income) * 100);
                const isLast = i === monthlyData.length - 1;
                return (
                  <tr
                    key={row.month}
                    className={`border-b border-[#16263d]/40 ${isLast ? "bg-[#00d9a6]/5" : ""}`}
                  >
                    <td className={`py-3 text-[13px] font-semibold ${isLast ? "text-[#00d9a6]" : "text-[#ddeeff]"}`}>
                      {row.month} {isLast && "← current"}
                    </td>
                    <td className="py-3 text-[13px] font-mono text-[#00d9a6]">
                      {fmt(row.income)}
                    </td>
                    <td className="py-3 text-[13px] font-mono text-[#ff6b71]">
                      {fmt(row.expenses)}
                    </td>
                    <td className="py-3 text-[13px] font-mono text-[#f5c842]">
                      {fmt(saved)}
                    </td>
                    <td className="py-3">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${rate >= 30 ? "bg-[#00d9a6]/15 text-[#00d9a6]" : "bg-[#f5c842]/15 text-[#f5c842]"}`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}