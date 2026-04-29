import { Injectable } from '@nestjs/common';

type Operation = '+' | '-' | '*';

interface MathQuestion {
  question: string;
  answer: number;
}

@Injectable()
export class MathService {
  generateQuestions(): MathQuestion[] {
    const questions: MathQuestion[] = [];
    for (let i = 0; i < 10; i++) {
      questions.push(this.generateQuestion());
    }
    return questions;
  }

  private generateQuestion(): MathQuestion {
    const ops: Operation[] = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a: number, b: number, answer: number;

    switch (op) {
      case '+':
        a = this.rand(1, 50);
        b = this.rand(1, 50);
        answer = a + b;
        break;
      case '-':
        a = this.rand(10, 100);
        b = this.rand(1, a);
        answer = a - b;
        break;
      case '*':
        a = this.rand(2, 12);
        b = this.rand(2, 12);
        answer = a * b;
        break;
    }

    return { question: `${a} ${op} ${b} = ?`, answer };
  }

  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}