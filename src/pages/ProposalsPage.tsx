import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, SendIcon } from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';
import { ProposeTripModal } from '../components/ProposeTripModal';
import { ProposalGridSkeleton } from '../components/Skeleton';
import { getProposals, updateProposal, deleteProposal } from '../services/proposalService';
import type { TripProposal } from '../types/proposal';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<TripProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const loadProposals = async () => {
    try {
      const data = await getProposals();
      setProposals(data);
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const handleUpdateStatus = async (id: string, status: TripProposal['status']) => {
    try {
      await updateProposal({ id, status });
      setProposals((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error('Failed to update proposal:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete proposal:', err);
    }
  };

  const filtered = filter === 'all'
    ? proposals
    : proposals.filter((p) => p.status === filter);

  const counts = {
    all: proposals.length,
    draft: proposals.filter((p) => p.status === 'draft').length,
    proposed: proposals.filter((p) => p.status === 'proposed').length,
    accepted: proposals.filter((p) => p.status === 'accepted').length,
    rejected: proposals.filter((p) => p.status === 'rejected').length,
  };

  return (
    <div className="max-w-[90rem] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Proposals</h1>
        <ProposeTripModal
          trigger={
            <button className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
              <PlusIcon className="h-4 w-4" />
              New Proposal
            </button>
          }
          onCreated={loadProposals}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border)]">
        {(['all', 'draft', 'proposed', 'accepted', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-2 text-sm capitalize border-b-2 transition-colors ${
              filter === status
                ? 'border-[var(--accent)] text-[var(--foreground)] font-medium'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            {status} ({counts[status]})
          </button>
        ))}
      </div>

      {loading ? (
        <ProposalGridSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[var(--border)] rounded-lg bg-[var(--surface-1)]">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
            <SendIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          </div>
          <p className="text-base font-medium text-[var(--foreground)]">
            {proposals.length === 0 ? 'No proposals yet' : `No ${filter} proposals`}
          </p>
          <p className="text-sm text-[var(--muted)] mt-1 mb-4">
            {proposals.length === 0
              ? 'Create one or search for a flight to get started.'
              : 'Try a different filter, or create a new proposal.'}
          </p>
          {proposals.length === 0 && (
            <Link
              to="/search"
              className="inline-flex items-center gap-2 text-[var(--link)] hover:opacity-80 text-sm"
            >
              <SearchIcon className="h-4 w-4" />
              Search Flights
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
