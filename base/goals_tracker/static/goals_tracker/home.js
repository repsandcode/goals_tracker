// Home SPA
// const showHome = document.querySelector("#show-home");
// const showBigGoals = document.querySelector("#show-big-goals");
// const home = document.querySelector("#home");
// const bigGoals = document.querySelector("#big-goals");

// pages
const homePage = document.querySelector("#home-page");
const bigGoalPage = document.querySelector("#big-goal-page");

// sidebar
const mainSidebarDashboard = document.querySelector("#main-sidebar-dashboard");
const mainSidebarProfile = document.querySelector("#main-sidebar-profile");

// big goals section
const allBigGoals = document.querySelector("#all-big-goals");
const bigGoalModal = document.querySelector("#big-goal-modal");
const bigGoalModalContent = document.querySelector("#big-goal-modal-content");
const bigGoalMessage = document.querySelector("#big-goal-message");
const bigGoalTitle = document.querySelector("#big-goal-title");
const bigGoalStart = document.querySelector("#big-goal-start");
const bigGoalDeadline = document.querySelector("#big-goal-deadline");
const bigGoalDescription = document.querySelector("#big-goal-description");

// daily systems section
const allDailySystems = document.querySelector("#all-daily-systems");

// global variables
let allBigGoalsArr = [];

