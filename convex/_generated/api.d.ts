/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as analytics from "../analytics.js";
import type * as auditLogs from "../auditLogs.js";
import type * as debug from "../debug.js";
import type * as email from "../email.js";
import type * as init from "../init.js";
import type * as invitations from "../invitations.js";
import type * as kpis from "../kpis.js";
import type * as lib_audit from "../lib/audit.js";
import type * as lib_logger from "../lib/logger.js";
import type * as lib_permissions from "../lib/permissions.js";
import type * as migrations from "../migrations.js";
import type * as mutations_organizations from "../mutations/organizations.js";
import type * as operationalKeyResults from "../operationalKeyResults.js";
import type * as organizations from "../organizations.js";
import type * as queries_organizations from "../queries/organizations.js";
import type * as strategicObjectives from "../strategicObjectives.js";
import type * as teams from "../teams.js";
import type * as test from "../test.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  auditLogs: typeof auditLogs;
  debug: typeof debug;
  email: typeof email;
  init: typeof init;
  invitations: typeof invitations;
  kpis: typeof kpis;
  "lib/audit": typeof lib_audit;
  "lib/logger": typeof lib_logger;
  "lib/permissions": typeof lib_permissions;
  migrations: typeof migrations;
  "mutations/organizations": typeof mutations_organizations;
  operationalKeyResults: typeof operationalKeyResults;
  organizations: typeof organizations;
  "queries/organizations": typeof queries_organizations;
  strategicObjectives: typeof strategicObjectives;
  teams: typeof teams;
  test: typeof test;
  users: typeof users;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
