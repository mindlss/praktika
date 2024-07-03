const headhunterService = require('../services/headhunter');
const vacancySchema = require('../database/schemas/vacancy');
const Fuse = require('fuse.js');

class VacanciesController {
    async getVacancies(req, res) {
        try {
            const filters = req.query;

            if (!filters.name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const data = await headhunterService.getVacancies(
                filters.name,
                50,
                filters.page,
                filters.salary,
                filters.currency,
                filters.area,
                filters.employment,
                filters.experience,
                filters.schedule
            );
            const operations = data.vacancies.map((vacancy) => {
                return {
                    updateOne: {
                        filter: { id: vacancy.id },
                        update: { $set: vacancy },
                        upsert: true,
                    },
                };
            });
            await vacancySchema.bulkWrite(operations);

            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }

    async getAllVacancies(req, res) {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = 50;
            const skip = page * limit;
            const totalVacancies = await vacancySchema.countDocuments();
            const totalPages = Math.ceil(totalVacancies / limit - 1);
            const vacancies = await vacancySchema
                .find({})
                .skip(skip)
                .limit(limit);
            res.json({
                info: {
                    page,
                    totalPages,
                    totalVacancies,
                },
                vacancies,
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new VacanciesController();
