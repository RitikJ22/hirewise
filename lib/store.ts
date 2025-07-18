import { create } from 'zustand';
import { Candidate, FilterState } from './types';

interface AppState {
  filters: FilterState;
  shortlistedCandidates: Candidate[];
  setFilters: (newFilters: Partial<FilterState>) => void;
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (candidateName: string) => void;
  clearShortlist: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  filters: {
    skills: '',
    minExp: 0,
    maxExp: 20,
    minSalary: 0,
    maxSalary: 500000,
    topSchool: false,
    sortBy: 'matchScore',
    page: 1,
    limit: 20,
  },
  shortlistedCandidates: [],
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 }, // Reset page when filters change
    })),
  addCandidate: (candidate) =>
    set((state) => ({
      shortlistedCandidates: state.shortlistedCandidates.some(
        (c) => c.name === candidate.name
      )
        ? state.shortlistedCandidates
        : [...state.shortlistedCandidates, candidate],
    })),
  removeCandidate: (candidateName) =>
    set((state) => ({
      shortlistedCandidates: state.shortlistedCandidates.filter(
        (c) => c.name !== candidateName
      ),
    })),
  clearShortlist: () =>
    set(() => ({
      shortlistedCandidates: [],
    })),
})); 