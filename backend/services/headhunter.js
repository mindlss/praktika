const fetch = require('node-fetch');

async function getVacancies(
    text,
    perPage = 50,
    page = 0,
    salary = null,
    currency = null,
    area = null,
    employment = null,
    experience = null,
    schedule = null
) {
    const url =
        `https://api.hh.ru/vacancies?text=${text}&per_page=${perPage}&page=${page}` +
        `${salary ? `&salary=${salary}` : ''}` +
        `${currency ? `&currency=${currency}` : ''}` +
        `${area ? `&area=${area}` : ''}` +
        `${employment ? `&employment=${employment}` : ''}` +
        `${experience ? `&experience=${experience}` : ''}` +
        `${schedule ? `&schedule=${schedule}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    data.items.forEach((item) => {
        item.created_at = new Date();
    });

    const info = {
        page: data.page,
        totalPages: data.pages - 1,
        totalVacancies: data.found,
    };

    return { info: info, vacancies: data.items };
}

module.exports = {
    getVacancies,
};
