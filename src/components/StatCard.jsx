import { useEffect, useRef, useState } from "react";
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank
} from "lucide-react";

// Animated number counter hook
function useCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

const iconMap = {
  green:  { icon: Wallet,       bg: "from-[#00d9a6]/10", border: "border-[#00d9a6]/30", text: "text-[#00d9a6]", iconColor: "#00d9a6" },
  yellow: { icon: TrendingUp,   bg: "from-[#f5c842]/10", border: "border-[#f5c842]/30", text: "text-[#f5c842]", iconColor: "#f5c842" },
  red:    { icon: TrendingDown,  bg: "from-[#ff6b71]/10", border: "border-[#ff6b71]/30", text: "text-[#ff6b71]", iconColor: "#ff6b71" },
  purple: { icon: PiggyBank,    bg: "from-[#a78bfa]/10", border: "border-[#a78bfa]/30", text: "text-[#a78bfa]", iconColor: "#a78bfa" },
};

export default function StatCard({ label, value, sub, color, isPercentage = false }) {
  const c = iconMap[color] ?? iconMap.green;
  const Icon = c.icon;

  // Extract raw number for animation
  const rawNumber = parseInt(value.toString().replace(/[^0-9]/g, ""), 10) || 0;
  const animated  = useCounter(rawNumber);

  // Format animated value to match original format
  const displayValue = isPercentage
    ? `${animated}%`
    : `₹${animated.toLocaleString("en-IN")}`;

  return (
    <div
      className={`
       relative overflow-visible rounded-lg border px-4 pt-4 pb-6 pr-8
        bg-gradient-to-br ${c.bg} to-[#0b1729]
        ${c.border} group hover:scale-[1.02]
        transition-transform duration-300

        shadow-[0_0_25px_rgba(168,85,247,0.15)] hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]
      `}
    >
     {/* Background icon — top right */}
    <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
    <Icon size={32} color={c.iconColor} strokeWidth={1.5} />
    </div>

      {/* Small icon + label */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg bg-white/5`}>
          <Icon size={13} color={c.iconColor} strokeWidth={2} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4d7799]">
          {label}
        </p>
      </div>

      {/* Animated value */}
      <p className={`text-[24px] font-bold font-mono ${c.text} mb-1 tabular-nums`}>
        {displayValue}
      </p>

      {/* Sub text */}
      {sub && (
        <p className="text-[11px] text-[#4d7799]  leading-relaxed ">{sub}</p>
      )}
    </div>
  );
}