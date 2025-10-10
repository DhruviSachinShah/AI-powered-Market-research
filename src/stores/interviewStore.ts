import { create } from 'zustand';
import { IInterview, IMessage, IStartInterviewData, IUserResponseData } from '../types';
import { socketService } from '../services/socket';

interface InterviewState {
  // State
  currentInterview: IInterview | null;
  messages: IMessage[];
  isConnected: boolean;
  isInterviewActive: boolean;
  isLoading: boolean;
  error: string | null;
  currentQuestionId: string | null;
  isWaitingForFollowUp: boolean;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  startInterview: (data: IStartInterviewData) => void;
  sendResponse: (answer: string) => void;
  sendFollowUpResponse: (answer: string) => void;
  endInterview: (reason?: string) => void;
  addMessage: (message: Omit<IMessage, 'id' | 'timestamp'>) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  resetInterview: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  // Initial state
  currentInterview: null,
  messages: [],
  isConnected: false,
  isInterviewActive: false,
  isLoading: false,
  error: null,
  currentQuestionId: null,
  isWaitingForFollowUp: false,

  // Actions
  connect: async () => {
    try {
      set({ isLoading: true, error: null });
      await socketService.connect();
      set({ isConnected: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Connection failed',
        isLoading: false 
      });
      throw error;
    }
  },

  disconnect: () => {
    socketService.disconnect();
    set({ 
      isConnected: false, 
      isInterviewActive: false,
      currentInterview: null,
      messages: [],
      currentQuestionId: null,
      isWaitingForFollowUp: false
    });
  },

  startInterview: (data: IStartInterviewData) => {
    const { addMessage } = get();
    
    set({ 
      isInterviewActive: true, 
      isLoading: true, 
      error: null,
      messages: [],
      isWaitingForFollowUp: false
    });

    // Add system message
    addMessage({
      type: 'system',
      content: `Starting interview for ${data.respondentName}...`,
      isAI: true
    });

    // Setup socket listeners
    socketService.onQuestion((questionData) => {
      const { addMessage } = get();
      
      addMessage({
        type: 'question',
        content: questionData.questionText,
        isAI: true,
        questionId: questionData.questionId
      });

      set({ 
        currentQuestionId: questionData.questionId,
        isLoading: false,
        isWaitingForFollowUp: false
      });
    });

    socketService.onFollowUpQuestion((followUpData) => {
      const { addMessage } = get();
      
      addMessage({
        type: 'follow-up',
        content: followUpData.questionText,
        isAI: true,
        probeReason: followUpData.probeReason
      });

      set({ 
        isLoading: false,
        isWaitingForFollowUp: true
      });
    });

    socketService.onInterviewComplete((completionData) => {
      const { addMessage } = get();
      
      addMessage({
        type: 'system',
        content: 'Interview completed! Analyzing your responses...',
        isAI: true
      });

      set({ 
        isInterviewActive: false,
        isLoading: false,
        currentQuestionId: null,
        isWaitingForFollowUp: false
      });

      // Store completion data in current interview
      set((state) => ({
        currentInterview: state.currentInterview ? {
          ...state.currentInterview,
          _id: completionData.interviewId,
          status: 'completed',
          overallScore: completionData.overallScore,
          insights: completionData.insights,
          metadata: completionData.metadata,
          completedAt: new Date()
        } : null
      }));
    });

    socketService.onInterviewEnded((endData) => {
      const { addMessage } = get();
      
      addMessage({
        type: 'system',
        content: `Interview ended: ${endData.reason}`,
        isAI: true
      });

      set({ 
        isInterviewActive: false,
        isLoading: false,
        currentQuestionId: null,
        isWaitingForFollowUp: false
      });
    });

    socketService.onError((errorData) => {
      set({ 
        error: errorData.message,
        isLoading: false
      });
    });

    // Start the interview
    socketService.startInterview(data);
  },

  sendResponse: (answer: string) => {
    const { currentQuestionId, addMessage, isWaitingForFollowUp } = get();
    
    if (!currentQuestionId) {
      set({ error: 'No active question to respond to' });
      return;
    }

    // Add user message
    addMessage({
      type: 'answer',
      content: answer,
      isAI: false,
      questionId: currentQuestionId
    });

    if (isWaitingForFollowUp) {
      socketService.sendFollowUpResponse(answer);
    } else {
      socketService.sendUserResponse({
        questionId: currentQuestionId,
        answer
      });
    }

    set({ isLoading: true });
  },

  sendFollowUpResponse: (answer: string) => {
    const { addMessage } = get();
    
    // Add user message
    addMessage({
      type: 'answer',
      content: answer,
      isAI: false
    });

    socketService.sendFollowUpResponse(answer);
    set({ isLoading: true });
  },

  endInterview: (reason?: string) => {
    socketService.endInterview(reason);
    set({ 
      isInterviewActive: false,
      isLoading: false,
      currentQuestionId: null,
      isWaitingForFollowUp: false
    });
  },

  addMessage: (messageData: Omit<IMessage, 'id' | 'timestamp'>) => {
    const message: IMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  resetInterview: () => {
    set({
      currentInterview: null,
      messages: [],
      isInterviewActive: false,
      isLoading: false,
      error: null,
      currentQuestionId: null,
      isWaitingForFollowUp: false
    });
    
    // Remove all socket listeners
    socketService.removeAllListeners();
  }
}));
