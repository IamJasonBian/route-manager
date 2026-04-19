import { ArrowRightIcon, CalendarIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';
import type { TripProposal } from '../types/proposal';
import { formatDateRange, formatPrice } from '../utils/formatters';

const STATUS_STYLE: Record<
  TripProposal['status'],
  { bg: string; fg: string; dot: string; label: string }
> = {
  draft:    { bg: 'var(--muted-bg)',         fg: 'var(--muted)',          dot: 'var(--muted)',       label: 'Draft' },
  proposed: { bg: 'var(--accent-soft)',      fg: 'var(--accent-soft-fg)', dot: 'var(--accent)',      label: 'Proposed' },
  accepted: { bg: 'var(--success-soft)',     fg: 'var(--success)',        dot: 'var(--success)',     label: 'Accepted' },
  rejected: { bg: 'var(--destructive-soft)', fg: 'var(--destructive)',    dot: 'var(--destructive)', label: 'Rejected' },
};

function StatusBadge({ status }: { status: TripProposal['status'] }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

interface ProposalCardProps {
  proposal: TripProposal;
  onUpdateStatus?: (id: string, status: TripProposal['status']) => void;
  onDelete?: (id: string) => void;
}

export function ProposalCard({ proposal, onUpdateStatus, onDelete }: ProposalCardProps) {
  const statusOptions: TripProposal['status'][] = ['draft', 'proposed', 'accepted', 'rejected'];
  const dateRange = formatDateRange(proposal.departureDate, proposal.returnDate);

  return (
    <div
      className="group relative rounded-lg p-5 bg-[var(--surface-1)] border border-[var(--border)]
                 shadow-[var(--shadow-xs)] transition-all duration-150
                 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-[var(--foreground)] truncate">
            {proposal.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 font-mono text-sm text-[var(--muted)]">
            <span>{proposal.origin}</span>
            <ArrowRightIcon className="h-3 w-3 flex-shrink-0" />
            <span>{proposal.destination}</span>
          </div>
        </div>
        <StatusBadge status={proposal.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
        {dateRange && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            {dateRange}
          </span>
        )}
        {proposal.estimatedPrice != null && (
          <span className="font-semibold text-[var(--foreground)] tabular-nums">
            {formatPrice(proposal.estimatedPrice, proposal.currency)}
          </span>
        )}
      </div>

      {proposal.rationale && (
        <p className="mt-3 text-sm text-[var(--muted)] line-clamp-2">
          {proposal.rationale}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        {onUpdateStatus && (
          <select
            value={proposal.status}
            onChange={(e) => onUpdateStatus(proposal.id, e.target.value as TripProposal['status'])}
            className="text-sm border border-[var(--border)] rounded px-2 py-1 bg-[var(--surface-1)] text-[var(--foreground)]"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{STATUS_STYLE[s].label}</option>
            ))}
          </select>
        )}
        {proposal.googleFlightsUrl && (
          <a
            href={proposal.googleFlightsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[var(--link)] hover:opacity-80"
          >
            <ExternalLinkIcon className="h-3 w-3" />
            Google Flights
          </a>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(proposal.id)}
            className="ml-auto p-1 text-[var(--muted)] hover:text-[var(--destructive)] transition-colors"
            aria-label="Delete proposal"
          >
            <Trash2Icon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
