import "dotenv/config";
import { bot } from "./bot";

bot.command("start", (ctx) => {
  ctx.reply(
    "Welcome 🌱\n\nThis bot collects anonymous reflections about 2025.\n\nUse /submit to share yours."
  );
});

bot.start();
