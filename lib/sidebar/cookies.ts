export const SIDEBAR_COLLAPSED_COOKIE_NAME = 'sidebarCollapsed';

export function parseSidebarCollapsedCookie(value?: string) {
  return value === '1';
}

export function serializeSidebarCollapsedCookie(collapsed: boolean) {
  return collapsed ? '1' : '0';
}
