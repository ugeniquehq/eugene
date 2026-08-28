"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface ThermometerPickerProps {
  value: string; // stored as e.g. "36.4°C" — empty string if unset
  onChange: (next: string) => void;
}

const RANGES = {
  C: { min: 35.0, max: 40.0, step: 0.1, tickEvery: 1 },
  F: { min: 95.0, max: 104.0, step: 0.2, tickEvery: 2 },
};

function parseValue(raw: string): { num: number | null; unit: "C" | "F" } {
  const match = raw.match(/(-?\d+(?:\.\d+)?)\s*°?\s*([CF])/i);
  if (!match) return { num: null, unit: "C" };
  return { num: parseFloat(match[1]), unit: match[2].toUpperCase() as "C" | "F" };
}

function formatValue(num: number, unit: "C" | "F"): string {
  return `${num.toFixed(1)}°${unit}`;
}

const TRACK_HEIGHT = 260;

export default function ThermometerPicker({ value, onChange }: ThermometerPickerProps) {
  const parsed = parseValue(value);
  const [unit, setUnit] = useState<"C" | "F">(parsed.unit);
  const [num, setNum] = useState<number | null>(parsed.num);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const range = RANGES[unit];

  useEffect(() => {
    const p = parseValue(value);
    setUnit(p.unit);
    setNum(p.num);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = useCallback(
    (nextNum: number, nextUnit: "C" | "F") => {
      const clamped = Math.min(RANGES[nextUnit].max, Math.max(RANGES[nextUnit].min, nextNum));
      setNum(clamped);
      onChange(formatValue(clamped, nextUnit));
    },
    [onChange]
  );

  function valueFromClientY(clientY: number): number {
    const el = trackRef.current;
    if (!el) return range.min;
    const rect = el.getBoundingClientRect();
    const fraction = 1 - (clientY - rect.top) / rect.height;
    const clampedFraction = Math.min(1, Math.max(0, fraction));
    const raw = range.min + clampedFraction * (range.max - range.min);
    return Math.round(raw / range.step) * range.step;
  }

  function handlePointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    commit(valueFromClientY(e.clientY), unit);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    commit(valueFromClientY(e.clientY), unit);
  }

  function handlePointerUp(e: React.PointerEvent) {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }

  function handleUnitChange(nextUnit: "C" | "F") {
    if (nextUnit === unit) return;
    if (num === null) {
      setUnit(nextUnit);
      return;
    }
    const celsius = unit === "C" ? num : ((num - 32) * 5) / 9;
    const converted = nextUnit === "C" ? celsius : (celsius * 9) / 5 + 32;
    setUnit(nextUnit);
    commit(converted, nextUnit);
  }

  function nudge(delta: number) {
    const base = num ?? range.min;
    commit(base + delta, unit);
  }

  const fillFraction = num === null ? 0 : (num - range.min) / (range.max - range.min);
  const ticks: number[] = [];
  for (let t = range.min; t <= range.max + 0.001; t += range.tickEvery) {
    ticks.push(Math.round(t * 10) / 10);
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
      {/* Unit toggle */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {(["C", "F"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => handleUnitChange(u)}
            className={unit === u ? "btn btn-primary" : "btn btn-secondary"}
            style={{ width: "2.75rem", padding: "0.4rem 0", fontSize: "var(--step-1)" }}
          >
            °{u}
          </button>
        ))}
      </div>

      {/* Thermometer track */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--step0)",
            fontWeight: 700,
            color: "var(--color-ink)",
            minHeight: "1.5rem",
          }}
        >
          {num !== null ? formatValue(num, unit) : "Tap to set"}
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          {/* Tick labels */}
          <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "space-between", height: `${TRACK_HEIGHT}px`, fontSize: "0.65rem", color: "var(--color-ink-soft)", fontFamily: "var(--font-mono)" }}>
            {ticks.map((t) => (
              <span key={t} style={{ lineHeight: 1 }}>{t.toFixed(0)}</span>
            ))}
          </div>

          {/* Track */}
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              position: "relative",
              width: "2.25rem",
              height: `${TRACK_HEIGHT}px`,
              borderRadius: "1.125rem",
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              cursor: "pointer",
              touchAction: "none",
              overflow: "hidden",
            }}
          >
            {/* Mercury fill */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: `${fillFraction * 100}%`,
                background: "linear-gradient(to top, var(--color-maroon), var(--color-accent))",
                transition: draggingRef.current ? "none" : "height 0.15s ease",
              }}
            />
            {/* Handle */}
            {num !== null && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: `${fillFraction * 100}%`,
                  transform: "translate(-50%, 50%)",
                  width: "1.75rem",
                  height: "0.35rem",
                  borderRadius: "0.2rem",
                  background: "var(--color-card)",
                  border: "1px solid var(--color-ink)",
                }}
              />
            )}
          </div>
        </div>

        {/* Fine-tune buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={() => nudge(-range.step)} className="btn btn-secondary" style={{ width: "2.25rem", padding: "0.3rem 0" }}>
            −
          </button>
          <button type="button" onClick={() => nudge(range.step)} className="btn btn-secondary" style={{ width: "2.25rem", padding: "0.3rem 0" }}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}