export const dateFormat = (customDate) => {

   if (!customDate) {
      return null;
   }

   const [year, month, day] = customDate.split('-');
   return `${year}-${month}-${day}T00:00:00.000Z`;
};