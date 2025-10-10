import { Server as SocketIOServer, Socket } from 'socket.io';
import { Interview, IInterview } from '../models/Interview';
import { InterviewTemplate } from '../models/InterviewTemplate';
import { AIService } from '../services/aiService';
import { ScoringService } from '../services/scoringService';
import { v4 as uuidv4 } from 'uuid';

export class InterviewSocketHandler {
  private aiService: AIService;
  private scoringService: ScoringService;
  private activeInterviews: Map<string, {
    interview: IInterview;
    currentQuestionIndex: number;
    template: any;
  }> = new Map();

  constructor(private io: SocketIOServer) {
    this.aiService = new AIService();
    this.scoringService = new ScoringService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('start-interview', this.handleStartInterview.bind(this, socket));
      socket.on('user-response', this.handleUserResponse.bind(this, socket));
      socket.on('end-interview', this.handleEndInterview.bind(this, socket));
      socket.on('disconnect', this.handleDisconnect.bind(this, socket));
    });
  }

  private async handleStartInterview(socket: Socket, data: {
    respondentName: string;
    respondentEmail: string;
    templateId: string;
  }): Promise<void> {
    try {
      console.log('Starting interview:', data);

      // Get interview template
      const template = await InterviewTemplate.findById(data.templateId);
      if (!template) {
        socket.emit('error', { message: 'Interview template not found' });
        return;
      }

      // Create new interview
      const interview = new Interview({
        respondentName: data.respondentName,
        respondentEmail: data.respondentEmail,
        templateId: data.templateId,
        status: 'in-progress',
        responses: [],
        overallScore: 0,
        insights: {
          keyThemes: [],
          sentiment: 'neutral',
          completionRate: 0
        },
        metadata: {
          duration: 0,
          questionCount: template.questions.length,
          followUpCount: 0
        }
      });

      await interview.save();

      // Store active interview
      this.activeInterviews.set(socket.id, {
        interview,
        currentQuestionIndex: 0,
        template: template.toObject()
      });

      // Generate first question
      const firstQuestion = template.questions[0];
      const aiQuestion = await this.aiService.generateInitialQuestion(template.toObject(), 0);

      socket.emit('question', {
        questionId: firstQuestion.id,
        questionText: aiQuestion,
        questionType: 'initial',
        isFirstQuestion: true
      });

      console.log('Interview started successfully');

    } catch (error) {
      console.error('Error starting interview:', error);
      socket.emit('error', { message: 'Failed to start interview' });
    }
  }

  private async handleUserResponse(socket: Socket, data: {
    questionId: string;
    answer: string;
  }): Promise<void> {
    try {
      const activeInterview = this.activeInterviews.get(socket.id);
      if (!activeInterview) {
        socket.emit('error', { message: 'No active interview found' });
        return;
      }

      const { interview, currentQuestionIndex, template } = activeInterview;
      const currentQuestion = template.questions[currentQuestionIndex];

      // Analyze the response
      const analysis = await this.aiService.analyzeResponse(
        currentQuestion,
        data.answer,
        interview.responses
      );

      // Create response object
      const response = {
        questionId: data.questionId,
        questionText: currentQuestion.text,
        questionType: 'initial' as const,
        userAnswer: data.answer,
        scores: analysis.scores,
        vectorEmbedding: [], // Simplified - would use actual embeddings in production
        timestamp: new Date()
      };

      // Add response to interview
      interview.responses.push(response);
      interview.metadata.followUpCount += analysis.shouldProbe ? 1 : 0;

      // Check if we need to probe deeper
      if (analysis.shouldProbe) {
        const followUpQuestion = await this.aiService.generateFollowUpQuestion(
          template,
          currentQuestion,
          data.answer,
          interview.responses.map(r => r.userAnswer)
        );

        socket.emit('follow-up-question', {
          questionText: followUpQuestion,
          probeReason: analysis.probeReason
        });

        // Wait for follow-up response
        return;
      }

      // Move to next question
      await this.moveToNextQuestion(socket, activeInterview);

    } catch (error) {
      console.error('Error handling user response:', error);
      socket.emit('error', { message: 'Failed to process response' });
    }
  }

  private async handleFollowUpResponse(socket: Socket, data: {
    followUpAnswer: string;
  }): Promise<void> {
    try {
      const activeInterview = this.activeInterviews.get(socket.id);
      if (!activeInterview) {
        socket.emit('error', { message: 'No active interview found' });
        return;
      }

      const { interview, currentQuestionIndex, template } = activeInterview;
      const currentQuestion = template.questions[currentQuestionIndex];

      // Analyze follow-up response
      const analysis = await this.aiService.analyzeResponse(
        currentQuestion,
        data.followUpAnswer,
        interview.responses
      );

      // Create follow-up response object
      const followUpResponse = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        questionType: 'follow-up' as const,
        userAnswer: data.followUpAnswer,
        scores: analysis.scores,
        vectorEmbedding: [],
        timestamp: new Date()
      };

      // Add follow-up response
      interview.responses.push(followUpResponse);

      // Move to next question
      await this.moveToNextQuestion(socket, activeInterview);

    } catch (error) {
      console.error('Error handling follow-up response:', error);
      socket.emit('error', { message: 'Failed to process follow-up response' });
    }
  }

  private async moveToNextQuestion(socket: Socket, activeInterview: {
    interview: IInterview;
    currentQuestionIndex: number;
    template: any;
  }): Promise<void> {
    const { interview, currentQuestionIndex, template } = activeInterview;
    
    // Update question index
    activeInterview.currentQuestionIndex = currentQuestionIndex + 1;

    // Check if interview is complete
    if (activeInterview.currentQuestionIndex >= template.questions.length) {
      await this.completeInterview(socket, activeInterview);
      return;
    }

    // Generate next question
    const nextQuestion = template.questions[activeInterview.currentQuestionIndex];
    const aiQuestion = await this.aiService.generateNextQuestion(
      template,
      activeInterview.currentQuestionIndex
    );

    socket.emit('question', {
      questionId: nextQuestion.id,
      questionText: aiQuestion,
      questionType: 'initial',
      isFirstQuestion: false
    });
  }

  private async completeInterview(socket: Socket, activeInterview: {
    interview: IInterview;
    currentQuestionIndex: number;
    template: any;
  }): Promise<void> {
    try {
      const { interview } = activeInterview;

      // Calculate final scores
      const overallScore = this.scoringService.calculateOverallScore(interview.responses);
      interview.overallScore = overallScore;

      // Generate insights
      const insights = await this.aiService.generateInsights(interview.responses);
      interview.insights = insights;

      // Update metadata
      const duration = Math.floor((Date.now() - interview.startedAt.getTime()) / 1000);
      interview.metadata.duration = duration;

      // Mark as completed
      interview.status = 'completed';
      interview.completedAt = new Date();

      // Save interview
      await interview.save();

      // Generate score breakdown
      const scoreBreakdown = this.scoringService.generateScoreBreakdown(interview.responses);

      // Send completion data
      socket.emit('interview-complete', {
        interviewId: interview._id,
        overallScore,
        insights,
        scoreBreakdown,
        metadata: interview.metadata
      });

      // Clean up
      this.activeInterviews.delete(socket.id);

      console.log('Interview completed successfully');

    } catch (error) {
      console.error('Error completing interview:', error);
      socket.emit('error', { message: 'Failed to complete interview' });
    }
  }

  private async handleEndInterview(socket: Socket, data: {
    reason?: string;
  }): Promise<void> {
    try {
      const activeInterview = this.activeInterviews.get(socket.id);
      if (!activeInterview) {
        socket.emit('error', { message: 'No active interview found' });
        return;
      }

      const { interview } = activeInterview;

      // Mark as abandoned
      interview.status = 'abandoned';
      interview.completedAt = new Date();

      // Calculate partial scores if there are responses
      if (interview.responses.length > 0) {
        const overallScore = this.scoringService.calculateOverallScore(interview.responses);
        interview.overallScore = overallScore;
      }

      // Update duration
      const duration = Math.floor((Date.now() - interview.startedAt.getTime()) / 1000);
      interview.metadata.duration = duration;

      await interview.save();

      // Clean up
      this.activeInterviews.delete(socket.id);

      socket.emit('interview-ended', {
        interviewId: interview._id,
        reason: data.reason || 'User ended interview'
      });

      console.log('Interview ended by user');

    } catch (error) {
      console.error('Error ending interview:', error);
      socket.emit('error', { message: 'Failed to end interview' });
    }
  }

  private handleDisconnect(socket: Socket): void {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Clean up active interview
    const activeInterview = this.activeInterviews.get(socket.id);
    if (activeInterview) {
      // Mark as abandoned
      activeInterview.interview.status = 'abandoned';
      activeInterview.interview.completedAt = new Date();
      activeInterview.interview.save().catch(console.error);
      
      this.activeInterviews.delete(socket.id);
    }
  }
}
