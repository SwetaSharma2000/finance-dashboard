import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, Legend
} from "recharts";
import { monthlyData } from "../../data/mockData";

const fmt = (n) => "₹" + n.toLocaleString("en-IN");

// Average expenses reference line value
const avgExpenses = Math.round(
  monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const income   = payload.find((p) => p.dataKey === "income")?.value   ?? 0;
  const expenses = payload.find((p) => p.dataKey === "expenses")?.value ?? 0;
  const saved    = income - expenses;
  const rate     = income > 0 ? Math.round((saved / income) * 100) : 0;

  return (
    <div className="bg-[#0a1628] border border-[#16263d] rounded-2xl px-5 py-4 shadow-2xl min-w-[180px]">
      <p className="text-[#4d7799] text-[11px] font-bold uppercase tracking-widest mb-3">
        {label} {payload?.[0]?.payload?.year}
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-6">
          <span className="flex items-center gap-1.5 text-[12px] text-[#4d7799]">
            <span className="w-2 h-2 rounded-full bg-[#00d9a6] inline-block" />
            Income
          </span>
          <span className="text-[12px] font-bold font-mono text-[#00d9a6]">
            {fmt(income)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="flex items-center gap-1.5 text-[12px] text-[#4d7799]">
            <span className="w-2 h-2 rounded-full bg-[#ff6b71] inline-block" />
            Expenses
          </span>
          <span className="text-[12px] font-bold font-mono text-[#ff6b71]">
            {fmt(expenses)}
          </span>
        </div>
        <div className="border-t border-[#16263d] my-1" />
        <div className="flex justify-between items-center gap-6">
          <span className="text-[12px] text-[#4d7799]">Saved</span>
          <span className={`text-[12px] font-bold font-mono ${saved >= 0 ? "text-[#f5c842]" : "text-[#ff6b71]"}`}>
            {fmt(saved)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-[12px] text-[#4d7799]">Rate</span>
          <span className={`text-[12px] font-bold ${rate >= 30 ? "text-[#00d9a6]" : "text-[#f5c842]"}`}>
            {rate}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Gradient bar colors
const INCOME_GRADIENT  = "incomeGradient";
const EXPENSE_GRADIENT = "expenseGradient";

const CustomLegend = () => (
  <div className="flex items-center justify-center gap-6 mt-3">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#00b389] to-[#00d9a6] inline-block" />
      <span className="text-[11px] text-[#4d7799]">Income</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#cc3b40] to-[#ff6b71] inline-block" />
      <span className="text-[11px] text-[#4d7799]">Expenses</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-6 h-[2px] border-t-2 border-dashed border-[#f5c842] inline-block" />
      <span className="text-[11px] text-[#4d7799]">Avg Expenses</span>
    </div>
  </div>
);

export default function BarChartView() {
  return (
    <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5 h-full       transition-all duration-300
    hover:scale-[1.01]

    shadow-[0_0_25px_rgba(168,85,247,0.15)]
    hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[14px] font-bold text-[#ddeeff]">
            Income vs Expenses
          </p>
          <p className="text-[11px] text-[#4d7799] mt-0.5">
            6-month trend · Oct 2025 – Mar 2026
          </p>
        </div>
        <div className="bg-[#00d9a6]/10 border border-[#00d9a6]/25 rounded-xl px-3 py-1.5">
          <p className="text-[10px] font-bold text-[#00d9a6] uppercase tracking-wider">
            Avg spend · ₹{avgExpenses.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={monthlyData}
          barGap={6}
          barCategoryGap="30%"
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {/* SVG gradient definitions */}
          <defs>
            <linearGradient id={INCOME_GRADIENT} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00d9a6" stopOpacity={1}   />
              <stop offset="100%" stopColor="#00b389" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id={EXPENSE_GRADIENT} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#ff6b71" stopOpacity={1}   />
              <stop offset="100%" stopColor="#cc3b40" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#16263d"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="transparent"
            tick={{ fontSize: 12, fill: "#4d7799", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="transparent"
            tick={{ fontSize: 11, fill: "#4d7799" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => "₹" + v / 1000 + "k"}
            width={48}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)", radius: 8 }}
          />

          {/* Average expenses dashed reference line */}
          <ReferenceLine
            y={avgExpenses}
            stroke="#f5c842"
            strokeDasharray="5 4"
            strokeWidth={1.5}
            strokeOpacity={0.6}
          />

          <Bar
            dataKey="income"
            name="Income"
            fill={`url(#${INCOME_GRADIENT})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={`url(#${EXPENSE_GRADIENT})`}
            radius={[6, 6, 0, 0]}
            maxBarSize={32}
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease-out"
            animationBegin={150}
          />
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend />
    </div>
  );
}