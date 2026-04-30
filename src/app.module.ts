import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './telegram/telegram.update';
import { MathService } from './math/math.service';
import { SessionService } from './session/session.service';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '8469698763:AAGYVz5GtVwGMJ4iOZ9l_ROn5nHacgt3lxE',
    }),
  ],
  providers: [TelegramUpdate, MathService, SessionService],

})
export class AppModule {}