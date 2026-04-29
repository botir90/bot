import { Injectable } from '@nestjs/common';

export interface UserSession {
  questions: { question: string; answer: number }[];
  currentIndex: number;
  correctCount: number;
  isActive: boolean;
}

@Injectable()
export class SessionService {
  private sessions = new Map<number, UserSession>();

  get(userId: number): UserSession | undefined {
    return this.sessions.get(userId);
  }

  set(userId: number, session: UserSession): void {
    this.sessions.set(userId, session);
  }

  delete(userId: number): void {
    this.sessions.delete(userId);
  }
}