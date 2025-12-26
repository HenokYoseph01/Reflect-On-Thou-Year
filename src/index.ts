import "dotenv/config";
import { bot } from "./bot";
import { mainMenu, submissionMenu } from "./menu";
import {
  submissions,
  awaitingSubmission,
  getRandomSubmission,
} from "./storage";
import { randomUUID } from "crypto";

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
  const userId = ctx.from?.id;
  if (!userId) return;
  awaitingSubmission.add(userId);

  await ctx.reply(
    "✍️ Please send your reflection for 2025.\n\n" +
      "You can write about:\n" +
      "• How the year went\n" +
      "• Ups and downs\n" +
      "• What you want to achieve in 2026\n" +
      "• Advice for others\n\n" +
      "Send it as **one message**.\n\n" +
      "You can cancel anytime by typing /cancel.",
    {
      reply_markup: submissionMenu,
    }
  );
});

bot.hears("❌ Cancel", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  if (awaitingSubmission.has(userId)) {
    awaitingSubmission.delete(userId);
    await ctx.reply("❌ Submission cancelled.", {
      reply_markup: mainMenu,
    });
  } else {
    await ctx.reply("Nothing to cancel.", {
      reply_markup: mainMenu,
    });
  }
});

bot.hears("📖 Read a Reflection", async (ctx) => {
  const submission = getRandomSubmission();

  if (!submission) {
    await ctx.reply("📭 No reflections yet.\n\nBe the first to share one 🌱", {
      reply_markup: mainMenu,
    });
    return;
  }

  await ctx.reply("📖 *Anonymous Reflection*\n\n" + submission.content, {
    parse_mode: "Markdown",
    reply_markup: mainMenu,
  });
});

bot.hears("🗑 My Submissions", async (ctx) => {
  await ctx.reply("🗑 Coming soon: manage your submissions.");
});

bot.command("cancel", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  if (awaitingSubmission.has(userId)) {
    awaitingSubmission.delete(userId);
    await ctx.reply("❌ Submission cancelled.", {
      reply_markup: mainMenu,
    });
  } else {
    await ctx.reply("Nothing to cancel.", {
      reply_markup: mainMenu,
    });
  }
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  // Only capture if user is in submission mode
  if (!awaitingSubmission.has(userId)) return;

  const text = ctx.message.text.trim(); //Clean up text

  if (text.length < 20) {
    await ctx.reply("Please write a bit more before submitting gang 🥀");
    return;
  }

  submissions.push({
    id: randomUUID(),
    userId,
    content: text,
    createdAt: new Date(),
  });
  console.log(submissions);

  awaitingSubmission.delete(userId);

  await ctx.reply(
    "✅ Your reflection has been saved anonymously.\n\nThank you for sharing 🌱",
    { reply_markup: mainMenu }
  );
});

bot.start();