/*************************/
//    CLICK LISTENER    //
/***********************/
const modalCenters = document.querySelectorAll(".modal-center");
// when the user clicks anywhere outside of the modal or its child elements, close it    
modalCenters.forEach((modalCenter) => {
  modalCenter.addEventListener('click', (event) => {

    if (event.target === modalCenter) {      
      if (bigGoalModal && bigGoalModal.style.display === "block") {
        bigGoalModal.style.display = "none";
        bigGoalMessage.innerText = "";
      } 
      
      if (dailySystemModal && dailySystemModal.style.display === "block") {   
        dailySystemModal.style.display = "none";
        dailySystemMsg.innerText = "";
      }

      if (deleteBigGoalModal && deleteBigGoalModal.style.display === "block") {
        deleteBigGoalModal.style.display = "none";
      }
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  /*************************/
  // AUTOMATIC RENDERINGS //
  /***********************/
  getUserData();
  addGreeting(); // user greetings
  showHomePage(); // home page contents
});


// Update Sidebar Status
const onSidebarMenuItem = () => {
  mainSidebarDashboard.classList.toggle("sidebar-menu-item-on");
  mainSidebarProfile.classList.toggle("sidebar-menu-item-on");
}

// PAGES
const showHomePage = () => {
  mainSidebarDashboard.classList.toggle("sidebar-menu-item-on");
  
  // const homeParty = () => {
  //   showHome.classList.toggle("page-status--box-off");
  //   showHome.classList.add("page-status--box-on");
  //   showBigGoals.classList.toggle("page-status--box-off");
  //   showBigGoals.classList.remove("page-status--box-on");

  //   bigGoals.style.display = "none";
  //   home.style.display = "block";
  //   getAllDailySystems(); 
  // }

  // const bigGoalsParty = () => {
  //   showBigGoals.classList.add("page-status--box-on");
  //   showBigGoals.classList.toggle("page-status--box-off");
  //   showHome.classList.remove("page-status--box-on");
  //   showHome.classList.add("page-status--box-off");

  //   home.style.display = "none";
  //   bigGoals.style.display = "block";
  //   getAllBigGoals();
  // }

  // homeParty();

  // showHome.addEventListener("click", () => {
  //   homeParty();
  // })

  // bigGoalsParty();

  getAllDailySystems(); 
  getAllBigGoals();
  // create a big goal
  document
    .querySelector("#open-big-goal-modal")
    .addEventListener("click", () => showBigGoalModal());
  document
    .querySelector("#close-big-goal-modal")
    .addEventListener("click", () => hideBigGoalModal());

  const createBigGoal = (event) => {
    event.preventDefault();

    const invalidPattern = /^[^\s]*[\/.][^\s]*$/; // Matches strings without spaces but containing slash or period

    if (allBigGoalsArr.includes(bigGoalTitle.value)) {
      bigGoalMessage.innerText = `"${bigGoalTitle.value}" already exists.`;
    } else if (invalidPattern.test(bigGoalTitle.value)) {
      bigGoalMessage.innerText = `Title cannot contain slashes or periods without spaces.`;
    } else {
      fetch("/create-big-goal", {
        method: "POST",
        body: JSON.stringify({
          title: bigGoalTitle.value,
          start: bigGoalStart.value,
          deadline: bigGoalDeadline.value,
          description: bigGoalDescription.value,
        }),
        credentials: "same-origin",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          response.json();
          console.log("--->", response.status, "<---");
          if (response.ok) {
            console.log("Big Goal created succesfully");
            // bigGoalsParty();
            hideBigGoalModal();
            showHomePage();
          }
          console.log("Failed creating Big Goal");
        })
        .catch((error) => {
          // Handle network errors or exceptions here
          console.error("Error:", error);
        });
    }

  };
  const showBigGoalModal = () => {
    bigGoalModal.style.display = "block";
    // start date
    bigGoalStart.min = defaultStartDate();
    bigGoalStart.value = defaultStartDate();
    // deadline
    bigGoalDeadline.min = defaultDeadlineDate();
    document.querySelector("#big-goal-form").onsubmit = createBigGoal;
  };
  const hideBigGoalModal = () => {
    bigGoalModal.style.display = "none";
  };
};

const showBigGoalPage = (title) => {
  // Construct the URL for the big_goal page
  const url = `/big-goal/${title}`;
  // Redirect to the constructed URL
  window.location.href = url;
};

// FETCH APIS
const getUserData = () => {
  try {
    fetch("/get-user-data")
      .then((res) => {
        if (res.ok) {
          console.log("success! retrieved user data");
        } else {
          console.log("failed to retrieve user data");
        }
        return res.json();
      })
      .then((user) => {
        console.log(user);
        const profile_header = document.querySelector("#profile-header");
        profile_header.innerHTML = 
          `
            <p class="mb-0 fs-4">${user.first_name !== "" ? `${user.first_name} ${user.last_name}` : user.username}</p>
            <p class="mb-0 fw-light fs-6">${user.email}</p>
          `;
      })
  } catch (error) {
    console.log(error);
  }
}

const deleteOldGoal = (goal) => {
  try {
    // Deadline has passed, delete old goals
    fetch("/delete-old-goal", {
      method: "DELETE",
      body: JSON.stringify({
        title: goal.title,
        description: goal.description,
        start: goal.start,
        deadline: goal.deadline,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Ensure to include CSRF token
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Big Goal deleted successfully");
          window.location.href = "/";
        } else {
          console.error("Failed to delete Big Goal");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
};

const getAllBigGoals = () => {
  try {
    fetch("/big-goals")
      .then((res) => {
        if (res.ok) {
          console.log("Success! Retrieved all big goals");
        } else {
          console.log("Failed to retrieve all big goals");
        }
        return res.json();
      })
      .then((bigGoals) => {
        allBigGoals.innerHTML = "";
        const currentDate = new Date();

        bigGoals.forEach((data) => {
          console.log(data);
          
          const bigGoalBox = document.createElement("div");
          const bigGoalData = data.big_goal;
          
          const title = bigGoalData.title;
          allBigGoalsArr.push(title);
          const dailySystems = data.daily_systems;

          const timeline = data.timeline;
          const startDate = new Date(timeline.start);
          const deadline = new Date(timeline.deadline);
          const tenAfterDeadline = new Date(deadline);
          tenAfterDeadline.setDate(deadline.getDate() + 10);

          const daysLeftAfterDeadline = Math.ceil((tenAfterDeadline - currentDate) / (1000 * 60 * 60 * 24));
          const daysLeftBeforeDeadline = Math.ceil((deadline - currentDate) / (1000 * 60 * 60 * 24));
          const daysLeftBeforeStartDate = Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24));

          bigGoalBox.classList.add("col", "col-xxl-6");
          bigGoalBox.dataset.title = title.split(" ").join("-");

          bigGoalBox.innerHTML = `
            <div class="big-goal-box box-radius">
              <h2 class="big-goal-box--title fw-normal">${title}</h2>
              <div class="big-goal-box--content">
                <p class="m-0 fs-5 fw-normal ${currentDate > deadline? 'red':''}">Due date: ${timeline.deadline}</p>
                <div class="big-goal-box--content-tags">
                <div class="big-goal-box--content-tag yellow box-radius fs-5">${timeline.all_dates.length} ${timeline.all_dates.length === 1? "day" : "days"}</div>
                  <div class="big-goal-box--content-tag yellow box-radius fs-5">${dailySystems.length} ${dailySystems.length === 1? "daily system" : "daily systems"}</div>
                  <div class="big-goal-box--content-tag ${currentDate <= deadline ? 'green' : 'red'} box-radius fs-5">
                    ${
                      currentDate <= startDate
                        ? daysLeftBeforeStartDate + " days before start"
                        : currentDate <= deadline
                          ? daysLeftBeforeDeadline === 1
                            ? daysLeftBeforeDeadline + " day left"
                            : daysLeftBeforeDeadline + " days left"
                          : "auto-delete in " + daysLeftAfterDeadline + " days"
                    }
                  </div>
                </div>
              </div>
            </div>
          `;

          allBigGoals.append(bigGoalBox);

          if (currentDate >= tenAfterDeadline) {
            deleteOldGoal(bigGoalData);
          }
        });

        return document.querySelectorAll(".big-goal-box");
      })
      .then(function (bigGoalBoxes) {
        Array.from(bigGoalBoxes).forEach(function (bigGoal) {
          const bigGoalTitle = bigGoal.parentElement.dataset.title;
          console.log(bigGoal, bigGoalTitle);

          bigGoal.addEventListener("click", function () {
            showBigGoalPage(bigGoalTitle);
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

const getAllDailySystems = () => {
  try {
    allDailySystems.dataset.today = getTodaysDate();

    fetch("/daily-systems")
      .then((res) => {
        if (res.ok) {
          console.log("success! retrieved all daily systems");
        } else {
          console.log("failed to retrieve all daily systems");
        }
        return res.json();
      })
      .then((dailySystems) => {
        console.log(dailySystems);

        allDailySystems.innerHTML = "";

        if (dailySystems.length < 1) {
          const noDailySystemsMessage = document.createElement("h5");
          noDailySystemsMessage.classList.add("m-0", "fw-normal");
          noDailySystemsMessage.textContent = "No daily systems";
          allDailySystems.appendChild(noDailySystemsMessage);
          return;
        }
        
        dailySystems.forEach((daily) => {
          const dailySystemBox = document.createElement("div");
          const classesToAdd = ["bg-dark-subtle", "box-radius", "daily-system-box"];

          if (daily.completed) {
            classesToAdd.push("text-decoration-line-through");
          } 

          dailySystemBox.classList.add(...classesToAdd);
          dailySystemBox.dataset.bigGoal = daily.big_goal;
          dailySystemBox.innerHTML = `
            <h5 class="m-0 fw-normal">${daily.action}</h5>
          `;

          allDailySystems.append(dailySystemBox);
        });
      })
      .then(() => {
        const allDailySystemBox = document.querySelectorAll(".daily-system-box");
        const dateToday = allDailySystems.dataset.today;

        Array.from(allDailySystemBox).forEach((dailySystem) => {
          const bigGoal = dailySystem.dataset.bigGoal;
          const action = dailySystem.innerText;
          
          dailySystem.addEventListener("click", () => {
            if (dailySystem.classList.contains("text-decoration-line-through")) {
              markIncompleteDailySystem(bigGoal, action, dateToday);
              dailySystem.classList.remove("text-decoration-line-through");
            } else {
              markCompleteDailySystem(bigGoal, action, dateToday);
              dailySystem.classList.add("text-decoration-line-through");
            }
          })
        });
      });
  } catch (error) {
    console.log(error);
  }
}

const markCompleteDailySystem = (bigGoal, dailySystem, date) => {
  try {
    fetch(`/mark-complete-daily-system`, {
      method: "POST",
      body: JSON.stringify({
        bigGoal: bigGoal,
        dailySystem: dailySystem,
        date: date,
      }),
      credentials: "same-origin",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => {        
        response.json();
        console.log("--->", response.status, "<---");
        if (response.ok) {
          console.log(`Completed ${dailySystem} - ${date}`);
        } else console.log(`Failed completing ${dailySystem} - ${date}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
}

const markIncompleteDailySystem = (bigGoal, dailySystem, date) => {
  try {
    fetch(`/mark-incomplete-daily-system`, {
      method: "DELETE",
      body: JSON.stringify({
        bigGoal: bigGoal,
        dailySystem: dailySystem,
        date: date,
      }),
      credentials: "same-origin",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => {
        response.json();
        console.log("--->", response.status, "<---");
        if (response.ok) {
          console.log(`Deleted ${dailySystem} - ${date}`);
        } else console.log(`Failed deleting ${dailySystem} - ${date}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
}

const getAllCompletedDailySystems = () => {
  try {
    return fetch("/all-completed-daily-systems")
      .then((res) => {
        if (res.ok) {
          console.log("success! retrieved all completed daily systems");
          return res.json();
        } else {
          console.log("failed to retrieve all completed daily systems");
          return null;
        }
      })
  } catch (error) {
    console.log(error);
    return null;
  }
}