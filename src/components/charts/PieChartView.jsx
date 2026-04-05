import { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Sector
} from "recharts";
import { useApp } from "../../context/AppContext";

const COLORS = [
  "#00d9a6", "#f5c842", "#ff6b71",
  "#a78bfa", "#60a5fa", "#fb923c", "#4ade80"
];

const fmt    = (n) => "₹" + n.toLocaleString("en-IN");
const fmtShort = (n) => n >= 1000 ? "₹" + (n / 1000).toFixed(1) + "k" : "₹" + n;

// Active (hovered) segment pulled out
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;

  return (
    <g>
      {/* Pulled out segment */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={1}
      />
      {/* Outer ring */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={outerRadius + 13}
        outerRadius={outerRadius + 16}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.4}
      />
    </g>
  );
};

// Center label rendered as SVG text
const CenterLabel = ({ cx, cy, total, activeIndex, data }) => {
  const isHovered = activeIndex !== null && activeIndex !== undefined;
  const label  = isHovered ? data[activeIndex]?.name  : "Total";
  const amount = isHovered ? data[activeIndex]?.value : total;

  return (
    <g>
      <text
        x={cx} y={cy - 10}
        textAnchor="middle"
        fill="#4d7799"
        fontSize={11}
        fontWeight={700}
        letterSpacing={1}
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </text>
      <text
        x={cx} y={cy + 14}
        textAnchor="middle"
        fill="#ddeeff"
        fontSize={18}
        fontWeight={700}
        fontFamily="monospace"
      >
        {fmtShort(amount)}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1628] border border-[#16263d] rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[#ddeeff] font-semibold text-[12px]">{payload[0].name}</p>
      <p className="text-[#4d7799] text-[11px] mt-0.5">{fmt(payload[0].value)}</p>
      <p className="text-[#4d7799] text-[11px]">
        {(payload[0].payload.percent * 100).toFixed(1)}% of total
      </p>
    </div>
  );
};

export default function PieChartView() {
  const { categorySpending } = useApp();
  const [activeIndex, setActiveIndex] = useState(null);

  if (!categorySpending.length) {
    return (
      <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5 flex flex-col items-center justify-center h-full min-h-[300px] gap-3"
      >
        <p className="text-4xl">📭</p>
        <p className="text-[#4d7799] text-[13px]">No expense data</p>
      </div>
    );
  }

  const total = categorySpending.reduce((s, c) => s + c.value, 0);

  // Add percent to each entry for tooltip
  const dataWithPercent = categorySpending.map((c) => ({
    ...c,
    percent: c.value / total,
  }));

  return (
    <div className="bg-[#0b1729] border border-[#16263d] rounded-2xl p-5 h-full       transition-all duration-300
hover:scale-[1.02]

shadow-[0_0_25px_rgba(168,85,247,0.15)]
hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]">

      {/* Header */}
      <div className="mb-4">
        <p className="text-[14px] font-bold text-[#ddeeff]">Spending Breakdown</p>
        <p className="text-[11px] text-[#4d7799] mt-0.5">By category · March 2026</p>
      </div>

      {/* Donut chart */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            dataKey="value"
            paddingAngle={3}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
          >
            {dataWithPercent.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                opacity={activeIndex === null || activeIndex === i ? 1 : 0.45}
                style={{ cursor: "pointer", transition: "opacity 0.2s" }}
              />
            ))}
          </Pie>

          {/* Center label — custom SVG */}
          <Pie
            data={[{ value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={0}
            dataKey="value"
            label={<CenterLabel total={total} activeIndex={activeIndex} data={dataWithPercent} />}
            labelLine={false}
            isAnimationActive={false}
          />

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Rich legend */}
      <div className="flex flex-col gap-2.5 mt-4">
        {dataWithPercent.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 cursor-pointer group"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Dot + name */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className={`text-[11px] truncate transition-colors duration-200 ${activeIndex === i ? "text-[#ddeeff]" : "text-[#4d7799]"}`}>
                {c.name}
              </span>
            </div>

            {/* Bar + amount */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-16 h-1.5 bg-[#16263d] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(c.percent * 100).toFixed(1)}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#4d7799] w-14 text-right">
                {fmtShort(c.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}