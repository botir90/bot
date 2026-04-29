interface MathQuestion {
    question: string;
    answer: number;
}
export declare class MathService {
    generateQuestions(): MathQuestion[];
    private generateQuestion;
    private rand;
}
export {};
