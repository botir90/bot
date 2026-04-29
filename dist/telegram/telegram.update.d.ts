import { Context, Telegraf } from 'telegraf';
import { MathService } from '../math/math.service';
import { SessionService } from '../session/session.service';
export declare class TelegramUpdate {
    private readonly bot;
    private readonly mathService;
    private readonly sessionService;
    constructor(bot: Telegraf<Context>, mathService: MathService, sessionService: SessionService);
    onStart(ctx: Context): Promise<void>;
    onText(ctx: Context): Promise<void>;
    private startQuiz;
    private sendQuestion;
    private showResult;
}
