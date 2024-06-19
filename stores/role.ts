import { StateCreator } from 'zustand';

import { RolesType } from '@/libs/types';

export interface RoleState {
  role?: RolesType;
}

export interface RoleAction {
  setRole: (role: RolesType) => void;
}

export const createRoleStore: StateCreator<RoleState & RoleAction> = (set) => ({
  role: undefined,
  setRole: (role: RolesType) => set({ role })
});
