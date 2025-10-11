import type { InterviewSession, InterviewResponse, InterviewQuestion } from '../types';

class InterviewService {
  private storageKey = 'interview_sessions';

  // Save interview session to localStorage
  saveSession(session: InterviewSession): void {
    try {
      const existingSessions = this.getAllSessions();
      const updatedSessions = existingSessions.filter(s => s.id !== session.id);
      updatedSessions.push(session);
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving interview session:', error);
    }
  }

  // Get all interview sessions
  getAllSessions(): InterviewSession[] {
    try {
      const sessions = localStorage.getItem(this.storageKey);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error retrieving interview sessions:', error);
      return [];
    }
  }

  // Get specific session by ID
  getSession(sessionId: string): InterviewSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.id === sessionId) || null;
  }

  // Delete a session
  deleteSession(sessionId: string): void {
    try {
      const sessions = this.getAllSessions();
      const filteredSessions = sessions.filter(session => session.id !== sessionId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting interview session:', error);
    }
  }

  // Export session data as JSON
  exportSession(sessionId: string): string | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    try {
      return JSON.stringify(session, null, 2);
    } catch (error) {
      console.error('Error exporting session:', error);
      return null;
    }
  }

  // Export all sessions
  exportAllSessions(): string | null {
    const sessions = this.getAllSessions();
    try {
      return JSON.stringify(sessions, null, 2);
    } catch (error) {
      console.error('Error exporting all sessions:', error);
      return null;
    }
  }

  // Download session data as file
  downloadSession(sessionId: string, filename?: string): void {
    const data = this.exportSession(sessionId);
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `interview_session_${sessionId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Download all sessions
  downloadAllSessions(): void {
    const data = this.exportAllSessions();
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_interview_sessions_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Get session statistics
  getSessionStats(sessionId: string) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const totalDuration = session.endTime 
      ? session.endTime.getTime() - session.startTime.getTime()
      : Date.now() - session.startTime.getTime();

    const totalResponseDuration = session.responses.reduce(
      (total, response) => total + response.duration, 0
    );

    const averageResponseTime = session.responses.length > 0 
      ? totalResponseDuration / session.responses.length 
      : 0;

    return {
      totalDuration: Math.round(totalDuration / 1000 / 60), // minutes
      totalResponseDuration: Math.round(totalResponseDuration / 60), // minutes
      averageResponseTime: Math.round(averageResponseTime), // seconds
      questionsAnswered: session.responses.length,
      totalQuestions: session.questions.length,
      completionRate: (session.responses.length / session.questions.length) * 100
    };
  }

  // Get all sessions statistics
  getAllSessionsStats() {
    const sessions = this.getAllSessions();
    
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const activeSessions = sessions.filter(s => s.status === 'active').length;
    
    const totalQuestions = sessions.reduce((total, session) => total + session.questions.length, 0);
    const totalResponses = sessions.reduce((total, session) => total + session.responses.length, 0);
    
    const totalDuration = sessions.reduce((total, session) => {
      const duration = session.endTime 
        ? session.endTime.getTime() - session.startTime.getTime()
        : Date.now() - session.startTime.getTime();
      return total + duration;
    }, 0);

    return {
      totalSessions,
      completedSessions,
      activeSessions,
      totalQuestions,
      totalResponses,
      totalDuration: Math.round(totalDuration / 1000 / 60), // minutes
      averageQuestionsPerSession: totalSessions > 0 ? totalQuestions / totalSessions : 0,
      averageResponsesPerSession: totalSessions > 0 ? totalResponses / totalSessions : 0,
      completionRate: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0
    };
  }

  // Clear all sessions (use with caution)
  clearAllSessions(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing all sessions:', error);
    }
  }

  // Generate session report
  generateSessionReport(sessionId: string): string {
    const session = this.getSession(sessionId);
    const stats = this.getSessionStats(sessionId);
    
    if (!session || !stats) return '';

    let report = `# Interview Session Report\n\n`;
    report += `**Session ID:** ${session.id}\n`;
    report += `**Start Time:** ${session.startTime.toLocaleString()}\n`;
    report += `**End Time:** ${session.endTime?.toLocaleString() || 'In Progress'}\n`;
    report += `**Status:** ${session.status}\n\n`;
    
    report += `## Statistics\n`;
    report += `- Total Duration: ${stats.totalDuration} minutes\n`;
    report += `- Questions Answered: ${stats.questionsAnswered}/${stats.totalQuestions}\n`;
    report += `- Completion Rate: ${stats.completionRate.toFixed(1)}%\n`;
    report += `- Average Response Time: ${stats.averageResponseTime} seconds\n\n`;
    
    report += `## Questions and Responses\n\n`;
    
    session.questions.forEach((question, index) => {
      const response = session.responses.find(r => r.questionId === question.id);
      report += `### Question ${index + 1}: ${question.category}\n`;
      report += `**Question:** ${question.question}\n`;
      report += `**Type:** ${question.type}\n`;
      report += `**Expected Duration:** ${question.expectedDuration} seconds\n`;
      
      if (response) {
        report += `**Response Duration:** ${response.duration} seconds\n`;
        report += `**Response Time:** ${response.timestamp.toLocaleString()}\n`;
        if (response.response) {
          report += `**Response:** ${response.response}\n`;
        }
      } else {
        report += `**Status:** No response recorded\n`;
      }
      report += `\n`;
    });
    
    return report;
  }
}

export const interviewService = new InterviewService();
