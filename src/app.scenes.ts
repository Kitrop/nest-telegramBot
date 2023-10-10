import { Action, Ctx, Message, On, Scene, SceneEnter } from "nestjs-telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import { addToDo, completeTodo, remoteToDo } from "./utils";
import { actionButtons, completeButtons } from "./app.buttons";
import { AppService } from "./app.service";

@Scene("complete")
export class CompleteTask {
  constructor(private readonly appService: AppService) {
  }

  @SceneEnter()
  async enterCompleteTask(@Ctx() ctx: SceneContext) {
    await ctx.reply("Напишите номер задачи, которую ты выполнил", completeButtons());
  }

  @On("text")
  async getIdTask(@Message("text") idTask: string, @Ctx() ctx: SceneContext) {
    const response = await this.appService.completeTask(ctx.message.chat.id, idTask);

    if (response !== "already" && response !== "nan" && response !== "not found") {
      await ctx.reply("Задача завершена");
      actionButtons();
      await ctx.scene.leave();
    }

    if (response === "nan") {
      await ctx.reply("Вы ввели не число");
      await ctx.scene.reenter();
    }

    if (response === "already") {
      await ctx.reply("Задача c этим номером уже завершена");
      await ctx.scene.reenter();
    }

    if (response === "not found") {
      await ctx.reply("Задачи с таким номером не существует");
      await ctx.scene.reenter();
    }
  }

  @Action("cancel")
  async cancel(@Ctx() ctx: SceneContext) {
    await ctx.scene.leave();
    await ctx.reply("Ты отменил завершение задачи");
    actionButtons();
  }
}

@Scene("delete")
export class DeleteTask {
  constructor(private readonly appService: AppService) {
  }

  @SceneEnter()
  async enterDeleteTask(@Ctx() ctx: SceneContext) {
    await ctx.reply("Напишите номер задачи, которую ты хочешь удалить", completeButtons());
  }

  @On("text")
  async getIdTask(@Message("text") idTask: string, @Ctx() ctx: SceneContext) {
    const response = await this.appService.deleteTask(ctx.message.chat.id, idTask);

    if (response !== "not found" && response !== "nan" && response !== "error") {
      await ctx.reply("Задача удалена");
      actionButtons();
      await ctx.scene.leave();
    }

    if (response === "error") {
      await ctx.reply("Ошибка");
      await ctx.scene.reenter();
    }

    if (response === "nan") {
      await ctx.reply("Вы ввели не число");
      await ctx.scene.reenter();
    }

    if (response === "not found") {
      await ctx.reply("Задачи с таким номером не существует");
      await ctx.scene.reenter();
    }
  }

  @Action("cancel")
  async cancel(@Ctx() ctx: SceneContext) {
    await ctx.scene.leave();
    await ctx.reply("Ты отменил удаление задачи");
    actionButtons();
  }
}

@Scene("create")
export class CreateTask {
  constructor(private readonly appService: AppService) {
  }

  @SceneEnter()
  async enterCreateTask(@Ctx() ctx: SceneContext) {
    await ctx.reply("Напишите название задачи", completeButtons());
  }

  @On("text")
  async createTask(@Message("text") nameTask: string, @Ctx() ctx: SceneContext) {

    const response = await this.appService.createTask({ name: nameTask, chatId: ctx.message.chat.id });

    if (response === "error") {
      await ctx.reply("Неверное количество символов. Имя задачи должно быть от 3 до 80 символов");
      await ctx.scene.reenter();
    } else {
      await ctx.reply("Задача создана");
      actionButtons();
      await ctx.scene.leave();
    }
  }

  @Action("cancel")
  async cancel(@Ctx() ctx: SceneContext) {
    await ctx.scene.leave();
    await ctx.reply("Ты отменил добавление задачи");
    actionButtons();
  }
}