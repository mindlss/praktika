const headhunterService = require('../services/headhunter');
const vacancyService = require('../services/vacancyService');
const { normalizeVacancyQuery, normalizePage } = require('../utils/validators');
const { handleError } = require('../utils/errorHandler');

const DEFAULT_LIMIT = 50;

/**
 * Controller responsible for handling vacancy-related endpoints.
 * Responsibilities:
 *  - Normalize and validate query parameters
 *  - Retrieve vacancies from the HeadHunter API
 *  - Store and retrieve vacancies from the database
 *  - Return structured JSON responses
 */
class VacanciesController {
    /**
     * Send a structured JSON response.
     * @param {import('express').Response} res - Express response object
     * @param {Object} payload - JSON response body
     * @returns {Object} JSON response
     */
    sendJson(res, payload) {
        return res.json(payload);
    }

    /**
     * Process vacancies retrieved from HeadHunter API.
     * Ensures data integrity and updates database records.
     * @param {Object} hhResponse - Response from HeadHunter API
     * @returns {Promise<Object>} Processed response with validated vacancies
     */
    async processVacanciesData(hhResponse) {
        const vacancies = Array.isArray(hhResponse?.vacancies)
            ? hhResponse.vacancies
            : [];

        if (vacancies.length > 0) {
            await vacancyService.upsertMany(vacancies);
        }

        return hhResponse;
    }

    /**
     * GET /vacancies
     *
     * Fetch vacancies from the HeadHunter API using normalized query parameters,
     * persist them to the database, and return the full API response.
     *
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @returns {Promise<Object>} JSON response with vacancies and metadata
     */
    getVacancies = async (req, res) => {
        try {
            const queryOptions = normalizeVacancyQuery(
                req.query,
                DEFAULT_LIMIT
            );
            const hhResponse = await headhunterService.getVacancies(
                queryOptions
            );
            const result = await this.processVacanciesData(hhResponse);
            return this.sendJson(res, result);
        } catch (err) {
            return handleError(res, err);
        }
    };

    /**
     * GET /vacancies/all
     *
     * Retrieve paginated vacancies stored in the database.
     *
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @returns {Promise<Object>} JSON response with paginated vacancies
     */
    getAllVacancies = async (req, res) => {
        try {
            const page = normalizePage(req.query.page);
            const { vacancies, totalVacancies, totalPages } =
                await vacancyService.getPaged(page, DEFAULT_LIMIT);

            return this.sendJson(res, {
                info: { page, totalPages, totalVacancies },
                vacancies,
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

module.exports = new VacanciesController();
