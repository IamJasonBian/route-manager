interface Props {
  hours: string[];              // ISO, sorted ascending
  value: string;                // currently selected hour
  onChange: (iso: string) => void;
}

function fmt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export default function TimeScrubber({ hours, value, onChange }: Props) {
  if (hours.length === 0) return null;
  const idx = Math.max(0, hours.indexOf(value));

  const step = (delta: number) => {
    const next = Math.min(hours.length - 1, Math.max(0, idx + delta));
    onChange(hours[next]);
  };

  return (
    <div className="flex items-center gap-3 border-t border-slate-800 bg-slate-900/80 px-6 py-3 text-slate-200 backdrop-blur">
      <button
        onClick={() => step(-1)}
        disabled={idx === 0}
        className="rounded-md border border-slate-700 px-2 py-1 text-xs disabled:opacity-40"
      >
        ◀
      </button>
      <button
        onClick={() => step(1)}
        disabled={idx === hours.length - 1}
        className="rounded-md border border-slate-700 px-2 py-1 text-xs disabled:opacity-40"
      >
        ▶
      </button>
      <button
        onClick={() => onChange(hours[hours.length - 1])}
        className="rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
      >
        Now
      </button>

      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={hours.length - 1}
          value={idx}
          onChange={e => onChange(hours[Number(e.target.value)])}
          className="w-full accent-teal-400"
        />
      </div>

      <div className="min-w-[180px] text-right text-sm font-medium tabular-nums">
        {fmt(value)}
      </div>
    </div>
  );
}
