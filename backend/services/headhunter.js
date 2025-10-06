const fetch = require('node-fetch');
const { buildQueryString } = require('../utils/queryBuilder');

/**
 * Fetch vacancies from HeadHunter API.
 *
 * @param {Object} options - Options object
 * @param {string} [options.text] - Search text (optional)
 * @param {number} [options.perPage=50] - Number of items per page
 * @param {number} [options.page=0] - Zero-based page index
 * @param {string|number|null} [options.salary=null] - Salary filter
 * @param {string|null} [options.currency=null] - Currency filter
 * @param {string|number|null} [options.area=null] - Area filter
 * @param {string|null} [options.employment=null] - Employment type filter
 * @param {string|null} [options.experience=null] - Experience filter
 * @param {string|null} [options.schedule=null] - Schedule filter
 * @returns {Promise<{info: {page:number, totalPages:number, totalVacancies:number}, vacancies:Array}>}
 * @throws {Error} Throws error if request fails
 */
async function getVacancies(options = {}) {
    const {
        text,
        perPage,
        page,
        salary,
        currency,
        area,
        employment,
        experience,
        schedule,
    } = options;

    const queryString = buildQueryString({
        text,
        perPage,
        page,
        salary,
        currency,
        area,
        employment,
        experience,
        schedule,
    });

    const url = `https://api.hh.ru/vacancies?${queryString}`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'node.js hh-client',
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        const err = new Error(
            `HH API request failed: ${response.status} ${response.statusText}${
                body ? ' - ' + body : ''
            }`
        );
        err.status = response.status;
        throw err;
    }

    const data = await response.json();

    const vacancies = Array.isArray(data.items)
        ? data.items.map((item) => ({
              ...item,
              created_at: item.published_at
                  ? new Date(item.published_at)
                  : new Date(),
          }))
        : [];

    return {
        info: {
            page: typeof data.page === 'number' ? data.page : page,
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
