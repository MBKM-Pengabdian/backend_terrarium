export const dateFormat = (customDate) => {
   const [year, month, day] = customDate.split('-');
   return `20${year}-${month}-${day}T00:00:00.000Z`;
};