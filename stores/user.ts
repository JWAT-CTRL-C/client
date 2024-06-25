import { StateCreator } from 'zustand';

import { User } from '@/libs/types/userType';

export interface UserState {
  user?: User;
}

export interface UserAction {
  setUser: (role: User) => void;
}

export const createUserStore: StateCreator<UserState & UserAction> = (set) => ({
  user: undefined,
  setUser: (user: User) => set({ user })
});
