// pages
const homePage = document.querySelector("#home-page");
const bigGoalPage = document.querySelector("#big-goal-page");

// big goals section
const allBigGoals = document.querySelector("#all-big-goals");
const bigGoalModal = document.querySelector("#big-goal-modal");
const bigGoalModalContent = document.querySelector("#big-goal-modal-content");
const bigGoalTitle = document.querySelector("#big-goal-title");
const bigGoalStart = document.querySelector("#big-goal-start");
const bigGoalDeadline = document.querySelector("#big-goal-deadline");
const bigGoalDescription = document.querySelector("#big-goal-description");

// daily systems section
const allDailySystems = document.querySelector("#all-daily-systems");

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
      } 
      
      if (dailySystemModal && dailySystemModal.style.display === "block") {   
        dailySystemModal.style.display = "none";
      }
      
      if (checkpointGoalModal && checkpointGoalModal.style.display === "block") {
        checkpointGoalModal.style.display = "none";
      }
      
      if (antiGoalModal && antiGoalModal.style.display === "block") {
        antiGoalModal.style.display = "none";
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

// PAGES
const showHomePage = () => {
  getAllBigGoals();
  getAllDailySystems(); 

  // create a big goal
  document
    .querySelector("#open-big-goal-modal")
    .addEventListener("click", () => showBigGoalModal());
  document
    .querySelector("#close-big-goal-modal")
    .addEventListener("click", () => hideBigGoalModal());

  const createBigGoal = (event) => {
    event.preventDefault();

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
          window.location.href = "/";
        }
        console.log("Failed creating Big Goal");
      })
      .catch((error) => {
        // Handle network errors or exceptions here
        console.error("Error:", error);
      });
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
            <h5 class="mb-1">${user.first_name !== "" ? `${user.first_name} ${user.last_name}` : user.username}</h5>
            <span class="fw-light">${user.email}</span>
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
          console.log("success! retrieved all big goals");
        } else {
          console.log("failed to retrieve all big goals");
        }
        return res.json();
      })
      .then((bigGoals) => {
        bigGoals.forEach((data) => {
          const bigGoalBox = document.createElement("div");
          const bigGoalData = data.big_goal;
          
          const titleUnedited = data.title_unedited;
          const title = bigGoalData.title;
          const antiGoals = data.anti_goals;
          const dailySystems = data.daily_systems;
          const checkpointGoals = data.checkpoint_goals;
          
          const timeline = data.timeline;
          const currentDate = new Date();
          const deadline = new Date(timeline.deadline);
          const thirty_after_deadline = new Date(deadline);
          thirty_after_deadline.setDate(deadline.getDate() + 30);
          const daysLeftAfterDeadline = Math.ceil(
            (thirty_after_deadline - currentDate) / (1000 * 60 * 60 * 24)
          );
          const daysLeftBeforeDeadline = Math.ceil(
            (deadline - currentDate) / (1000 * 60 * 60 * 24)
          );

          bigGoalBox.classList.add(
            "col-sm-6",
            "col-md-4",
            "col-lg-3",
          );

          bigGoalBox.dataset.title = title.split(" ").join("-");

          bigGoalBox.innerHTML = `
          <div class="big-goal-box box-radius bg-success-subtle">
            <h5 class="big-goal-box--title">${title}</h5>
            <div class="big-goal-box--content">
              <span class=""><i class="bi bi-dot"></i> ${dailySystems.length} daily systems</span>
              <span class=""><i class="bi bi-dot"></i> ${checkpointGoals.length} checkpoint goals</span>
              <span class=""><i class="bi bi-dot"></i> ${antiGoals.length} anti goals</span>
              <span class=""><i class="bi bi-dot"></i> 
                ${
                  currentDate <= deadline 
                  ? `${daysLeftBeforeDeadline} days left`
                  : `<span class="text-danger">Auto-delete in ${daysLeftAfterDeadline} days</span> `
                }
              </span>
            </div>
          </div>
          `;

          allBigGoals.append(bigGoalBox);

          if (currentDate >= thirty_after_deadline) {
            deleteOldGoal(bigGoalData);
          }
        });
      })
      .then(() => {
        const bigGoalBox = document.querySelectorAll(".big-goal-box");
        Array.from(bigGoalBox).forEach((bigGoal) => {      
          const bigGoalTitle = bigGoal.parentElement.dataset.title
          bigGoal.addEventListener("click", () => {
            showBigGoalPage(bigGoalTitle);
          });
        });
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
        dailySystems.forEach((daily) => {
          const dailySystemBox = document.createElement("div");

          dailySystemBox.classList.add(
            "bg-dark-subtle",
            "box-radius",
            "daily-system-box"
          );

          dailySystemBox.innerHTML = `
          <h5 class="m-0 fw-normal">${daily.action}</h5>
          `;

          allDailySystems.append(dailySystemBox);
        });
      })
      .then(() => {
        const allDailySystemBox = document.querySelectorAll(".daily-system-box");
        Array.from(allDailySystemBox).forEach((dailySystem) => {
          dailySystem.addEventListener("click", () => {
            console.log(dailySystem.innerText);
          })
        });
      });
  } catch (error) {
    console.log(error);
  }
}

const completeDailySystem = (dailySystem) => {
  try {
    fetch(`/complete-daily-system`, {
      method: "POST",
      body: JSON.stringify({
        bigGoal: "",
        dailySystem: "",
        date: "",
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
          location.reload();
        }
        console.log(`Failed completing ${dailySystem} - ${date}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
}