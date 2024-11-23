export default {
  providers: [
    {
      domain: "gorgeous-sheepdog-90.clerk.accounts.dev",
      applicationID: "convex",
      roleFromToken: (token) => token.role,
    },
  ],
};