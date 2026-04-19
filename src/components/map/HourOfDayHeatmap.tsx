import { useMemo } from 'react';
import { MockDataset, hourOfDayHeatmap } from '../../mocks/mockData';

interface Props {
  dataset: MockDataset;
  takenAt: string;
  routeId: string | null;
}

export default function HourOfDayHeatmap({ dataset, takenAt, routeId }: Props) {
  const cells = useMemo(
    () => routeId ? hourOfDayHeatmap(dataset, routeId, takenAt) : [],
    [dataset, routeId, takenAt]
  );

  if (!routeId || cells.length === 0) return null;

  const days = Array.from(new Set(cells.map(c => c.day))).sort();
  const prices = cells.map(c => c.medianPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const color = (price: number): string => {
    if (max === min) return 'rgba(20,184,166,0.4)';
    const t = (price - min) / (max - min);
    if (t < 0.5) {
      const k = t / 0.5;
      const rgb = [
        Math.round(20  + (245 - 20)  * k),
        Math.round(184 + (158 - 184) * k),
        Math.round(166 + (11  - 166) * k),
      ];
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
    const k = (t - 0.5) / 0.5;
    const rgb = [
      Math.round(245 + (244 - 245) * k),
      Math.round(158 + (63  - 158) * k),
      Math.round(11  + (94  - 11)  * k),
    ];
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  };

  const cellFor = (day: string, hour: number) => cells.find(c => c.day === day && c.hour === hour);

  return (
    <div className="border-t border-slate-800 bg-slate-950/60 px-6 py-4 text-slate-200">
      <div className="mb-2 flex items-baseline justify-between">
        <div className="text-xs uppercase tracking-widest opacity-60">
          Hour-of-day × day — median price
        </div>
        <div className="text-xs opacity-50">cheap → expensive</div>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        <div className="flex flex-col justify-between py-1 text-[10px] opacity-60">
          {[0, 6, 12, 18, 23].map(h => (
            <div key={h}>{String(h).padStart(2, '0')}</div>
          ))}
        </div>
        {days.map(day => (
          <div key={day} className="flex flex-col items-center">
            <div className="mb-1 grid grid-rows-24 gap-px" style={{ gridTemplateRows: 'repeat(24, 1fr)' }}>
              {Array.from({ length: 24 }, (_, h) => {
                const c = cellFor(day, h);
                return (
                  <div
                    key={h}
                    title={c ? `${day} ${String(h).padStart(2, '0')}:00 · $${Math.round(c.medianPrice)} · ${c.count} flt` : ''}
                    className="h-3 w-6 rounded-sm"
                    style={{
                      background: c ? color(c.medianPrice) : 'rgba(255,255,255,0.04)',
                    }}
                  />
                );
              })}
            </div>
            <div className="text-[10px] opacity-70">{day.slice(5)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
