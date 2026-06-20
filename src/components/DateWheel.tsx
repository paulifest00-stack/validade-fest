import { useEffect, useMemo, useRef } from "react";

const ITEM_H = 44;
const VISIBLE = 5; // odd, selected is middle
const PAD = Math.floor(VISIBLE / 2);

type ColumnProps = {
  items: { value: number; label: string }[];
  value: number;
  onChange: (v: number) => void;
  ariaLabel: string;
};

function WheelColumn({ items, value, onChange, ariaLabel }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const settleRef = useRef<number | null>(null);
  const lastEmitted = useRef<number>(value);

  // Sync external value -> scroll position
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = items.findIndex((i) => i.value === value);
    if (idx < 0) return;
    const target = idx * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 1) {
      el.scrollTo({ top: target, behavior: "auto" });
    }
    lastEmitted.current = value;
  }, [value, items]);

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    if (settleRef.current) window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(() => {
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
      const target = idx * ITEM_H;
      if (Math.abs(el.scrollTop - target) > 0.5) {
        el.scrollTo({ top: target, behavior: "smooth" });
      }
      const v = items[idx].value;
      if (v !== lastEmitted.current) {
        lastEmitted.current = v;
        onChange(v);
      }
    }, 90);
  }

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      onScroll={onScroll}
      className="relative flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      style={{
        height: ITEM_H * VISIBLE,
        scrollSnapType: "y mandatory",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        touchAction: "pan-y",
        maskImage:
          "linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent, #000 22%, #000 78%, transparent)",
      }}
    >
      <div style={{ height: PAD * ITEM_H }} aria-hidden />
      {items.map((it) => {
        const selected = it.value === value;
        return (
          <div
            key={it.value}
            className="flex items-center justify-center snap-center select-none transition-[color,transform] duration-150"
            style={{
              height: ITEM_H,
              fontFamily: "var(--font-display)",
              fontWeight: selected ? 700 : 500,
              fontSize: selected ? 22 : 18,
              color: selected ? "var(--foreground)" : "color-mix(in oklab, var(--foreground) 35%, transparent)",
            }}
          >
            {it.label}
          </div>
        );
      })}
      <div style={{ height: PAD * ITEM_H }} aria-hidden />
    </div>
  );
}

type Props = {
  /** ISO yyyy-mm-dd */
  value?: string;
  onChange: (iso: string) => void;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function DateWheel({ value, onChange }: Props) {
  const today = new Date();
  const init = useMemo(() => {
    if (value) {
      const [y, m, d] = value.split("-").map(Number);
      return { y, m, d };
    }
    return { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const yearNow = today.getFullYear();
  const years = useMemo(
    () => Array.from({ length: 12 }, (_, i) => yearNow - 1 + i).map((y) => ({ value: y, label: String(y) })),
    [yearNow],
  );
  const months = useMemo(
    () => MONTHS.map((label, i) => ({ value: i + 1, label })),
    [],
  );

  // Parse current value (controlled)
  const cur = useMemo(() => {
    if (!value) return init;
    const [y, m, d] = value.split("-").map(Number);
    return { y, m, d };
  }, [value, init]);

  const daysInMonth = new Date(cur.y, cur.m, 0).getDate();
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: pad(i + 1) })),
    [daysInMonth],
  );

  function emit(y: number, m: number, d: number) {
    const dim = new Date(y, m, 0).getDate();
    const day = Math.min(d, dim);
    onChange(`${y}-${pad(m)}-${pad(day)}`);
  }

  return (
    <div className="relative rounded-lg border border-border bg-surface-2/40 p-2">
      {/* Selection band */}
      <div
        className="pointer-events-none absolute left-2 right-2 rounded-xl"
        style={{
          top: `calc(50% - ${ITEM_H / 2}px)`,
          height: ITEM_H,
          background: "color-mix(in oklab, var(--primary) 12%, transparent)",
          boxShadow:
            "inset 0 1px 0 color-mix(in oklab, var(--primary) 35%, transparent), inset 0 -1px 0 color-mix(in oklab, var(--primary) 35%, transparent)",
        }}
      />
      <div className="relative flex">
        <WheelColumn
          ariaLabel="Dia"
          items={days}
          value={cur.d}
          onChange={(d) => emit(cur.y, cur.m, d)}
        />
        <WheelColumn
          ariaLabel="Mês"
          items={months}
          value={cur.m}
          onChange={(m) => emit(cur.y, m, cur.d)}
        />
        <WheelColumn
          ariaLabel="Ano"
          items={years}
          value={cur.y}
          onChange={(y) => emit(y, cur.m, cur.d)}
        />
      </div>
    </div>
  );
}
