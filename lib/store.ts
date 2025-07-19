import { create } from 'zustand';
import { Candidate, FilterState } from './types';

interface AppState {
  filters: FilterState;
  shortlistedCandidates: Candidate[];
  isFilterApplied: boolean;
  setFilters: (newFilters: Partial<FilterState>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (candidateName: string) => void;
  clearShortlist: () => void;
  hasFilterChanges: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  filters: {
    skills: '',
    workAvailability: [],
    minSalary: 45000,
    maxSalary: 150000,
    location: '',
    roleName: '',
    company: '',
    educationLevel: 'all',
    degreeSubject: '',
    sortBy: 'date', // Default to date for initial browsing
    page: 1,
    limit: 10,
  },
  shortlistedCandidates: [],
  isFilterApplied: false,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 }, // Reset page when filters change
    })),
  applyFilters: () =>
    set((state) => ({
      isFilterApplied: true,
      filters: { ...state.filters, sortBy: 'matchScore' }, // Switch to match score when filters applied
    })),
  clearFilters: () =>
    set(() => ({
      isFilterApplied: false,
      filters: {
        skills: '',
        workAvailability: [],
        minSalary: 45000,
        maxSalary: 150000,
        location: '',
        roleName: '',
        company: '',
        educationLevel: 'all',
        degreeSubject: '',
        sortBy: 'date',
        page: 1,
        limit: 10,
      },
    })),
  addCandidate: (candidate) =>
    set((state) => ({
      shortlistedCandidates: state.shortlistedCandidates.some(
        (c) => c.email === candidate.email
      )
        ? state.shortlistedCandidates
        : [...state.shortlistedCandidates, candidate],
    })),
  removeCandidate: (candidateEmail) =>
    set((state) => ({
      shortlistedCandidates: state.shortlistedCandidates.filter(
        (c) => c.email !== candidateEmail
      ),
    })),
  clearShortlist: () =>
    set(() => ({
      shortlistedCandidates: [],
    })),
  hasFilterChanges: () => {
    const state = get();
    return state.filters.skills !== '' || 
           state.filters.workAvailability.length > 0 ||
           state.filters.minSalary !== 45000 || 
           state.filters.maxSalary !== 150000 || 
           state.filters.location !== '' ||
           state.filters.roleName !== '' ||
           state.filters.company !== '' ||
           state.filters.educationLevel !== 'all' ||
           state.filters.degreeSubject !== '';
  },
})); 