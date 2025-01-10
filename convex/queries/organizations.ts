import { query } from "../_generated/server";
import { v } from "convex/values";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const organizations = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("contactPerson.email"), args.email))
      .collect();

    return organizations[0] || null;
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const organizations = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("name"), args.name))
      .collect();

    return organizations[0] || null;
  },
}); 