import "dotenv/config";
import { bot } from "./bot";
import { mainMenu, submissionMenu } from "./menu";
import { awaitingSubmission, awaitingDeletion } from "./storage";
import {
  createSubmission,
  deleteSubmissionById,
  getRandomSubmission,
  getUserSubmissions,
} from "./storage/submission";
//Prod reasons
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./db";

migrate(db, { migrationsFolder: "drizzle" });

bot.command("start", async (ctx) => {
  //To prevent re-etrant confusion (basically reset state of flow)
  const userId = ctx.from?.id;
  if (userId) {
    awaitingSubmission.delete(userId);
    awaitingDeletion.delete(userId);
  }
  await ctx.reply(
    `🌱 *2025 Reflections*

This is a quiet space to reflect on how your year went.

• Write about your 2025 — ups, downs, lessons  
• Read anonymous reflections from others  
• Share advice for 2026  

Everything is *fully anonymous*.

Take your time. When you're ready, choose an option below.`,
    {
      parse_mode: "Markdown",
      reply_markup: mainMenu,
    }
  );
});

//Menu events

// Submit Reflection
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

// Read Reflection
bot.hears("📖 Read a Reflection", async (ctx) => {
  const submission = await getRandomSubmission();

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

// Check Own Submissions
bot.hears("🗑 My Submissions", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const userSubs = await getUserSubmissions(userId);

  if (userSubs.length === 0) {
    await ctx.reply("📭 You haven't submitted anything yet.", {
      reply_markup: mainMenu,
    });
    return;
  }

  const idsInOrder = userSubs.map((s) => s.id);
  awaitingDeletion.set(userId, idsInOrder);

  const list = userSubs
    .map(
      (s, i) =>
        `*${i + 1}.* ${s.content.slice(0, 40)}${
          s.content.length > 40 ? "…" : ""
        }`
    )
    .join("\n\n");

  await ctx.reply(
    "🗂 *Your Submissions*\n\n" +
      list +
      "\n\nReply with the *number* of the entry you want to delete.\nType /cancel to abort.",
    { parse_mode: "Markdown", reply_markup: submissionMenu }
  );
});

bot.hears("❌ Cancel", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  let cancelled = false;

  if (awaitingSubmission.has(userId)) {
    awaitingSubmission.delete(userId);
    cancelled = true;
  }

  if (awaitingDeletion.has(userId)) {
    awaitingDeletion.delete(userId);
    cancelled = true;
  }

  await ctx.reply(cancelled ? "❌ Action cancelled." : "Nothing to cancel.", {
    reply_markup: mainMenu,
  });
});

bot.command("cancel", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  let cancelled = false;

  if (awaitingSubmission.has(userId)) {
    awaitingSubmission.delete(userId);
    cancelled = true;
  }

  if (awaitingDeletion.has(userId)) {
    awaitingDeletion.delete(userId);
    cancelled = true;
  }

  await ctx.reply(cancelled ? "❌ Action cancelled." : "Nothing to cancel.", {
    reply_markup: mainMenu,
  });
});

bot.on("message:text", async (ctx) => {
  const userId = ctx.from?.id;
  if (!userId) return;

  const text = ctx.message.text.trim();

  // 1️. Submission flow
  if (awaitingSubmission.has(userId)) {
    if (text.length < 20) {
      await ctx.reply("Please write a bit more before submitting gang 🥀");
      return;
    }

    await createSubmission(userId, text);

    awaitingSubmission.delete(userId);

    await ctx.reply(
      "✅ Your reflection has been saved anonymously.\n\nThank you for sharing 🌱",
      { reply_markup: mainMenu }
    );
    return;
  }

  // 2️. Deletion flow
  if (awaitingDeletion.has(userId)) {
    const index = Number(text) - 1;
    const ids = awaitingDeletion.get(userId)!;

    if (Number.isNaN(index) || index < 0 || index >= ids.length) {
      await ctx.reply("Please reply with a valid number.");
      return;
    }
    const idToDelete = ids[index]!;
    deleteSubmissionById(idToDelete, userId);
    awaitingDeletion.delete(userId);

    await ctx.reply("✅ Submission deleted successfully.", {
      reply_markup: mainMenu,
    });
    return;
  }

  await ctx.reply(
    "👋 Hey!\n\nTo submit a reflection, click **Submit Reflection** or type /submit.",
    { reply_markup: mainMenu, parse_mode: "Markdown" }
  );
});

bot.start();
