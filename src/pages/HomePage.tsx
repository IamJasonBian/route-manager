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
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-3">
          Simple Trip Proposals
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
          Search flights, track prices, and create trip proposals.
          Plan your next adventure with confidence.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <ProposeTripModal
          trigger={
            <button className="flex items-center gap-3 p-5 border border-[var(--border)] rounded-lg bg-[var(--card)] hover:shadow-sm transition-shadow text-left w-full">
              <SendIcon className="h-5 w-5 text-[var(--accent)] flex-shrink-0" />
              <div>
                <div className="font-semibold text-[var(--foreground)]">New Proposal</div>
                <div className="text-sm text-[var(--muted)]">Create a trip proposal</div>
              </div>
            </button>
          }
          onCreated={() => getProposals().then(setProposals)}
        />

        <Link
          to="/search"
          className="flex items-center gap-3 p-5 border border-[var(--border)] rounded-lg bg-[var(--card)] hover:shadow-sm transition-shadow"
        >
          <SearchIcon className="h-5 w-5 text-[var(--accent)] flex-shrink-0" />
          <div>
            <div className="font-semibold text-[var(--foreground)]">Search Flights</div>
            <div className="text-sm text-[var(--muted)]">Find the best deals</div>
          </div>
        </Link>

        <Link
          to="/trends"
          className="flex items-center gap-3 p-5 border border-[var(--border)] rounded-lg bg-[var(--card)] hover:shadow-sm transition-shadow"
        >
          <TrendingUpIcon className="h-5 w-5 text-[var(--accent)] flex-shrink-0" />
          <div>
            <div className="font-semibold text-[var(--foreground)]">Price Trends</div>
            <div className="text-sm text-[var(--muted)]">Track price history</div>
          </div>
        </Link>
      </div>

      {/* Recent proposals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--foreground)]">
            Recent Proposals
            {activeCount > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--muted)]">
                ({activeCount} active)
              </span>
            )}
          </h2>
          {proposals.length > 0 && (
            <Link to="/proposals" className="text-sm text-[var(--link)] hover:opacity-80 inline-flex items-center gap-1">
              View all <ArrowRightIcon className="h-3 w-3" />
            </Link>
          )}
        </div>

        {loading ? (
          <p className="text-[var(--muted)] text-center py-8">Loading...</p>
        ) : recentProposals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
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
          <div className="text-center py-12 border border-dashed border-[var(--border)] rounded-lg">
            <p className="text-[var(--muted)] mb-3">
              No proposals yet. Start by searching for flights or creating a proposal.
            </p>
            <ProposeTripModal
              trigger={
                <button className="text-[var(--link)] hover:opacity-80 text-sm font-medium">
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
