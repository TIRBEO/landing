import { convexAuth } from "@convex-dev/auth/server";
import { emailOtp } from "./auth/emailOtp";

const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp],
});

export { auth, signIn, signOut, store, isAuthenticated };
