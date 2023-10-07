import { Action, Ctx, Message, On, Scene, SceneEnter } from "nestjs-telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import { addToDo, completeTodo, remoteToDo } from "./utils";
import { actionButtons, completeButtons } from "./app.buttons";

@Scene("complete")
export class CompleteTask {
  @SceneEnter()
  async enterCompleteTask(@Ctx() ctx: SceneContext) {
    await ctx.reply("Напишите номер задачи, которую ты выполнил", completeButtons());
  }

  @On("text")
  async getIdTask(@Message("text") idTask: string, @Ctx() ctx: SceneContext) {
    // console.log(ctx.message.chat.id);
    const todo = completeTodo(idTask);
    if (todo === "already") {
      await ctx.reply("Задача c этим номером уже завершена");
      await ctx.scene.reenter();
    }
    if (todo === "complete") {
      await ctx.reply("Задача завершена");
      actionButtons();
      await ctx.scene.leave();
    }
    if (todo === "not found") {
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
  @SceneEnter()
  async enterDeleteTask(@Ctx() ctx: SceneContext) {
    await ctx.reply("Напишите номер задачи, которую ты хочешь удалить", completeButtons());
  }

  @On("text")
  async getIdTask(@Message("text") idTask: string, @Ctx() ctx: SceneContext) {
    const todo = remoteToDo(idTask);
    if (todo === "complete") {
      await ctx.reply("Задача удалена");
      actionButtons();
      await ctx.scene.leave();
    }
    if (todo === "not found") {
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

@Scene('create')
export class CreateTask {
  @SceneEnter()
  async enterCreateTask(@Ctx() ctx: SceneContext) {
    await ctx.reply("Напишите название задачи", completeButtons());
  }

  @On("text")
  async createTask(@Message("text") nameTask: string, @Ctx() ctx: SceneContext) {
    console.log(nameTask);
    const todo = addToDo(nameTask)

    if (todo === "empty" || todo === "small") {
      await ctx.reply("Имя задачи должно быть от 3 символов");
      await ctx.scene.reenter();
    }


    if (todo === "complete") {
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