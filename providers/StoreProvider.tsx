import { createContext, ReactNode, useContext, useRef } from 'react';
import { create, StoreApi, useStore as useZStore } from 'zustand';

import { createScrollStore, ScrollAction, ScrollState } from '@/stores/scroll';
import { createUserStore, UserAction, UserState } from '@/stores/user';
import { createSocketStore, SocketState } from '@/stores/websocket';

export type Store = SocketState & UserState & UserAction & ScrollState & ScrollAction;

export const SocketStoreContext = createContext<StoreApi<Store> | undefined>(undefined);

export interface SocketStoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: SocketStoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store>>();
  if (!storeRef.current) {
    storeRef.current = create<Store>((...setStateFn) => ({
      ...createSocketStore(...setStateFn),
      ...createUserStore(...setStateFn),
      ...createScrollStore(...setStateFn)
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
