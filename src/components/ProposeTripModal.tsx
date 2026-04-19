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

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md card p-6 z-50 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-[var(--foreground)]">
              Propose a Trip
            </Dialog.Title>
            <Dialog.Close className="btn-ghost p-1">
              <XIcon className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Trip: ${origin || 'Origin'} to ${destination || 'Destination'}`}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Origin</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="JFK"
                  required
                  className="input font-mono"
                />
              </div>
              <div>
                <label className="label">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="LAX"
                  required
                  className="input font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Departure</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Return</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Estimated Price (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                min="0"
                step="1"
                className="input font-mono"
              />
            </div>

            <div>
              <label className="label">Why this trip?</label>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Great deal, visiting family, etc."
                rows={3}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !origin || !destination}
              className="btn-primary w-full"
            >
              <SendIcon className="h-3.5 w-3.5" />
              {saving ? 'Saving...' : 'Create Proposal'}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
