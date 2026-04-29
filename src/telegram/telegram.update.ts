import { Injectable } from '@nestjs/common';
import { InjectBot, Update, Start, On } from 'nestjs-telegraf';
import { Context, Telegraf, Markup } from 'telegraf';
import { MathService } from '../math/math.service';
import { SessionService, UserSession } from '../session/session.service';

@Update()
@Injectable()
export class TelegramUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly mathService: MathService,
    private readonly sessionService: SessionService,
  ) {}

  @Start()
  async onStart(ctx: Context) {
    const name = ctx.from?.first_name ?? "Do'st";
    const userId = ctx.from?.id;
    if (userId) this.sessionService.delete(userId);

    await ctx.reply(
      `👋 Salom, ${name}!\n\n` +
      `🧮 Men matematik viktorina botiman!\n\n` +
      `Siz 10 ta matematik savol ishlaysiz va oxirida natijangizni ko'rasiz.\n\n` +
      `Boshlash uchun tugmani bosing 👇`,
      Markup.keyboard([['🚀 Boshlash']]).resize(),
    );
  }

  @On('text')
  async onText(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const text = (ctx.message as any).text?.trim();

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
    } else {
      await ctx.reply(`❌ Notogri! Togri javob: ${current.answer}`);
    }

    session.currentIndex++;

    if (session.currentIndex >= session.questions.length) {
      session.isActive = false;
      this.sessionService.set(userId, session);
      await this.showResult(ctx, session.correctCount, session.questions.length);
    } else {
      this.sessionService.set(userId, session);
      await this.sendQuestion(ctx, session);
    }
  }

  private async startQuiz(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    const session: UserSession = {
      questions: this.mathService.generateQuestions(),
      currentIndex: 0,
      correctCount: 0,
      isActive: true,
    };

    this.sessionService.set(userId, session);

    await ctx.reply(
      '🎯 Viktorina boshlandi!\n\n' +
      '10 ta savol bor. Har biriga raqam bilan javob bering.\n\n' +
      '━━━━━━━━━━━━━━━',
      Markup.removeKeyboard(),
    );

    await this.sendQuestion(ctx, session);
  }

  private async sendQuestion(ctx: Context, session: UserSession) {
    const q = session.questions[session.currentIndex];
    await ctx.reply(
      `📝 Savol ${session.currentIndex + 1}/10\n\n🔢 ${q.question}`,
    );
  }

  private async showResult(ctx: Context, correct: number, total: number) {
    const pct = Math.round((correct / total) * 100);
    let emoji = '😔';
    let msg = 'Kuchli harakat qiling!';

    if (pct === 100) { emoji = '🏆'; msg = 'Mukammal natija!'; }
    else if (pct >= 80) { emoji = '🌟'; msg = 'Juda yaxshi!'; }
    else if (pct >= 60) { emoji = '👍'; msg = 'Yaxshi! Davom eting!'; }
    else if (pct >= 40) { emoji = '📚'; msg = 'Mashq qiling!'; }

    await ctx.reply(
      `${emoji} Viktorina tugadi!\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `✅ Togri: ${correct}/${total}\n` +
      `📊 Natija: ${pct}%\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `💬 ${msg}`,
      Markup.keyboard([
        ['🔄 Yana 10 ta savol'],
        ['🏠 Bosh menyu'],
      ]).resize(),
    );
  }
}