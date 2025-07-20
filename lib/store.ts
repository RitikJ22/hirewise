import { create } from 'zustand';
import { Candidate, FilterState } from './types';

interface AppState {
  filters: FilterState;
  shortlistedCandidates: Candidate[];
  isFilterApplied: boolean;
  showTeamModal: boolean;
  // Panel state
  isLeftPanelExpanded: boolean;
  isRightPanelExpanded: boolean;
  setFilters: (newFilters: Partial<FilterState>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  addCandidate: (candidate: Candidate) => void;
  removeCandidate: (candidateName: string) => void;
  clearShortlist: () => void;
  hasFilterChanges: () => boolean;
  openTeamModal: () => void;
  closeTeamModal: () => void;
  // Panel actions
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setLeftPanelExpanded: (expanded: boolean) => void;
  setRightPanelExpanded: (expanded: boolean) => void;
  expandedCardId: string | null;
  setExpandedCard: (cardId: string | null) => void;
}

// Helper function to detect mobile device (SSR-safe)
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024;
};

// Helper function to detect if panels should start closed on mobile
const shouldPanelsStartClosed = () => {
  if (typeof window === 'undefined') return true; // Default to closed for SSR
  return window.innerWidth < 1024;
};

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
  showTeamModal: false,
  // Panel state - default to closed for SSR consistency, will be updated on client
  isLeftPanelExpanded: false,
  isRightPanelExpanded: false,
  expandedCardId: null,
  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters, page: 1 };
      
      // Check if all filters are cleared (back to default state)
      const hasAnyFilters = updatedFilters.skills !== '' || 
                           updatedFilters.workAvailability.length > 0 ||
                           updatedFilters.minSalary !== 45000 || 
                           updatedFilters.maxSalary !== 150000 || 
                           updatedFilters.location !== '' ||
                           updatedFilters.roleName !== '' ||
                           updatedFilters.company !== '' ||
                           updatedFilters.educationLevel !== 'all' ||
                           updatedFilters.degreeSubject !== '';
      
      return {
        filters: updatedFilters,
        isFilterApplied: hasAnyFilters ? state.isFilterApplied : false, // Reset if no filters
      };
    }),
  applyFilters: () =>
    set((state) => ({
      isFilterApplied: true,
      filters: { ...state.filters }, // Keep the current sortBy selection
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
  openTeamModal: () => set({ showTeamModal: true }),
  closeTeamModal: () => set({ showTeamModal: false }),
  // Panel actions
  toggleLeftPanel: () => set((state) => ({ isLeftPanelExpanded: !state.isLeftPanelExpanded })),
  toggleRightPanel: () => set((state) => ({ isRightPanelExpanded: !state.isRightPanelExpanded })),
  setLeftPanelExpanded: (expanded) => set({ isLeftPanelExpanded: expanded }),
  setRightPanelExpanded: (expanded) => set({ isRightPanelExpanded: expanded }),
  setExpandedCard: (cardId: string | null) => {
    set({ expandedCardId: cardId });
  },
})); 