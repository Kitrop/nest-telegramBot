import { AppService } from "./app.service";
import { Ctx, Hears, InjectBot, Message, On, Scene, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { Injectable } from "@nestjs/common";
import { actionButtons, completeButtons, removeKeyboard } from "./app.buttons";
import { SceneContext } from "telegraf/typings/scenes";



@Update()
@Injectable()
export class AppUpdate {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>, private readonly appService: AppService) {
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply("Что ты хочешь сделать?", actionButtons());
  }

  @On("sticker")
  async onSticker(@Ctx() ctx: Context) {
    await ctx.reply("👍");
  }

  @Hears("🗓️ Список дел")
  async list(@Ctx() ctx: Context) {



    const todos =  await  this.appService.getAllTask(ctx.message.chat.id)
    if (todos.length === 0) {
      await ctx.reply("У вас пока нет задач, но вы можете их создать")
    } else {
      let i = 0;
      await ctx.reply(
        `Список дел: \n\n${todos
          .map(t => {
              i++;
              return (`${i}. ` + (t.isDone ? "✅ " : "⚪ ") + t.name + "\n\n");
            }
          ).join(" ")}`
      );
    }
  }


  @Hears("✅ Завершить")
  async complete(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter("complete");
  }

  @Hears("❌ Удалить")
  async delete(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter("delete");
  }

  @Hears("🔧 Создать")
  async create(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter("create");
  }

}