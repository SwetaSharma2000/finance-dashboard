import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import BarChartView from "../components/charts/BarChartView";
import PieChartView from "../components/charts/PieChartView";

const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");

export default function Dashboard() {
  const { summary } = useApp();

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page heading ── */}
      <div>
        <h2 className="text-[18px] font-bold text-[#ddeeff]">
          Good morning, Sweta 👋
        </h2>
        <p className="text-[12px] text-[#4d7799] mt-1">
          Here's your financial overview for March 2025
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Balance"
          value={fmt(summary.balance)}
          sub="Net this month"
          color="green"
          icon="💰"
        />
        <StatCard
          label="Total Income"
          value={fmt(summary.income)}
          sub="March 2025"
          color="yellow"
          icon="📈"
        />
        <StatCard
          label="Total Expenses"
          value={fmt(summary.expenses)}
          sub="March 2025"
          color="red"
          icon="📉"
        />
        <StatCard
          label="Savings Rate"
          value={`${summary.savingsRate}%`}
          sub="of income saved"
          color="purple"
          icon="🏦"
          isPercentage={true} 
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BarChartView />
        </div>
        <div className="lg:col-span-1">
          <PieChartView />
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-3">
            💳 Recent Activity
          </p>
          <p className="text-[22px] font-bold font-mono text-[#ddeeff]">
            {fmt(summary.income + summary.expenses * -1)}
          </p>
          <p className="text-[11px] text-[#4d7799] mt-1">
            Net cashflow this month
          </p>
        </div>

        <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-3">
            🎯 Savings Goal
          </p>
          <div className="flex items-end gap-2 mb-3">
            <p className="text-[22px] font-bold font-mono text-[#00d9a6]">
              {summary.savingsRate}%
            </p>
            <p className="text-[11px] text-[#4d7799] mb-1">of 30% goal</p>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-[#16263d] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00d9a6] rounded-full transition-all duration-700"
              style={{ width: `${Math.min(summary.savingsRate, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799] mb-3">
            📅 This Month
          </p>
          <p className="text-[22px] font-bold font-mono text-[#f5c842]">
            March 2025
          </p>
          <p className="text-[11px] text-[#4d7799] mt-1">
            {summary.expenses > 0
              ? `Spent ${fmt(summary.expenses)} so far`
              : "No expenses recorded yet"}
          </p>
        </div>

      </div>
    </div>
  );
}