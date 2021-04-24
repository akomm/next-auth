import { createHash } from "crypto"

/**
 * Returns state if provider supports it
 * @param {import("types/internals").NextAuthRequest} req
 * @param {import("types/internals").NextAuthResponse} res
 */
export function createState(req) {
  const { provider, csrfToken, logger } = req.options
  if (!provider.protection?.includes("state")) {
    // Provider does not support state, return nothing
    return
  }

  // A hash of the NextAuth.js CSRF token is used as the state
  const state = createHash("sha256").update(csrfToken).digest("hex")

  provider.authorizationParams = { ...provider.authorizationParams, state }
  logger.debug("OAUTH_CALLBACK_PROTECTION", "State created from CSRF token", {
    state,
    csrfToken,
  })
  return state
}

/**
 * Consistently recreate state from the csrfToken
 * if provider protection supports `"state"`.
 * @param {import("types/internals").NextAuthRequest} req
 */
export function getState({ options }) {
  /** @type {import("types/providers").OAuthConfig} */
  const provider = options.provider
  if (provider?.protection.includes("state")) {
    return createHash("sha256").update(options.csrfToken).digest("hex")
  }
}
