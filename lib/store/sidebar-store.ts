'use client';

import { create } from 'zustand';

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'dashboard-sidebar-collapsed';

type SidebarStoreState = {
  collapsed: boolean;
  mobileOpen: boolean;
  hasInteracted: boolean;
};

type SidebarStoreActions = {
  setCollapsed: (collapsed: boolean, interacted?: boolean) => void;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
};

type SidebarStore = SidebarStoreState & SidebarStoreActions;

function persistCollapsedState(collapsed: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    SIDEBAR_COLLAPSED_STORAGE_KEY,
    collapsed ? '1' : '0',
  );
}

export const useSidebarStore = create<SidebarStore>((set, get) => ({
  collapsed: false,
  mobileOpen: false,
  hasInteracted: false,
  setCollapsed: (collapsed, interacted = true) => {
    persistCollapsedState(collapsed);

    set(state => ({
      collapsed,
      hasInteracted: state.hasInteracted || interacted,
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
