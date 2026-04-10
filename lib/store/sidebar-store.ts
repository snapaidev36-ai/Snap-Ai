'use client';

import { create } from 'zustand';

import {
  serializeSidebarCollapsedCookie,
  SIDEBAR_COLLAPSED_COOKIE_NAME,
} from '@/lib/sidebar/cookies';

type SidebarStoreState = {
  collapsed: boolean;
  mobileOpen: boolean;
  hasInteracted: boolean;
  isInitialized: boolean;
};

type SidebarStoreActions = {
  initializeCollapsed: (collapsed: boolean) => void;
  setCollapsed: (collapsed: boolean, interacted?: boolean) => void;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

type SidebarStore = SidebarStoreState & SidebarStoreActions;

function persistCollapsedState(collapsed: boolean) {
  if (typeof document === 'undefined') {
    return;
  }

  const secureAttribute =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';

  document.cookie = `${SIDEBAR_COLLAPSED_COOKIE_NAME}=${serializeSidebarCollapsedCookie(
    collapsed,
  )}; Path=/; Max-Age=31536000; SameSite=Lax${secureAttribute}`;
}

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  collapsed: false,
  mobileOpen: false,
  hasInteracted: false,
  isInitialized: false,
  initializeCollapsed: collapsed => {
    if (get().isInitialized) {
      return;
    }

    set({
      collapsed,
      hasInteracted: false,
      isInitialized: true,
    });
  },
  setCollapsed: (collapsed, interacted = true) => {
    persistCollapsedState(collapsed);

    set(state => ({
      collapsed,
      hasInteracted: state.hasInteracted || interacted,
      isInitialized: true,
    }));
  },
  toggleCollapsed: () => {
    const nextCollapsedState = !get().collapsed;
    get().setCollapsed(nextCollapsedState, true);
  },
  setMobileOpen: mobileOpen => {
    set({ mobileOpen });
  },
  openMobileSidebar: () => {
    set({ mobileOpen: true });
  },
  closeMobileSidebar: () => {
    set({ mobileOpen: false });
  },
}));
