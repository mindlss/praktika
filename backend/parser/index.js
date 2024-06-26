const fetch = require('node-fetch');
const cheerio = require('cheerio');

console.log('Parser is active');

async function getHtml(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        },
    });
    const html = await response.text();
    return html;
}

function parse(html) {
    const $ = cheerio.load(html);

    const vacancies = [];

    $('.vacancy-search-item__card').each((i, elem) => {
        const isTrustedEmployer =
            $(elem).find('[data-qa="trusted-employer-link"]').length > 0;
        const isAccreditedEmployer =
            $(elem).find('.serp-item-link-disable').length > 0;
        const isResumeNeeded =
            $(elem).find('[data-qa="vacancy-label-no-resume"]').length == 0;

        vacancies.push({
            title: $(elem).find('[data-qa="serp-item__title"]').text(),
            company: $(elem)
                .find('[data-qa="vacancy-serp__vacancy-employer"] > span')
                .text(),
            city: $(elem)
                .find('[data-qa="vacancy-serp__vacancy-address_narrow"] > span')
                .text(),
            metro: $(elem).find('.metro-station:first').text(),
            salary: $(elem)
                .find('span.bloko-text:not(.bloko-text_small):first > span')
                .text(),
            experience: $(elem)
                .find('[data-qa="vacancy-serp__vacancy-work-experience"]:first')
                .text(),
            responsibility: $(elem)
                .find(
                    '[data-qa="vacancy-serp__vacancy_snippet_responsibility"]:first'
                )
                .text(),
            requirment: $(elem)
                .find(
                    '[data-qa="vacancy-serp__vacancy_snippet_requirement"]:first'
                )
                .text(),
            isTrustedEmployer: isTrustedEmployer,
            isAccreditedEmployer: isAccreditedEmployer,
            isResumeNeeded: isResumeNeeded,
        });
    });

    return vacancies;
}

async function main() {
    const url =
        'https://hh.ru/search/vacancy?search_field=name&search_field=company_name&search_field=description&text=Backend&enable_snippets=true';
    const html = await getHtml(url);
    console.log(parse(html));
}

main();
