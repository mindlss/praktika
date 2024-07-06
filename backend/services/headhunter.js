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
    console.log(page);
    const url =
        `https://api.hh.ru/vacancies?text=${text}&per_page=${perPage}&page=${page}` +
        `${salary ? `&salary=${salary}` : ''}` +
        `${currency ? `&currency=${currency}` : ''}` +
        `${salary ? `&only_with_salary=true` : ''}` +
        `${area ? `&area=${area}` : ''}` +
        `${employment ? `&employment=${employment}` : ''}` +
        `${experience ? `&experience=${experience}` : ''}` +
        `${schedule ? `&schedule=${schedule}` : ''}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

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
