export default {
  providers: [
    {
      domain: "clerk.alignometrix.com",
      applicationID: "convex",

      validateToken: async (token) => {
        console.log("Validating token:", {
          issuer: token.iss,
          subject: token.sub,
          hasEmail: !!token.email
        });
        
        if (!token || !token.sub) {
          throw new Error("Invalid token: missing subject claim");
        }
        return token;
      },

      roleFromToken: (token) => {
        console.log("Processing role from token:", {
          email: token.email,
          existingRole: token.role
        });

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