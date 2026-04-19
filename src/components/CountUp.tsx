import { useEffect, useState } from "react";
export function CountUp({ to, duration = 900, prefix = "", suffix = "", decimals = 0 }: { to: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = eased * to;
      setN(decimals > 0 ? Number(v.toFixed(decimals)) : Math.round(v));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, decimals]);
  const formatted = decimals > 0
    ? n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toLocaleString("en-IN");
  return <>{prefix}{formatted}{suffix}</>;
}
