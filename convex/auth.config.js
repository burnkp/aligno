export default {
  providers: [
    {
      domain: "gorgeous-sheepdog-90.clerk.accounts.dev",
      applicationID: "convex",
      roleFromToken: (token) => {
        console.log("Extracted role:", token.role); // Debugging log
        return token.role || "default_role"; // Fallback role
      },
    },
  ],
};