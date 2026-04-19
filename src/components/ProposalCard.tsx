import { ArrowRightIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';
import type { TripProposal } from '../types/proposal';

const statusColors: Record<string, string> = {
  draft: 'bg-[var(--muted-bg)] text-[var(--muted)]',
  proposed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  accepted: 'bg-[var(--success-bg)] text-[var(--success)]',
  rejected: 'bg-red-50 text-[var(--destructive)] dark:bg-red-950 dark:text-red-300',
};

interface ProposalCardProps {
  proposal: TripProposal;
  onUpdateStatus?: (id: string, status: TripProposal['status']) => void;
  onDelete?: (id: string) => void;
}

export function ProposalCard({ proposal, onUpdateStatus, onDelete }: ProposalCardProps) {
  const statusOptions: TripProposal['status'][] = ['draft', 'proposed', 'accepted', 'rejected'];

  return (
    <div className="border border-[var(--border)] rounded-lg p-5 bg-[var(--card)] transition-shadow hover:shadow-sm">
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
        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[proposal.status]}`}>
          {proposal.status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted)]">
        {proposal.departureDate && <span>Depart: {proposal.departureDate}</span>}
        {proposal.returnDate && <span>Return: {proposal.returnDate}</span>}
        {proposal.estimatedPrice && (
          <span className="font-semibold text-[var(--foreground)]">
            ${proposal.estimatedPrice} {proposal.currency}
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
            className="text-sm border border-[var(--border)] rounded px-2 py-1 bg-[var(--card)] text-[var(--foreground)]"
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
