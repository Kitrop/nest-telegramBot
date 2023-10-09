import { Injectable } from "@nestjs/common";
import { PrismaService } from "./PrismaService";
import { Prisma } from "@prisma/client";

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {
  }

  async getAllTask(chatId: number) {
    return this.prisma.task.findMany({
      where: {
        chatId: chatId
      }
    });
  }

  async completeTask(chatId: number, taskId: string) {

    const taskIdInt = Number(taskId);
    if (!taskIdInt) {
      return "nan";
    } else {
      const todos = await this.getAllTask(chatId);
      if (!todos) {
        return "not found";
      }

      // @ts-ignore
      if (!todos[taskId-1]) {
        return "not found";
      }

      // @ts-ignore
      if (todos[taskId-1].isDone) {
        return 'already'
      }
      // @ts-ignore
      const needId = todos[taskId - 1].id;
      if (!needId) {
        return "error";
      }

      return this.prisma.task.update({
        data: {
          isDone: true
        },
        where: {
          id: needId
        }
      });
    }
  }

  async deleteTask(chatId: number, taskId: string) {

    const taskIdInt = Number(taskId);
    if (!taskIdInt) {
      return "nan";
    }
    else {

      const todos = await this.getAllTask(chatId);
      if (!todos) {
        return "not found";
      }

      // @ts-ignore
      if (!todos[taskId-1]) {
        return "not found";
      }

      // @ts-ignore
      const needId = todos[taskId - 1].id;
      if (!needId) {
        return "error";
      }

      return this.prisma.task.delete({
        where: {
          id: needId
        }
      })
    }


  }

  async createTask(data: Prisma.TaskCreateInput) {
    if (!data.name.trim() || data.name.trim().length < 3) {
      return "error";
    }
    return this.prisma.task.create({
      data
    });
  }
}
