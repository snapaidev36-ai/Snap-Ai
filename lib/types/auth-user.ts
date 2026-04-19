export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  authProvider: string;
  profileImageUrl: string | null;
  credits: number;
  createdAt: string;
};
