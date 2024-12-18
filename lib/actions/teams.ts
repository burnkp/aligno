import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
const logger = require("../../logger");

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getTeamData(teamId: string) {
  try {
    return await convex.query(api.teams.getTeamWithData, {
      teamId: teamId as Id<"teams">,
    });
  } catch (error) {
    logger.error("Failed to fetch team data:", error);
    throw error;
  }
} 