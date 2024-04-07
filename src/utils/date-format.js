export const dateFormat = (customDate) => {

   if (!customDate) {
      return null;
   }

   const [year, month, day] = customDate.split('-');
   return `${year}-${month}-${day}T00:00:00.000Z`;
};

// Function to get the date in the format "Thursday, 20 April 2024"
export const getFormattedDate = (dateString) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dateParts = dateString.split(' ')[0].split('-');
  const date = new Date(Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
  const dayOfWeek = days[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
};

// Function to get the time in the format "17:35"
export const getFormattedTime = (dateString) => {
 const timeParts = dateString.split(' ')[1].split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${formattedHours}:${formattedMinutes}`;
};
