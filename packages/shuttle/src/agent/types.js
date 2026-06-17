/** @typedef {"manual"|"started"|"completed"|"failed"|"not-configured"} ExecuteStatus */

/**
 * @typedef {object} AgentRunnerDefinition
 * @property {string} id
 * @property {string} label
 * @property {string} description
 * @property {boolean} canStream
 * @property {boolean} requiresApiKey
 * @property {boolean} usesCliLogin
 * @property {string|null} [modelCatalog]
 */

/**
 * @typedef {object} AgentModelDefinition
 * @property {string} id
 * @property {string} label
 * @property {string} provider
 * @property {"subscription"|"api"} billing
 * @property {string} description
 * @property {boolean} [default]
 * @property {{ id: string, params?: { id: string, value: string }[] }} [sdkModel]
 */

/**
 * @typedef {object} AgentRequest
 * @property {string} id
 * @property {string} type
 * @property {Record<string, unknown>} [payload]
 * @property {string} [createdAt]
 * @property {string} [status]
 */

/**
 * @typedef {object} AgentExecuteResult
 * @property {string} providerId
 * @property {ExecuteStatus} status
 * @property {string} [message]
 * @property {string} [prompt]
 * @property {string[]} [instructions]
 * @property {string} [error]
 */

export {};
