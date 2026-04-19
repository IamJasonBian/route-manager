import * as React from 'react';
import { MapPinIcon, ClockIcon, ArrowRightIcon, TrendingDownIcon, ExternalLinkIcon } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { ProposeTripModal } from './ProposeTripModal';
import { buildGoogleFlightsUrl } from '../utils/googleFlights';

interface RouteCardProps {
  route: {
    id: string;
    from: string;
    to: string;
    basePrice: number;
    prices: Array<{ date: string | Date; price: number }>;
    distance: string;
    duration: string;
  };
  onLoad?: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onLoad }) => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (onLoad && !isMounted.current) {
      isMounted.current = true;
      onLoad();
    }
  }, [onLoad]);

  const { from, to, basePrice, prices, distance, duration } = route;
  const lowestPrice = Math.min(...prices.map((p) => p.price));
  const highestPrice = Math.max(...prices.map((p) => p.price));
  const savings = basePrice - lowestPrice;
  const googleFlightsUrl = buildGoogleFlightsUrl({ origin: from, destination: to });

  return (
    <div className="border border-[var(--border)] rounded-lg p-4 bg-[var(--card)] hover:shadow-sm transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-[var(--accent)]" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {from} <ArrowRightIcon className="inline h-4 w-4 mx-1" /> {to}
              </h3>
            </div>
            <div className="flex items-center text-sm text-[var(--muted)] mt-1">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{duration}</span>
              <span className="mx-2">&middot;</span>
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={googleFlightsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-[var(--link)] hover:opacity-80 transition-opacity"
              >
                <ExternalLinkIcon className="h-3 w-3 mr-1" />
                Google Flights
              </a>
              <ProposeTripModal
                trigger={
                  <button className="text-xs text-[var(--link)] hover:opacity-80 transition-opacity">
                    Propose Trip
                  </button>
                }
                defaultOrigin={from}
                defaultDestination={to}
                defaultPrice={lowestPrice}
              />
            </div>
          </div>
          <div className="bg-[var(--success-bg)] px-4 py-2 rounded-lg">
            <div className="flex items-center text-[var(--success)]">
              <TrendingDownIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Best Deal</span>
            </div>
            <div className="text-xl font-bold text-[var(--success)] font-mono">
              ${lowestPrice}
            </div>
            {savings > 0 && (
              <div className="text-xs text-[var(--success)]">Save ${savings}</div>
            )}
          </div>
        </div>
        <div className="h-52 mt-2">
          <PriceChart
            prices={prices}
            basePrice={basePrice}
            lowestPrice={lowestPrice}
            highestPrice={highestPrice}
          />
        </div>
      </div>
    </div>
  );
};
