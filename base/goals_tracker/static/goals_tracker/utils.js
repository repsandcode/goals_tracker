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

const defaultStartDate = () => {
  const today = new Date();

  // Format today's date as YYYY-MM-DD
  const formattedToday = today.toISOString().split("T")[0];

  return formattedToday;
};

const defaultDeadlineDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format tomorrow's date as YYYY-MM-DD
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];

  return formattedTomorrow;
};

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const formatDate = (strDate) => {
  const date = new Date(strDate);
  const formattedDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  return formattedDate;
}

// Attach the function to the window object
window.addGreeting = addGreeting;
window.defaultStartDate = defaultStartDate;
window.defaultDeadlineDate = defaultDeadlineDate;
window.getCookie = getCookie(name);
window.formatDate = formatDate();
