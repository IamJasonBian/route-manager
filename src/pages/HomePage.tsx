import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, TrendingUpIcon, SendIcon, ArrowRightIcon } from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';
import { ProposeTripModal } from '../components/ProposeTripModal';
import { getProposals, updateProposal, deleteProposal } from '../services/proposalService';
import type { TripProposal } from '../types/proposal';

export default function HomePage() {
  const [proposals, setProposals] = useState<TripProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProposals()
      .then(setProposals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentProposals = proposals.slice(0, 3);
  const activeCount = proposals.filter(
    (p) => p.status === 'draft' || p.status === 'proposed'
  ).length;

  const handleUpdateStatus = async (id: string, status: TripProposal['status']) => {
    try {
      await updateProposal({ id, status });
      setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="py-10">
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
          Simple Trip Proposals
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Search flights, track prices, and create trip proposals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <ProposeTripModal
          trigger={
            <button className="card flex items-center gap-3 p-4 hover:bg-[var(--muted-bg)] transition-colors text-left w-full">
              <SendIcon className="h-4 w-4 text-[var(--muted)] flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">New Proposal</div>
                <div className="text-xs text-[var(--muted)]">Create a trip proposal</div>
              </div>
            </button>
          }
          onCreated={() => getProposals().then(setProposals)}
        />

        <Link
          to="/search"
          className="card flex items-center gap-3 p-4 hover:bg-[var(--muted-bg)] transition-colors"
        >
          <SearchIcon className="h-4 w-4 text-[var(--muted)] flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-[var(--foreground)]">Search Flights</div>
            <div className="text-xs text-[var(--muted)]">Find the best deals</div>
          </div>
        </Link>

        <Link
          to="/trends"
          className="card flex items-center gap-3 p-4 hover:bg-[var(--muted-bg)] transition-colors"
        >
          <TrendingUpIcon className="h-4 w-4 text-[var(--muted)] flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-[var(--foreground)]">Price Trends</div>
            <div className="text-xs text-[var(--muted)]">Track price history</div>
          </div>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[var(--foreground)]">
            Recent Proposals
            {activeCount > 0 && (
              <span className="ml-2 text-[var(--muted)] font-normal">
                {activeCount} active
              </span>
            )}
          </h2>
          {proposals.length > 0 && (
            <Link to="/proposals" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] inline-flex items-center gap-1">
              View all <ArrowRightIcon className="h-3 w-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-[var(--muted)] text-sm text-center py-8">Loading...</p>
        ) : recentProposals.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {recentProposals.map((p) => (
              <ProposalCard
                key={p.id}
                proposal={p}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 card border-dashed">
            <p className="text-sm text-[var(--muted)] mb-2">
              No proposals yet.
            </p>
            <ProposeTripModal
              trigger={
                <button className="text-sm text-[var(--foreground)] underline underline-offset-4 hover:opacity-70">
                  Create your first proposal
                </button>
              }
              onCreated={() => getProposals().then(setProposals)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
