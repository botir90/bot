export interface UserSession {
    questions: {
        question: string;
        answer: number;
    }[];
    currentIndex: number;
    correctCount: number;
    isActive: boolean;
}
export declare class SessionService {
    private sessions;
    get(userId: number): UserSession | undefined;
    set(userId: number, session: UserSession): void;
    delete(userId: number): void;
}
