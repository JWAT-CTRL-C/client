import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface SocketState {
  notificationSocket: Socket;
}

const WsServer = process.env.NEXT_PUBLIC_WS_SERVER;

export const useSocketStore = create<SocketState>()(() => ({
  notificationSocket: io(WsServer + '/notifications', { transports: ['websocket'] })
}));
