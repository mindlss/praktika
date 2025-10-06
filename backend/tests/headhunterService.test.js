// tests/headhunterService.test.js
const headhunterService = require('../services/headhunter');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());

describe('headhunterService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should throw error if text is missing', async () => {
        await expect(headhunterService.getVacancies({})).rejects.toThrow(
            'Search text is required'
        );
    });

    it('should call fetch with correct URL and return data', async () => {
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                items: [
                    {
                        id: 1,
                        name: 'Job 1',
                        published_at: '2025-10-06T10:00:00',
                    },
                ],
                page: 0,
                pages: 1,
                found: 1,
            }),
        };
        fetch.mockResolvedValue(mockResponse);

        const result = await headhunterService.getVacancies({
            text: 'developer',
        });

        expect(fetch).toHaveBeenCalledTimes(1);
        const calledUrl = fetch.mock.calls[0][0];
        expect(calledUrl).toMatch(/text=developer/);

        expect(result.vacancies.length).toBe(1);
        expect(result.vacancies[0].id).toBe(1);
        expect(result.info.page).toBe(0);
        expect(result.info.totalPages).toBe(0);
        expect(result.info.totalVacancies).toBe(1);
    });

    it('should throw error if fetch response is not ok', async () => {
        fetch.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            text: jest.fn().mockResolvedValue('Server error'),
        });

        await expect(
            headhunterService.getVacancies({ text: 'dev' })
        ).rejects.toThrow(
            /HH API request failed: 500 Internal Server Error - Server error/
        );
    });

    it('should handle optional parameters', async () => {
        const mockResponse = {
            ok: true,
            json: jest
                .fn()
                .mockResolvedValue({ items: [], page: 0, pages: 1, found: 0 }),
        };
        fetch.mockResolvedValue(mockResponse);

        await headhunterService.getVacancies({
            text: 'dev',
            salary: 50000,
            currency: 'RUR',
            area: 1,
            employment: 'full',
            experience: 'noExperience',
            schedule: 'remote',
            perPage: 20,
            page: 2,
        });

        const calledUrl = fetch.mock.calls[0][0];
        expect(calledUrl).toMatch(/salary=50000/);
        expect(calledUrl).toMatch(/currency=RUR/);
        expect(calledUrl).toMatch(/area=1/);
        expect(calledUrl).toMatch(/employment=full/);
        expect(calledUrl).toMatch(/experience=noExperience/);
        expect(calledUrl).toMatch(/schedule=remote/);
        expect(calledUrl).toMatch(/per_page=20/);
        expect(calledUrl).toMatch(/page=2/);
    });
});
