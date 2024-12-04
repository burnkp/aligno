import { mutation } from "./_generated/server";

export const migrateKPIs = mutation({
  args: {},
  handler: async (ctx) => {
    const kpis = await ctx.db.query("kpis").collect();
    
    for (const kpi of kpis) {
      await ctx.db.patch(kpi._id, {
        status: kpi.progress === 100 ? "completed" : 
                kpi.progress === 0 ? "not_started" : 
                "in_progress",
        lastUpdated: kpi.lastUpdated || new Date().toISOString(),
      });
    }
    
    return { success: true, migratedCount: kpis.length };
  },
}); 