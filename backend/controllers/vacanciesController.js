const headhunterService = require('../services/headhunter');
const vacancyService = require('../services/vacancyService');
const { normalizeVacancyQuery } = require('../utils/validators');
const { handleError } = require('../utils/errorHandler');

const DEFAULT_LIMIT = 50;

/**
 * Controller for handling vacancies-related endpoints.
 * Responsibilities:
 *  - Validate and normalize HTTP request parameters
 *  - Call external API (headhunterService) to fetch vacancies
 *  - Persist vacancies via vacancyService
 *  - Return structured HTTP responses
 */
class VacanciesController {
    constructor() {
        this.getVacancies = this.getVacancies.bind(this);
        this.getAllVacancies = this.getAllVacancies.bind(this);
    }

    /**
     * GET /vacancies
     *
     * Fetch vacancies from HeadHunter API using normalized query parameters,
     * persist results in DB, and return payload to client.
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with info and vacancies
     */
    async getVacancies(req, res) {
        try {
            const options = normalizeVacancyQuery(req.query, DEFAULT_LIMIT);

            const data = await headhunterService.getVacancies(options);

            const vacancies = Array.isArray(data.vacancies)
                ? data.vacancies
                : [];
            await vacancyService.upsertMany(vacancies);

            return res.json(data);
        } catch (err) {
            return handleError(res, err);
        }
    }

    /**
     * GET /vacancies/all
     *
     * Retrieve stored vacancies from the database with pagination.
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with info and vacancies
     */
    async getAllVacancies(req, res) {
        try {
            const page = require('../utils/validators').normalizePage(
                req.query.page
            );

            const { vacancies, totalVacancies, totalPages } =
                await vacancyService.getPaged(page, DEFAULT_LIMIT);

            return res.json({
                info: {
                    page,
                    totalPages,
                    totalVacancies,
                },
                vacancies,
            });
        } catch (err) {
            return handleError(res, err);
        }
    }
}

module.exports = new VacanciesController();
