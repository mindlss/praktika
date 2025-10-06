/**
 * @file validators.js
 * @description Utility functions for validating and normalizing request parameters
 */

/**
 * Normalize and validate page parameter
 *
 * @param {any} page - value to normalize
 * @returns {number} zero-based page index (>= 0)
 */
function normalizePage(page) {
    const parsed = parseInt(page, 10);
    return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * Normalize and validate limit parameter
 *
 * @param {any} limit - value to normalize
 * @param {number} defaultLimit - fallback if invalid
 * @returns {number} normalized limit (>= 1)
 */
function normalizeLimit(limit, defaultLimit = 50) {
    const parsed = parseInt(limit, 10);
    return Number.isNaN(parsed) || parsed < 1 ? defaultLimit : parsed;
}

/**
 * Validate a required string parameter
 *
 * @param {any} value - value to check
 * @param {string} fieldName - name of the field for error messages
 * @throws {Error} if value is empty or not a string
 * @returns {string} trimmed string
 */
function validateRequiredString(value, fieldName) {
    if (!value || typeof value !== 'string' || !value.trim()) {
        const err = new Error(`${fieldName} is required`);
        err.status = 400;
        throw err;
    }
    return value.trim();
}

/**
 * Normalize optional string parameter
 *
 * @param {any} value - value to normalize
 * @returns {string|null} trimmed string or null if empty
 */
function normalizeOptionalString(value) {
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}

/**
 * Normalize optional number parameter
 *
 * @param {any} value - value to normalize
 * @returns {number|null} parsed number or null if invalid
 */
function normalizeOptionalNumber(value) {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Normalize vacancy query parameters from request
 *
 * @param {Object} query - req.query object
 * @param {number} defaultLimit - default items per page
 * @returns {Object} normalized query parameters
 * @throws {Error} if required fields are missing
 */
function normalizeVacancyQuery(query = {}, defaultLimit = 50) {
    return {
        text: validateRequiredString(query.name, 'name'),
        page: normalizePage(query.page),
        perPage: normalizeLimit(query.limit, defaultLimit),
        salary:
            query.salary !== undefined
                ? normalizeOptionalNumber(query.salary)
                : null,
        currency: normalizeOptionalString(query.currency),
        area: normalizeOptionalString(query.area),
        employment: normalizeOptionalString(query.employment),
        experience: normalizeOptionalString(query.experience),
        schedule: normalizeOptionalString(query.schedule),
    };
}

module.exports = {
    normalizePage,
    normalizeLimit,
    validateRequiredString,
    normalizeOptionalString,
    normalizeOptionalNumber,
    normalizeVacancyQuery,
};
