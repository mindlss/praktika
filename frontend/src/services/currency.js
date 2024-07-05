async function getCurrencies() {
  try {
    const response = await fetch('https://api.hh.ru/dictionaries');
    const data = await response.json();
    const options = data.currency.map((currency, index) => ({
      value: currency.code,
      label: currency.name
    }));
    return options;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }
}

export default getCurrencies