import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Template schema definition
export const createTemplate = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    type: v.union(v.literal("objective"), v.literal("okr"), v.literal("kpi")),
    fields: v.array(
      v.object({
        name: v.string(),
        type: v.union(
          v.literal("text"),
          v.literal("number"),
          v.literal("date"),
          v.literal("select")
        ),
        required: v.boolean(),
        options: v.optional(v.array(v.string())), // For select type fields
      })
    ),
    defaultValues: v.optional(
      v.object({
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        target: v.optional(v.number()),
        unit: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const templateId = await ctx.db.insert("templates", {
      ...args,
      createdBy: identity.subject,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return templateId;
  },
});

// Query to get all templates
export const getTemplates = query({
  args: {
    type: v.optional(
      v.union(v.literal("objective"), v.literal("okr"), v.literal("kpi"))
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    let templates;
    if (args.type) {
      templates = await ctx.db
        .query("templates")
        .filter((q) => q.eq(q.field("type"), args.type))
        .collect();
    } else {
      templates = await ctx.db.query("templates").collect();
    }

    return templates;
  },
});

// Query to get a specific template
export const getTemplate = query({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const template = await ctx.db.get(args.id);
    if (!template) {
      throw new Error("Template not found");
    }

    return template;
  },
});

// Mutation to update a template
export const updateTemplate = mutation({
  args: {
    id: v.id("templates"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    fields: v.optional(
      v.array(
        v.object({
          name: v.string(),
          type: v.union(
            v.literal("text"),
            v.literal("number"),
            v.literal("date"),
            v.literal("select")
          ),
          required: v.boolean(),
          options: v.optional(v.array(v.string())),
        })
      )
    ),
    defaultValues: v.optional(
      v.object({
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        target: v.optional(v.number()),
        unit: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const { id, ...updates } = args;
    const template = await ctx.db.get(id);
    
    if (!template) {
      throw new Error("Template not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return id;
  },
});

// Mutation to delete a template
export const deleteTemplate = mutation({
  args: { id: v.id("templates") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const template = await ctx.db.get(args.id);
    if (!template) {
      throw new Error("Template not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
}); 