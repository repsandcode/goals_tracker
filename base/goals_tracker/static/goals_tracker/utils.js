const addGreeting = () => {
  const currentHour = new Date().getHours();
  let greeting = "";

  if (currentHour >= 6 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  document.querySelector("#greetings").textContent = greeting;
};

const defaultDeadlineDate = () => {
  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format tomorrow's date as YYYY-MM-DD
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];

  return formattedTomorrow;
};

// Attach the function to the window object
window.addGreeting = addGreeting;
window.defaultDeadlineDate = defaultDeadlineDate;
