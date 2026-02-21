import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(SOCKET_URL, {
      auth: { token }
    });
    return this.socket;
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }
}

export default new SocketService();