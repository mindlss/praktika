// tests/vacanciesController.test.js
const VacanciesController = require('../controllers/vacanciesController');
const headhunterService = require('../services/headhunter');
const vacancyService = require('../services/vacancyService');
const { normalizeVacancyQuery, normalizePage } = require('../utils/validators');
const { handleError } = require('../utils/errorHandler');

jest.mock('../services/headhunter');
jest.mock('../services/vacancyService');
jest.mock('../utils/validators');
jest.mock('../utils/errorHandler');

describe('VacanciesController', () => {
    let req, res;

    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    beforeEach(() => {
        req = { query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('getVacancies', () => {
        it('should fetch vacancies and upsert them', async () => {
            req.query = { name: 'developer' };

            normalizeVacancyQuery.mockReturnValue({
                text: 'developer',
                page: 0,
                perPage: 50,
                salary: null,
                currency: null,
                area: null,
                employment: null,
                experience: null,
                schedule: null,
            });

            headhunterService.getVacancies.mockResolvedValue({
                info: { page: 0, totalPages: 0, totalVacancies: 1 },
                vacancies: [{ id: 1, title: 'Test Job' }],
            });

            vacancyService.upsertMany.mockResolvedValue({ inserted: 1 });

            await VacanciesController.getVacancies(req, res);

            expect(normalizeVacancyQuery).toHaveBeenCalledWith(req.query, 50);
            expect(headhunterService.getVacancies).toHaveBeenCalledWith({
                text: 'developer',
                page: 0,
                perPage: 50,
                salary: null,
                currency: null,
                area: null,
                employment: null,
                experience: null,
                schedule: null,
            });
            expect(vacancyService.upsertMany).toHaveBeenCalledWith([
                { id: 1, title: 'Test Job' },
            ]);
            expect(res.json).toHaveBeenCalledWith({
                info: { page: 0, totalPages: 0, totalVacancies: 1 },
                vacancies: [{ id: 1, title: 'Test Job' }],
            });
        });

        it('should handle errors via handleError', async () => {
            const error = new Error('Something went wrong');
            headhunterService.getVacancies.mockRejectedValue(error);

            await VacanciesController.getVacancies(req, res);

            expect(handleError).toHaveBeenCalledWith(res, error);
        });
    });

    describe('getAllVacancies', () => {
        it('should return paged vacancies', async () => {
            req.query = { page: '1' };
            normalizePage.mockReturnValue(1);
            vacancyService.getPaged.mockResolvedValue({
                vacancies: [{ id: 2, title: 'Job 2' }],
                totalVacancies: 10,
                totalPages: 1,
            });

            await VacanciesController.getAllVacancies(req, res);

            expect(normalizePage).toHaveBeenCalledWith('1');
            expect(vacancyService.getPaged).toHaveBeenCalledWith(1, 50);
            expect(res.json).toHaveBeenCalledWith({
                info: { page: 1, totalPages: 1, totalVacancies: 10 },
                vacancies: [{ id: 2, title: 'Job 2' }],
            });
        });

        it('should handle errors via handleError', async () => {
            const error = new Error('DB error');
            vacancyService.getPaged.mockRejectedValue(error);

            await VacanciesController.getAllVacancies(req, res);

            expect(handleError).toHaveBeenCalledWith(res, error);
        });
    });
});
