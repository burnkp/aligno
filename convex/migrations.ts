import { mutation } from "./_generated/server";
import { DatabaseReader, DatabaseWriter } from "./_generated/server";
const logger = require("../../logger");

export const migrateKPIs = mutation({
  args: {},
  handler: async (ctx) => {
    const kpis = await ctx.db.query("kpis").collect();
    
    for (const kpi of kpis) {
      await ctx.db.patch(kpi._id, {
        status: kpi.progress === 100 ? "completed" : 
                kpi.progress === 0 ? "not_started" : 
                "in_progress",
        updatedAt: kpi.updatedAt || new Date().toISOString(),
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

/**
 * Fix KPIs table by adding missing required fields
 */
export const fixKPIsTable = mutation({
  args: {},
  handler: async (ctx) => {
    const kpis = await ctx.db.query("kpis").collect();
    
    for (const kpi of kpis) {
      const now = new Date().toISOString();
      
      // Add missing required fields
      await ctx.db.patch(kpi._id, {
        status: kpi.status || "not_started",
        createdAt: kpi.createdAt || now,
        updatedAt: kpi.updatedAt || now
      });
    }
  },
});

/**
 * Fix invitations table by adding missing required fields
 */
export const fixInvitationsTable = mutation({
  args: {},
  handler: async (ctx) => {
    const invitations = await ctx.db.query("invitations").collect();
    
    for (const invitation of invitations) {
      const now = new Date().toISOString();
      
      // Add missing required fields
      await ctx.db.patch(invitation._id, {
        createdAt: invitation.createdAt || now,
        createdBy: invitation.createdBy || "SYSTEM",
        updatedAt: invitation.updatedAt || now
      });
    }
  },
});

/**
 * Fix operational key results table by adding missing required fields
 */
export const fixOperationalKeyResultsTable = mutation({
  args: {},
  handler: async (ctx) => {
    const okrs = await ctx.db.query("operationalKeyResults").collect();
    
    for (const okr of okrs) {
      const now = new Date().toISOString();
      
      // Add missing required fields
      await ctx.db.patch(okr._id, {
        status: okr.status || "not_started",
        createdAt: okr.createdAt || now,
        updatedAt: okr.updatedAt || now
      });
    }
  },
});

/**
 * Fix strategic objectives table by adding missing required fields
 */
export const fixStrategicObjectivesTable = mutation({
  args: {},
  handler: async (ctx) => {
    const objectives = await ctx.db.query("strategicObjectives").collect();
    
    for (const objective of objectives) {
      const now = new Date().toISOString();
      
      // Add missing required fields
      await ctx.db.patch(objective._id, {
        status: objective.status || "not_started",
        createdAt: objective.createdAt || now,
        updatedAt: objective.updatedAt || now
      });
    }
  },
});

/**
 * Fix teams table by adding missing required fields
 */
export const fixTeamsTable = mutation({
  args: {},
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    
    for (const team of teams) {
      const now = new Date().toISOString();
      
      // Get the organization ID from the team creator's user record
      const creator = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("userId", team.createdBy))
        .first();
      
      if (!creator || creator.organizationId === "SYSTEM") {
        logger.warn(`Could not find valid organization for team ${team._id}`);
        continue;
      }

      // Add missing required fields
      await ctx.db.patch(team._id, {
        organizationId: team.organizationId || creator.organizationId,
        createdAt: team.createdAt || now,
        updatedAt: team.updatedAt || now,
        // Set leaderId to the first admin member if not set
        leaderId: team.leaderId || team.members.find(m => m.role === "admin")?.userId || team.createdBy
      });
    }
  },
});

/**
 * Create default organization and fix teams without organizations
 */
export const createDefaultOrgAndFixTeams = mutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    
    // Get all organizations and find the default one
    const orgs = await ctx.db
      .query("organizations")
      .collect();
    const defaultOrg = orgs.find(org => org.name === "Default Organization");
    
    const defaultOrgId = defaultOrg?._id || await ctx.db.insert("organizations", {
      name: "Default Organization",
      contactPerson: {
        name: "System Admin",
        email: "admin@aligno.app",
      },
      status: "active",
      subscription: {
        plan: "enterprise",
        status: "active",
        startDate: now,
      },
      createdAt: now,
      updatedAt: now,
    });

    // Get all teams and find ones without organizations
    const teams = await ctx.db
      .query("teams")
      .collect();
    const teamsWithoutOrg = teams.filter(team => !team.organizationId);
    
    for (const team of teamsWithoutOrg) {
      await ctx.db.patch(team._id, {
        organizationId: defaultOrgId,
        createdAt: team.createdAt || now,
        updatedAt: team.updatedAt || now,
        leaderId: team.leaderId || team.members.find(m => m.role === "admin")?.userId || team.createdBy
      });
    }

    return { teamsUpdated: teamsWithoutOrg.length };
  },
});

// Update KPI status based on progress
export const updateKPIStatus = mutation({
  handler: async (ctx) => {
    const kpis = await ctx.db.query("kpis").collect();
    
    for (const kpi of kpis) {
      await ctx.db.patch(kpi._id, {
        status: 
          kpi.progress >= 100 ? "completed" : 
          kpi.progress >= 25 ? "in_progress" : 
          kpi.progress === 0 ? "not_started" : 
          "in_progress",
        updatedAt: kpi.updatedAt || new Date().toISOString(),
      });
    }
    
    return { success: true };
  },
});
  