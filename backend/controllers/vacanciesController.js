const headhunterService = require('../services/headhunter');
const vacancyService = require('../services/vacancyService');

const DEFAULT_LIMIT = 50;

/**
 * Controller for vacancies-related endpoints.
 * Responsibilities:
 *  - Validate and normalize HTTP request parameters
 *  - Call external service (headhunterService) to fetch vacancies
 *  - Persist vacancies via vacancyService
 *  - Return structured HTTP responses
 */
class VacanciesController {
    constructor() {
        this.getVacancies = this.getVacancies.bind(this);
        this.getAllVacancies = this.getAllVacancies.bind(this);
    }

    /**
     * Parse and normalize query parameters from request
     *
     * @param {Object} query - req.query object
     * @returns {Object} normalized query parameters
     * @throws {Error} with status=400 if required fields are missing
     */
    _parseVacancyQuery(query = {}) {
        const name = (query.name || '').trim();
        if (!name) {
            const err = new Error('Name is required');
            err.status = 400;
            throw err;
        }

        const page = Number.isNaN(Number(query.page))
            ? 0
            : Math.max(0, parseInt(query.page, 10));
        const limit = Number.isNaN(Number(query.limit))
            ? DEFAULT_LIMIT
            : Math.max(1, parseInt(query.limit, 10));
        const salary = query.salary !== undefined ? query.salary : null;

        return {
            text: name,
            page,
            perPage: limit,
            salary,
            currency: query.currency || null,
            area: query.area || null,
            employment: query.employment || null,
            experience: query.experience || null,
            schedule: query.schedule || null,
        };
    }

    /**
     * Centralized error handler
     *
     * @param {Object} res - Express response object
     * @param {Error} err - error to handle
     * @returns {Object} Express response
     */
    _handleError(res, err) {
        const status = err && err.status ? err.status : 500;
        if (status >= 400 && status < 500) {
            return res
                .status(status)
                .json({ error: err.message || 'Bad Request' });
        }
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }

    /**
     * GET /vacancies
     *
     * Fetch vacancies from HeadHunter API using object-style parameters,
     * persist results in DB, and return payload to client.
     *
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise<Object>} JSON response with info and vacancies
     */
    async getVacancies(req, res) {
        try {
            const options = this._parseVacancyQuery(req.query);

            const data = await headhunterService.getVacancies(options);

            const vacancies = Array.isArray(data.vacancies)
                ? data.vacancies
                : [];
            await vacancyService.upsertMany(vacancies);

            return res.json(data);
        } catch (err) {
            return this._handleError(res, err);
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
            const page = Number.isNaN(Number(req.query.page))
                ? 0
                : Math.max(0, parseInt(req.query.page, 10));
            const limit = DEFAULT_LIMIT;

            const { vacancies, totalVacancies, totalPages } =
                await vacancyService.getPaged(page, limit);

            return res.json({
                info: {
                    page,
                    totalPages,
                    totalVacancies,
                },
                vacancies,
            });
        } catch (err) {
            return this._handleError(res, err);
        }
    }
}

module.exports = new VacanciesController();
