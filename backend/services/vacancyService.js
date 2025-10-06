const vacancySchema = require('../database/schemas/vacancy');

const DEFAULT_LIMIT = 50;

/**
 * Service responsible for managing vacancy records in the database.
 * Provides methods for batch upsert operations and paginated retrieval.
 */

/**
 * Insert or update multiple vacancy records in the database.
 * Performs a bulk upsert (update if exists, insert if not).
 *
 * @param {Array<Object>} vacancies - Array of vacancy objects
 * @returns {Promise<Object>} MongoDB bulkWrite result or { inserted: 0 } if no data
 */
async function upsertMany(vacancies = []) {
    if (!Array.isArray(vacancies) || vacancies.length === 0) {
        return { inserted: 0 };
    }

    const operations = vacancies.map((vacancy) => ({
        updateOne: {
            filter: { id: vacancy.id },
            update: { $set: vacancy },
            upsert: true,
        },
    }));

    return vacancySchema.bulkWrite(operations, { ordered: false });
}

/**
 * Retrieve vacancies from the database with pagination.
 *
 * @param {number} [page=0] - Zero-based page index (0 → first page)
 * @param {number} [limit=DEFAULT_LIMIT] - Number of vacancies per page
 * @returns {Promise<{vacancies: Array, page: number, totalVacancies: number, totalPages: number}>}
 */
async function getPaged(page = 0, limit = DEFAULT_LIMIT) {
    const safePage = Number.isFinite(page)
        ? Math.max(0, parseInt(page, 10))
        : 0;
    const safeLimit = Number.isFinite(limit)
        ? Math.max(1, parseInt(limit, 10))
        : DEFAULT_LIMIT;

    const skip = safePage * safeLimit;

    const [totalVacancies, vacancies] = await Promise.all([
        vacancySchema.countDocuments(),
        vacancySchema.find({}).skip(skip).limit(safeLimit),
    ]);

    const totalPages = Math.max(0, Math.ceil(totalVacancies / safeLimit) - 1);

    return {
        vacancies,
        page: safePage,
        totalVacancies,
        totalPages,
    };
}

module.exports = {
    upsertMany,
    getPaged,
};
