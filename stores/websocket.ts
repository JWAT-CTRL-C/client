import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

export interface SocketState {
  notificationSocket: Socket;
}

export const WsServer = process.env.NEXT_PUBLIC_WS_SERVER;

export const initSocketStore = (): SocketState => ({
  notificationSocket: io(WsServer + '/notifications', { transports: ['websocket'] })
});

// export const defaultInitState: SocketState = {
//   notificationSocket: io(WsServer + '/notifications', { transports: ['websocket'] })
// };

export const createSocketStore = (initState: SocketState) =>
  create<SocketState>()(() => ({
    ...initState
  }));
