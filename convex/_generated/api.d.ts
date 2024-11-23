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
import type * as email from "../email.js";
import type * as init from "../init.js";
import type * as kpis from "../kpis.js";
import type * as operationalKeyResults from "../operationalKeyResults.js";
import type * as strategicObjectives from "../strategicObjectives.js";
import type * as teams from "../teams.js";
import type * as test from "../test.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  email: typeof email;
  init: typeof init;
  kpis: typeof kpis;
  operationalKeyResults: typeof operationalKeyResults;
  strategicObjectives: typeof strategicObjectives;
  teams: typeof teams;
  test: typeof test;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
