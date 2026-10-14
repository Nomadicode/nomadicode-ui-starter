import { defineCloudflareConfig } from "@opennextjs/cloudflare"

// No incremental cache: every page renders per request. Add the R2 cache from
// https://opennext.js.org/cloudflare/caching once a page uses ISR.
export default defineCloudflareConfig({})
