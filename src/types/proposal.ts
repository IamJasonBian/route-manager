export interface TripProposal {
  id: string;
  title: string;
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  estimatedPrice?: number;
  currency: string;
  rationale?: string;
  status: 'draft' | 'proposed' | 'accepted' | 'rejected';
  googleFlightsUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateProposalInput = Omit<TripProposal, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProposalInput = Partial<CreateProposalInput> & { id: string };
