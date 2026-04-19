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
    <div className="card p-4 hover:bg-[var(--muted-bg)]/50 transition-colors">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 text-[var(--muted)]" />
              <h3 className="text-sm font-medium text-[var(--foreground)]">
                <span className="font-mono">{from}</span>
                <ArrowRightIcon className="inline h-3 w-3 mx-1 text-[var(--muted)]" />
                <span className="font-mono">{to}</span>
              </h3>
            </div>
            <div className="flex items-center text-xs text-[var(--muted)] mt-1 gap-2">
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {duration}
              </span>
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={googleFlightsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <ExternalLinkIcon className="h-3 w-3 mr-1" />
                Google Flights
              </a>
              <ProposeTripModal
                trigger={
                  <button className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                    Propose Trip
                  </button>
                }
                defaultOrigin={from}
                defaultDestination={to}
                defaultPrice={lowestPrice}
              />
            </div>
          </div>
          <div className="bg-[var(--success-bg)] px-3 py-1.5 rounded-md text-right">
            <div className="flex items-center gap-1 text-[var(--success)]">
              <TrendingDownIcon className="h-3 w-3" />
              <span className="text-xs font-medium">Best</span>
            </div>
            <div className="text-base font-semibold text-[var(--success)] font-mono">
              ${lowestPrice}
            </div>
            {savings > 0 && (
              <div className="text-xs text-[var(--success)]">-${savings}</div>
            )}
          </div>
        </div>
        <div className="h-44">
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
