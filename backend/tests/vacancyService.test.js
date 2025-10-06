// tests/vacancyService.test.js
const vacancyService = require('../services/vacancyService');
const vacancySchema = require('../database/schemas/vacancy');

jest.mock('../database/schemas/vacancy');

describe('vacancyService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('upsertMany', () => {
        it('should do nothing if vacancies array is empty', async () => {
            const result = await vacancyService.upsertMany([]);
            expect(result).toEqual({ inserted: 0 });
            expect(vacancySchema.bulkWrite).not.toHaveBeenCalled();
        });

        it('should call bulkWrite with correct operations', async () => {
            const mockVacancies = [
                { id: 1, name: 'Job 1' },
                { id: 2, name: 'Job 2' },
            ];
            vacancySchema.bulkWrite.mockResolvedValue({ nUpserted: 2 });

            const result = await vacancyService.upsertMany(mockVacancies);

            expect(vacancySchema.bulkWrite).toHaveBeenCalledTimes(1);
            const ops = vacancySchema.bulkWrite.mock.calls[0][0];
            expect(ops).toHaveLength(2);
            expect(ops[0]).toEqual({
                updateOne: {
                    filter: { id: 1 },
                    update: { $set: mockVacancies[0] },
                    upsert: true,
                },
            });
            expect(result).toEqual({ nUpserted: 2 });
        });
    });

    describe('getPaged', () => {
        it('should return paged vacancies with total count', async () => {
            const mockVacancies = [{ id: 1 }, { id: 2 }];
            vacancySchema.countDocuments.mockResolvedValue(10);
            vacancySchema.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockVacancies),
            });

            const result = await vacancyService.getPaged(1, 2);

            expect(vacancySchema.countDocuments).toHaveBeenCalled();
            expect(vacancySchema.find).toHaveBeenCalled();
            expect(result.vacancies).toEqual(mockVacancies);
            expect(result.page).toBe(1);
            expect(result.totalVacancies).toBe(10);
            expect(result.totalPages).toBe(4); // ceil(10/2) - 1 = 4
        });

        it('should default page and limit if invalid values provided', async () => {
            const mockVacancies = [];
            vacancySchema.countDocuments.mockResolvedValue(0);
            vacancySchema.find.mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockVacancies),
            });

            const result = await vacancyService.getPaged('abc', 'def');

            expect(result.page).toBe(0);
            expect(result.totalVacancies).toBe(0);
            expect(result.totalPages).toBe(0);
        });
    });
});
