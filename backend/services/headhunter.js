const fetch = require('node-fetch');

/**
 * Build a URL query string for HeadHunter API.
 *
 * @private
 * @param {Object} options - Options object
 * @param {string} options.text - Search text
 * @param {number} options.perPage - Results per page
 * @param {number} options.page - Page index (zero-based)
 * @param {string|number|null} options.salary - Salary filter
 * @param {string|null} options.currency - Currency filter
 * @param {string|number|null} options.area - Area filter
 * @param {string|null} options.employment - Employment type
 * @param {string|null} options.experience - Experience filter
 * @param {string|null} options.schedule - Schedule filter
 * @returns {string} URL query string
 */
function _buildQueryString({
    text,
    perPage,
    page,
    salary,
    currency,
    area,
    employment,
    experience,
    schedule,
}) {
    const params = new URLSearchParams();
    params.append('text', String(text));
    params.append('per_page', perPage);
    params.append('page', page);

    if (salary) {
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

/**
 * Fetch vacancies from HeadHunter API.
 *
 * @param {Object} options - Options object
 * @param {string} options.text - Search text (required)
 * @param {number} [options.perPage=50] - Number of items per page
 * @param {number} [options.page=0] - Zero-based page index
 * @param {string|number|null} [options.salary=null] - Salary filter
 * @param {string|null} [options.currency=null] - Currency filter
 * @param {string|number|null} [options.area=null] - Area filter
 * @param {string|null} [options.employment=null] - Employment type
 * @param {string|null} [options.experience=null] - Experience filter
 * @param {string|null} [options.schedule=null] - Schedule filter
 * @returns {Promise<{info: {page:number, totalPages:number, totalVacancies:number}, vacancies:Array}>}
 * @throws {Error} Throws error if request fails or search text is missing
 *
 * @example
 * const result = await getVacancies({ text: 'developer', salary: 50000, page: 0 });
 */
async function getVacancies(options = {}) {
    const {
        text,
        perPage = 50,
        page = 0,
        salary = null,
        currency = null,
        area = null,
        employment = null,
        experience = null,
        schedule = null,
    } = options;

    if (!text || !text.trim()) {
        const err = new Error('Search text is required');
        err.status = 400;
        throw err;
    }

    const safePerPage = Math.max(1, parseInt(perPage, 10) || 50);
    const safePage = Math.max(0, parseInt(page, 10) || 0);

    const queryString = _buildQueryString({
        text,
        perPage: safePerPage,
        page: safePage,
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

    const vacancies = (data.items || []).map((item) => ({
        ...item,
        created_at: item.published_at
            ? new Date(item.published_at)
            : new Date(),
    }));

    return {
        info: {
            page: typeof data.page === 'number' ? data.page : safePage,
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
