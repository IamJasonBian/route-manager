import { ArrowRightIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';
import type { TripProposal } from '../types/proposal';

const statusBadge: Record<string, string> = {
  draft: 'badge-draft',
  proposed: 'badge-proposed',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
};

interface ProposalCardProps {
  proposal: TripProposal;
  onUpdateStatus?: (id: string, status: TripProposal['status']) => void;
  onDelete?: (id: string) => void;
}

export function ProposalCard({ proposal, onUpdateStatus, onDelete }: ProposalCardProps) {
  const statusOptions: TripProposal['status'][] = ['draft', 'proposed', 'accepted', 'rejected'];

  return (
    <div className="card p-4 transition-colors hover:bg-[var(--muted-bg)]/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-[var(--foreground)] truncate">
            {proposal.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-[var(--muted)]">
            <span>{proposal.origin}</span>
            <ArrowRightIcon className="h-3 w-3 flex-shrink-0" />
            <span>{proposal.destination}</span>
          </div>
        </div>
        <span className={statusBadge[proposal.status] || 'badge-draft'}>
          {proposal.status}
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--muted)]">
        {proposal.departureDate && <span>{proposal.departureDate}</span>}
        {proposal.returnDate && <span>- {proposal.returnDate}</span>}
        {proposal.estimatedPrice && (
          <span className="font-medium font-mono text-[var(--foreground)]">
            ${proposal.estimatedPrice} {proposal.currency}
          </span>
        )}
      </div>

      {proposal.rationale && (
        <p className="mt-2 text-xs text-[var(--muted)] line-clamp-2">
          {proposal.rationale}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-2 flex-wrap">
        {onUpdateStatus && (
          <select
            value={proposal.status}
            onChange={(e) => onUpdateStatus(proposal.id, e.target.value as TripProposal['status'])}
            className="input py-1 px-2 w-auto text-xs"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
        {proposal.googleFlightsUrl && (
          <a
            href={proposal.googleFlightsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            <ExternalLinkIcon className="h-3 w-3" />
            Flights
          </a>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(proposal.id)}
            className="ml-auto p-1 text-[var(--muted)] hover:text-[var(--destructive)] transition-colors"
            aria-label="Delete proposal"
          >
            <Trash2Icon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
