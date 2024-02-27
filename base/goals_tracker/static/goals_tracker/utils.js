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

// Attach the function to the window object
window.addGreeting = addGreeting;
