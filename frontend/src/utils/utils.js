// email validation function using a regular expression
export const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const compareDates = (startDate, endDate) => {
  // Convert date strings to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get the time in milliseconds using .getTime()
  const startTime = start.getTime();
  const endTime = end.getTime();

  let errorMsg = {
    start: "",
    end: "",
  };

  // Compare the two dates
  if (startTime > endTime) {
    errorMsg.start = `Must go before end date.`;
    errorMsg.end = `Must go after start date.`;
  } else if (startTime === endTime) {
    errorMsg.start = `Dates must differ.`;
    errorMsg.end = `Dates must differ.`;
  }

  return errorMsg;
};

export const getRemainingDays = (endDate) => {
  const deadline = new Date(endDate); // Replace with your end date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = deadline - currentDate;

  // Convert milliseconds to days
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysRemaining;
};
