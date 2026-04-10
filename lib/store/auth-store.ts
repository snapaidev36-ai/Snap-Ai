'use client';

import { create } from 'zustand';

import { ApiClientError, apiClient } from '@/lib/client/api';
import type { AuthUser } from '@/lib/types/auth-user';

type MeResponse = {
  user: AuthUser;
};

type BootstrapUserOptions = {
  refreshOn401?: boolean;
};

type AuthStoreState = {
  user: AuthUser | null;
  initialized: boolean;
  isBootstrapping: boolean;
};

type AuthStoreActions = {
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  markInitialized: () => void;
  bootstrapUser: (options?: BootstrapUserOptions) => Promise<void>;
};

type AuthStore = AuthStoreState & AuthStoreActions;

const UNAUTHORIZED_STATUSES = new Set([401, 404]);

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  initialized: false,
  isBootstrapping: false,
  setUser: user => set({ user, initialized: true }),
  clearUser: () => set({ user: null, initialized: true }),
  markInitialized: () => set({ initialized: true, isBootstrapping: false }),
  bootstrapUser: async options => {
    const { initialized, isBootstrapping } = get();

    if (initialized || isBootstrapping) {
      return;
    }

    set({ isBootstrapping: true });

    try {
      const response = await apiClient<MeResponse>('/api/auth/me', {
        refreshOn401: options?.refreshOn401 ?? true,
      });

      set({
        user: response.user,
        initialized: true,
        isBootstrapping: false,
      });
    } catch (error) {
      if (
        error instanceof ApiClientError &&
        UNAUTHORIZED_STATUSES.has(error.status)
      ) {
        set({
          user: null,
          initialized: true,
          isBootstrapping: false,
        });

        return;
      }

      set({
        user: null,
        initialized: true,
        isBootstrapping: false,
      });
    }
  },
}));
