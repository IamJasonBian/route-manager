import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { XIcon, SendIcon } from 'lucide-react';
import { createProposal } from '../services/proposalService';
import { buildGoogleFlightsUrl } from '../utils/googleFlights';
import type { CreateProposalInput } from '../types/proposal';

interface ProposeTripModalProps {
  trigger: React.ReactNode;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultDepartureDate?: string;
  defaultReturnDate?: string;
  defaultPrice?: number;
  onCreated?: () => void;
}

export function ProposeTripModal({
  trigger,
  defaultOrigin = '',
  defaultDestination = '',
  defaultDepartureDate = '',
  defaultReturnDate = '',
  defaultPrice,
  onCreated,
}: ProposeTripModalProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination);
  const [departureDate, setDepartureDate] = useState(defaultDepartureDate);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [price, setPrice] = useState(defaultPrice?.toString() ?? '');
  const [rationale, setRationale] = useState('');

  const resetForm = () => {
    setTitle('');
    setOrigin(defaultOrigin);
    setDestination(defaultDestination);
    setDepartureDate(defaultDepartureDate);
    setReturnDate(defaultReturnDate);
    setPrice(defaultPrice?.toString() ?? '');
    setRationale('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setOrigin(defaultOrigin);
      setDestination(defaultDestination);
      setDepartureDate(defaultDepartureDate);
      setReturnDate(defaultReturnDate);
      setPrice(defaultPrice?.toString() ?? '');
      if (!title && defaultOrigin && defaultDestination) {
        setTitle(`Trip: ${defaultOrigin} to ${defaultDestination}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const googleFlightsUrl = buildGoogleFlightsUrl({
        origin,
        destination,
        departureDate: departureDate || undefined,
        returnDate: returnDate || undefined,
      });

      const data: CreateProposalInput = {
        title: title || `Trip: ${origin} to ${destination}`,
        origin,
        destination,
        departureDate: departureDate || undefined,
        returnDate: returnDate || undefined,
        estimatedPrice: price ? parseFloat(price) : undefined,
        currency: 'USD',
        rationale: rationale || undefined,
        status: 'draft',
        googleFlightsUrl,
      };

      await createProposal(data);
      resetForm();
      setOpen(false);
      onCreated?.();
    } catch (err) {
      console.error('Failed to create proposal:', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-[var(--border)] rounded px-3 py-2 bg-[var(--card)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";
  const labelClass = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 z-50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-[var(--foreground)]">
              Propose a Trip
            </Dialog.Title>
            <Dialog.Close className="p-1 text-[var(--muted)] hover:text-[var(--foreground)]">
              <XIcon className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Trip: ${origin || 'Origin'} to ${destination || 'Destination'}`}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="JFK"
                  required
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="LAX"
                  required
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Departure</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Return</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Estimated Price (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                min="0"
                step="1"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label className={labelClass}>Why this trip?</label>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Great deal, visiting family, etc."
                rows={3}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving || !origin || !destination}
              className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <SendIcon className="h-4 w-4" />
              {saving ? 'Saving...' : 'Create Proposal'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
