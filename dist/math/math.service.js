"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathService = void 0;
const common_1 = require("@nestjs/common");
let MathService = class MathService {
    generateQuestions() {
        const questions = [];
        for (let i = 0; i < 10; i++) {
            questions.push(this.generateQuestion());
        }
        return questions;
    }
    generateQuestion() {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, answer;
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
    rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
exports.MathService = MathService;
exports.MathService = MathService = __decorate([
    (0, common_1.Injectable)()
], MathService);
//# sourceMappingURL=math.service.js.map