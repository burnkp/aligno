export default {
  providers: [
    {
      domain: "https://alignometrix.clerk.accounts.dev",
      applicationID: "convex",

      validateToken: async (token) => {
        if (!token || !token.sub || !token.email) {
          throw new Error("Invalid token: missing required claims");
        }
        return token;
      },

      roleFromToken: (token) => {
        if (token.role) {
          return token.role;
        }
        if (token.email === "kushtrim@promnestria.biz") {
          return "super_admin";
        }
        return "user";
      },
    },
  ],
};