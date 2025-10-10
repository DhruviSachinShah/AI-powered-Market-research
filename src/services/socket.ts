import { io, Socket } from 'socket.io-client';
import { IMessage, IStartInterviewData, IUserResponseData } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        this.isConnected = true;
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnected = false;
        reject(error);
      });

      // Set a timeout for connection
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Interview events
  startInterview(data: IStartInterviewData): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('start-interview', data);
  }

  sendUserResponse(data: IUserResponseData): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('user-response', data);
  }

  sendFollowUpResponse(followUpAnswer: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('follow-up-response', { followUpAnswer });
  }

  endInterview(reason?: string): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('end-interview', { reason });
  }

  // Event listeners
  onQuestion(callback: (data: {
    questionId: string;
    questionText: string;
    questionType: 'initial' | 'follow-up';
    isFirstQuestion: boolean;
  }) => void): void {
    if (!this.socket) return;
    this.socket.on('question', callback);
  }

  onFollowUpQuestion(callback: (data: {
    questionText: string;
    probeReason?: string;
  }) => void): void {
    if (!this.socket) return;
    this.socket.on('follow-up-question', callback);
  }

  onInterviewComplete(callback: (data: {
    interviewId: string;
    overallScore: number;
    insights: any;
    scoreBreakdown: any;
    metadata: any;
  }) => void): void {
    if (!this.socket) return;
    this.socket.on('interview-complete', callback);
  }

  onInterviewEnded(callback: (data: {
    interviewId: string;
    reason: string;
  }) => void): void {
    if (!this.socket) return;
    this.socket.on('interview-ended', callback);
  }

  onError(callback: (error: { message: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  // Remove event listeners
  offQuestion(): void {
    if (!this.socket) return;
    this.socket.off('question');
  }

  offFollowUpQuestion(): void {
    if (!this.socket) return;
    this.socket.off('follow-up-question');
  }

  offInterviewComplete(): void {
    if (!this.socket) return;
    this.socket.off('interview-complete');
  }

  offInterviewEnded(): void {
    if (!this.socket) return;
    this.socket.off('interview-ended');
  }

  offError(): void {
    if (!this.socket) return;
    this.socket.off('error');
  }

  // Remove all listeners
  removeAllListeners(): void {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }
}

// Create a singleton instance
export const socketService = new SocketService();
