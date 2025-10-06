const fetch = require('node-fetch');
const { buildQueryString } = require('../utils/queryBuilder');

const HH_API_URL = 'https://api.hh.ru/vacancies';

/**
 * Service responsible for interacting with the HeadHunter API.
 * Provides methods for fetching and transforming vacancy data.
 */

/**
 * Build a complete request URL for the HeadHunter API.
 * @param {Object} options - Search and filter parameters
 * @returns {string} Fully qualified URL with query string
 */
function buildHeadHunterUrl(options) {
    const queryString = buildQueryString(options);
    return `${HH_API_URL}?${queryString}`;
}

/**
 * Convert raw vacancy items into normalized objects.
 * @param {Array} items - Raw items from HH API
 * @returns {Array<Object>} Normalized vacancy objects
 */
function transformVacancies(items) {
    if (!Array.isArray(items)) return [];

    return items.map((item) => ({
        ...item,
        created_at: item.published_at
            ? new Date(item.published_at)
            : new Date(),
    }));
}

/**
 * Perform a request to the HeadHunter API and return structured data.
 * @param {Object} options - Query and filter parameters
 * @param {string} [options.text] - Search text
 * @param {number} [options.perPage=50] - Items per page
 * @param {number} [options.page=0] - Zero-based page index
 * @param {string|number|null} [options.salary=null] - Salary filter
 * @param {string|null} [options.currency=null] - Currency filter
 * @param {string|number|null} [options.area=null] - Area filter
 * @param {string|null} [options.employment=null] - Employment type filter
 * @param {string|null} [options.experience=null] - Experience filter
 * @param {string|null} [options.schedule=null] - Schedule filter
 * @returns {Promise<{info: {page:number, totalPages:number, totalVacancies:number}, vacancies:Array}>}
 * @throws {Error} If request fails or response is invalid
 */
async function getVacancies(options = {}) {
    const url = buildHeadHunterUrl(options);

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'node.js hh-client',
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        const errorMessage = `HH API request failed: ${response.status} ${
            response.statusText
        }${body ? ' - ' + body : ''}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }

    const data = await response.json();
    const vacancies = transformVacancies(data.items);

    return {
        info: {
            page: typeof data.page === 'number' ? data.page : options.page ?? 0,
            totalPages:
                typeof data.pages === 'number'
                    ? Math.max(0, data.pages - 1)
                    : 0,
            totalVacancies:
                typeof data.found === 'number' ? data.found : vacancies.length,
        },
        vacancies,
    };
}

module.exports = { getVacancies };
