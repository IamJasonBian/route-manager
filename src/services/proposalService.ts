import axios from 'axios';
import type { TripProposal, CreateProposalInput, UpdateProposalInput } from '../types/proposal';

const API_URL = '/.netlify/functions/proposals';

export async function getProposals(): Promise<TripProposal[]> {
  const response = await axios.get<TripProposal[]>(API_URL);
  return response.data;
}

export async function getProposal(id: string): Promise<TripProposal> {
  const response = await axios.get<TripProposal>(`${API_URL}?id=${id}`);
  return response.data;
}

export async function createProposal(data: CreateProposalInput): Promise<TripProposal> {
  const response = await axios.post<TripProposal>(API_URL, data);
  return response.data;
}

export async function updateProposal(data: UpdateProposalInput): Promise<TripProposal> {
  const response = await axios.put<TripProposal>(API_URL, data);
  return response.data;
}

export async function deleteProposal(id: string): Promise<void> {
  await axios.delete(`${API_URL}?id=${id}`);
}
