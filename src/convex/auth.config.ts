import { convexAuth } from "@convex-dev/auth/server";
import { emailOtp } from "./auth/emailOtp";

export default convexAuth({
  providers: [emailOtp],
});
