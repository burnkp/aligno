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
import type * as lib_permissions from "../lib/permissions.js";
import type * as migrations from "../migrations.js";
import type * as operationalKeyResults from "../operationalKeyResults.js";
import type * as organizations from "../organizations.js";
import type * as strategicObjectives from "../strategicObjectives.js";
import type * as teams from "../teams.js";
import type * as templates from "../templates.js";
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
  "lib/permissions": typeof lib_permissions;
  migrations: typeof migrations;
  operationalKeyResults: typeof operationalKeyResults;
  organizations: typeof organizations;
  strategicObjectives: typeof strategicObjectives;
  teams: typeof teams;
  templates: typeof templates;
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
