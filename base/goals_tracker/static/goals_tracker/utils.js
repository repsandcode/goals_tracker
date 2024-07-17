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

  // Get the date parts
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');

  // Format the date as YYYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
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
      if (cookie.substring(0, name?.length + 1) === name + "=") {
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

const checkDateIfToday = (strDate) => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('en', { month: 'long', day: '2-digit', year: 'numeric' });

  const providedDateString = strDate;

  return formattedDate === providedDateString;
}

const getTodaysDate = () => {
  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedDate =  days[today.getDay()] + "-" + (months[(today.getMonth())]) +  "-" + ("0" + today.getDate()).slice(-2) + "-" + today.getFullYear();
  
  return formattedDate;
}

const getCurrentMonthAndYear = () => {
  // Get today's date
  const today = new Date();

  // Get the month name and year
  const options = { month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleString('en-US', options);

  return formattedDate.split(" ");
};

// Attach the function to the window object
window.addGreeting = addGreeting;
window.defaultStartDate = defaultStartDate;
window.defaultDeadlineDate = defaultDeadlineDate;
window.getCookie = getCookie();
window.formatDate = formatDate();
window.checkDateIfToday = checkDateIfToday();
// window.getTodaysDate = getTodaysDate();