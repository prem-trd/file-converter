
const CONVERSION_LIMIT = 2;
const CONVERSION_COUNT_KEY = 'conversionCount';
const LAST_CONVERSION_DATE_KEY = 'lastConversionDate';

const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
};

export const checkConversionLimit = () => {
  const lastConversionDate = localStorage.getItem(LAST_CONVERSION_DATE_KEY);
  const today = getToday();

  if (lastConversionDate !== today) {
    localStorage.setItem(CONVERSION_COUNT_KEY, '0');
    localStorage.setItem(LAST_CONVERSION_DATE_KEY, today);
  }

  const conversionCount = parseInt(localStorage.getItem(CONVERSION_COUNT_KEY) || '0', 10);
  return conversionCount >= CONVERSION_LIMIT;
};

export const incrementConversionCount = () => {
  const lastConversionDate = localStorage.getItem(LAST_CONVERSION_DATE_KEY);
  const today = getToday();

  if (lastConversionDate !== today) {
    localStorage.setItem(CONVERSION_COUNT_KEY, '1');
    localStorage.setItem(LAST_CONVERSION_DATE_KEY, today);
  } else {
    const conversionCount = parseInt(localStorage.getItem(CONVERSION_COUNT_KEY) || '0', 10);
    localStorage.setItem(CONVERSION_COUNT_KEY, (conversionCount + 1).toString());
  }
};
