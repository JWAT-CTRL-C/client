import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore as useZStore, create, type StoreApi } from 'zustand';

import { SocketState, createSocketStore } from '@/stores/websocket';
import { RoleAction, RoleState, createRoleStore } from '@/stores/role';

export type Store = SocketState & RoleState & RoleAction;

export const SocketStoreContext = createContext<StoreApi<Store> | undefined>(undefined);

export interface SocketStoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: SocketStoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store>>();
  if (!storeRef.current) {
    storeRef.current = create<Store>((...setStateFn) => ({
      ...createSocketStore(...setStateFn),
      ...createRoleStore(...setStateFn)
    }));
  }

  return <SocketStoreContext.Provider value={storeRef.current}>{children}</SocketStoreContext.Provider>;
};

export const useStore = <T,>(selector: (store: Store) => T): T => {
  const socketStoreContext = useContext(SocketStoreContext);

  if (!socketStoreContext) {
    throw new Error(`useSocketStore must be used within SocketStoreProvider`);
  }

  return useZStore(socketStoreContext, selector);
};
