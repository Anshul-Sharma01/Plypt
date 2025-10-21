declare module 'socket.io-client' {
  import { Socket as SocketIOClient } from 'socket.io-client';
  export { SocketIOClient as Socket };
  export { io } from 'socket.io-client';
  export default io;
} 