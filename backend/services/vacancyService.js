const vacancySchema = require('../database/schemas/vacancy');

const DEFAULT_LIMIT = 50;

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

    const result = await vacancySchema.bulkWrite(operations, { ordered: false });
    return result;
}

/**
 * Retrieve vacancies from DB with pagination.
 *
 * @param {number} page - zero-based page index (0 => first page)
 * @param {number} [limit=DEFAULT_LIMIT] - number of items per page
 * @returns {Promise<{ vacancies: Array, page: number, totalVacancies: number, totalPages: number }>}
 */
async function getPaged(page = 0, limit = DEFAULT_LIMIT) {
    const safePage = Number.isNaN(Number(page)) ? 0 : Math.max(0, parseInt(page, 10));
    const safeLimit = Number.isNaN(Number(limit)) ? DEFAULT_LIMIT : Math.max(1, parseInt(limit, 10));
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
