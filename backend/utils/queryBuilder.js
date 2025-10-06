/**
 * @file queryBuilder.js
 * @description Utility function to build URL query strings for APIs
 */

/**
 * Build a URL query string from an options object.
 *
 * @param {Object} options - Query options
 * @param {string} options.text - Search text (required)
 * @param {number} options.perPage - Number of items per page
 * @param {number} options.page - Zero-based page index
 * @param {number|string|null} [options.salary] - Salary filter
 * @param {string|null} [options.currency] - Currency filter
 * @param {string|null} [options.area] - Area filter
 * @param {string|null} [options.employment] - Employment type filter
 * @param {string|null} [options.experience] - Experience filter
 * @param {string|null} [options.schedule] - Schedule filter
 * @returns {string} Encoded query string
 *
 * @example
 * const qs = buildQueryString({
 *   text: 'developer',
 *   page: 0,
 *   perPage: 50,
 *   salary: 50000,
 *   currency: 'RUR'
 * });
 * // "text=developer&per_page=50&page=0&salary=50000&only_with_salary=true&currency=RUR"
 */
function buildQueryString({
    text,
    perPage,
    page,
    salary = null,
    currency = null,
    area = null,
    employment = null,
    experience = null,
    schedule = null,
}) {
    const params = new URLSearchParams();

    if (!text || typeof text !== 'string' || !text.trim()) {
        const err = new Error('Search text is required');
        err.status = 400;
        throw err;
    }

    params.append('text', text);
    params.append('per_page', perPage);
    params.append('page', page);

    if (salary !== null && salary !== undefined) {
        params.append('salary', String(salary));
        params.append('only_with_salary', 'true');
    }
    if (currency) params.append('currency', String(currency));
    if (area) params.append('area', String(area));
    if (employment) params.append('employment', String(employment));
    if (experience) params.append('experience', String(experience));
    if (schedule) params.append('schedule', String(schedule));

    return params.toString();
}

module.exports = {
    buildQueryString,
};
