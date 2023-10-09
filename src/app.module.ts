import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegrafModule } from "nestjs-telegraf";
import * as LocalSession from 'telegraf-session-local'
import { ConfigModule } from "@nestjs/config";
import { AppUpdate } from "./app.update";
import * as process from "process";
import { CompleteTask, CreateTask, DeleteTask } from "./app.scenes";
import { PrismaService } from "./PrismaService";

const sessions = new LocalSession({ database: 'session_db.json'})

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      token: process.env.TOKEN,
      middlewares: [sessions.middleware()],
    })
  ],
  providers: [AppService, AppUpdate, CompleteTask, DeleteTask, CreateTask, PrismaService],
})

export class AppModule {}
