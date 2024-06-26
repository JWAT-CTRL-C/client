import { StateCreator } from 'zustand';
import { Socket, io } from 'socket.io-client';

export interface SocketState {
  notificationSocket: Socket;
}

export const WsServer = process.env.NEXT_PUBLIC_WS_SERVER;

export const createSocketStore: StateCreator<SocketState> = () => ({
  notificationSocket: io(WsServer + '/notifications', { transports: ['websocket', 'polling'] })
});
