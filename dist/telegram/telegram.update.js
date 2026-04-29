"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUpdate = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const math_service_1 = require("../math/math.service");
const session_service_1 = require("../session/session.service");
let TelegramUpdate = class TelegramUpdate {
    constructor(bot, mathService, sessionService) {
        this.bot = bot;
        this.mathService = mathService;
        this.sessionService = sessionService;
    }
    async onStart(ctx) {
        const name = ctx.from?.first_name ?? "Do'st";
        const userId = ctx.from?.id;
        if (userId)
            this.sessionService.delete(userId);
        await ctx.reply(`👋 Salom, ${name}!\n\n` +
            `🧮 Men matematik viktorina botiman!\n\n` +
            `Siz 10 ta matematik savol ishlaysiz va oxirida natijangizni ko'rasiz.\n\n` +
            `Boshlash uchun tugmani bosing 👇`, telegraf_1.Markup.keyboard([['🚀 Boshlash']]).resize());
    }
    async onText(ctx) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const text = ctx.message.text?.trim();
        if (text === '🚀 Boshlash' || text === '🔄 Yana 10 ta savol') {
            await this.startQuiz(ctx);
            return;
        }
        if (text === '🏠 Bosh menyu') {
            this.sessionService.delete(userId);
            await this.onStart(ctx);
            return;
        }
        const session = this.sessionService.get(userId);
        if (!session || !session.isActive) {
            await ctx.reply('Boshlash uchun /start yuboring');
            return;
        }
        const userAnswer = parseInt(text, 10);
        if (isNaN(userAnswer)) {
            await ctx.reply('⚠️ Iltimos, faqat raqam kiriting!');
            return;
        }
        const current = session.questions[session.currentIndex];
        if (userAnswer === current.answer) {
            session.correctCount++;
            await ctx.reply('✅ Togri!');
        }
        else {
            await ctx.reply(`❌ Notogri! Togri javob: ${current.answer}`);
        }
        session.currentIndex++;
        if (session.currentIndex >= session.questions.length) {
            session.isActive = false;
            this.sessionService.set(userId, session);
            await this.showResult(ctx, session.correctCount, session.questions.length);
        }
        else {
            this.sessionService.set(userId, session);
            await this.sendQuestion(ctx, session);
        }
    }
    async startQuiz(ctx) {
        const userId = ctx.from?.id;
        if (!userId)
            return;
        const session = {
            questions: this.mathService.generateQuestions(),
            currentIndex: 0,
            correctCount: 0,
            isActive: true,
        };
        this.sessionService.set(userId, session);
        await ctx.reply('🎯 Viktorina boshlandi!\n\n' +
            '10 ta savol bor. Har biriga raqam bilan javob bering.\n\n' +
            '━━━━━━━━━━━━━━━', telegraf_1.Markup.removeKeyboard());
        await this.sendQuestion(ctx, session);
    }
    async sendQuestion(ctx, session) {
        const q = session.questions[session.currentIndex];
        await ctx.reply(`📝 Savol ${session.currentIndex + 1}/10\n\n🔢 ${q.question}`);
    }
    async showResult(ctx, correct, total) {
        const pct = Math.round((correct / total) * 100);
        let emoji = '😔';
        let msg = 'Kuchli harakat qiling!';
        if (pct === 100) {
            emoji = '🏆';
            msg = 'Mukammal natija!';
        }
        else if (pct >= 80) {
            emoji = '🌟';
            msg = 'Juda yaxshi!';
        }
        else if (pct >= 60) {
            emoji = '👍';
            msg = 'Yaxshi! Davom eting!';
        }
        else if (pct >= 40) {
            emoji = '📚';
            msg = 'Mashq qiling!';
        }
        await ctx.reply(`${emoji} Viktorina tugadi!\n\n` +
            `━━━━━━━━━━━━━━━\n` +
            `✅ Togri: ${correct}/${total}\n` +
            `📊 Natija: ${pct}%\n` +
            `━━━━━━━━━━━━━━━\n\n` +
            `💬 ${msg}`, telegraf_1.Markup.keyboard([
            ['🔄 Yana 10 ta savol'],
            ['🏠 Bosh menyu'],
        ]).resize());
    }
};
exports.TelegramUpdate = TelegramUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onText", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        math_service_1.MathService,
        session_service_1.SessionService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map