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

export const migrateTeamMembers = mutation({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    const now = new Date().toISOString();

    for (const team of teams) {
      const updatedMembers = team.members.map(member => ({
        ...member,
        joinedAt: member.joinedAt || now
      }));

      await ctx.db.patch(team._id, {
        members: updatedMembers
      });
    }

    return { success: true, message: "Migration completed" };
  }
}); 