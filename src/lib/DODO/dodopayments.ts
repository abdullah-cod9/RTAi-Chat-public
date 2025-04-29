import DodoPayments from "dodopayments";
import { isProduction } from "std-env";
export const dodopayments = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY, // This is the default and can be omitted if env is named as DODO_PAYMENTS_API_KEY
  environment: isProduction ? "live_mode" : 'test_mode', // defaults to 'live_mode'
});
