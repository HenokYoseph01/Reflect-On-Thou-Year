import "dotenv/config";
import { bot } from "./bot";
import { mainMenu } from "./menu";

bot.command("start", (ctx) => {
  ctx.reply(
    "Welcome 🌱\n\nThis bot collects anonymous reflections about 2025.\n\nUse /submit to share yours.",
    {
      reply_markup: mainMenu,
    }
  );
});

//Menu events
bot.hears("✍️ Submit Reflection", async (ctx) => {
  await ctx.reply(
    "Please send your reflection for 2025.\n\nYou can write about:\n• How the year went\n• Ups & downs\n• What you want in 2026\n• Advice for others\n\nSend it as one message."
  );
});

bot.hears("📖 Read a Reflection", async (ctx) => {
  await ctx.reply("📖 Coming soon: random reflections to read.");
});

bot.hears("🗑 My Submissions", async (ctx) => {
  await ctx.reply("🗑 Coming soon: manage your submissions.");
});

bot.start();
