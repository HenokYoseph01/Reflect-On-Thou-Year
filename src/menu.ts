import { Keyboard } from "grammy";

//Setting up the Reply menu options
export const mainMenu = new Keyboard()
  .text("✍️ Submit Reflection")
  .row()
  .text("📖 Read a Reflection")
  .row()
  .text("🗑 My Submissions")
  .resized();
