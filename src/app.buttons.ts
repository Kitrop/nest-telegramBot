import { Markup } from "telegraf";

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback("🗓️ Список дел", "list"),
      Markup.button.callback("✅ Завершить", "list"),
      Markup.button.callback("🔧 Создать", "create"),
      Markup.button.callback("❌ Удалить", "delete")
    ],
    {
      columns: 2
    }
  );
}

export function removeKeyboard() {
  return Markup.removeKeyboard()
}

export function completeButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback("🔧 Отмена", "cancel"),
    ],
    {
      columns: 2
    }
  )
}