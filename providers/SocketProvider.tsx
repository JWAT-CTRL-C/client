'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { SocketState, createSocketStore, initSocketStore } from '@/stores/websocket';

export type SocketStoreApi = ReturnType<typeof createSocketStore>;

export const SocketStoreContext = createContext<SocketStoreApi | undefined>(undefined);

export interface SocketStoreProviderProps {
  children: ReactNode;
}

export const SocketStoreProvider = ({ children }: SocketStoreProviderProps) => {
  const storeRef = useRef<SocketStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createSocketStore(initSocketStore());
  }

  return <SocketStoreContext.Provider value={storeRef.current}>{children}</SocketStoreContext.Provider>;
};

export const useSocketStore = <T,>(selector: (store: SocketState) => T): T => {
  const socketStoreContext = useContext(SocketStoreContext);

  if (!socketStoreContext) {
    throw new Error(`useSocketStore must be used within SocketStoreProvider`);
  }

  return useStore(socketStoreContext, selector);
};
