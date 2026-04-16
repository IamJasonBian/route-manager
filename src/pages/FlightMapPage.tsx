import { useMemo, useState } from 'react';
import FlightMap from '../components/map/FlightMap';
import NextDeparturesPanel from '../components/map/NextDeparturesPanel';
import TimeScrubber from '../components/map/TimeScrubber';
import HourOfDayHeatmap from '../components/map/HourOfDayHeatmap';
import { generateMockData, snapshotHours } from '../mocks/mockData';

export default function FlightMapPage() {
  // freeze "now" so all memoization is stable
  const dataset = useMemo(() => generateMockData(new Date()), []);
  const hours = useMemo(() => snapshotHours(dataset), [dataset]);

  const [takenAt, setTakenAt] = useState<string>(hours[hours.length - 1] ?? new Date().toISOString());
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('JFK-DTW');

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-slate-950">
      <div className="flex flex-1 min-h-0">
        <div className="relative flex-1">
          <FlightMap
            dataset={dataset}
            takenAt={takenAt}
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
          />
          <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 backdrop-blur">
            <div className="font-semibold uppercase tracking-widest text-slate-400">Mock preview</div>
            <div className="opacity-80">synthetic hourly snapshots · cartodb dark tiles</div>
          </div>
        </div>
        <aside className="w-[380px] shrink-0 border-l border-slate-800 bg-slate-900/60">
          <NextDeparturesPanel
            dataset={dataset}
            takenAt={takenAt}
            routeId={selectedRouteId}
          />
        </aside>
      </div>
      <HourOfDayHeatmap dataset={dataset} takenAt={takenAt} routeId={selectedRouteId} />
      <TimeScrubber hours={hours} value={takenAt} onChange={setTakenAt} />
    </div>
  );
}
