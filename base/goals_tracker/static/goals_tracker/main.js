/*************************/
//   GLOBAL VARIABLES   //
/***********************/
const modalCenter = document.querySelector(".modal-center");
// pages
const homePage = document.querySelector("#home-page");
const bigGoalPage = document.querySelector("#big-goal-page");
// big goal form
const bigGoalModal = document.querySelector("#big-goal-modal");
const bigGoalTitle = document.querySelector("#big-goal-title");
const bigGoalDeadline = document.querySelector("#big-goal-deadline");
const bigGoalDescription = document.querySelector("#big-goal-description");
// big goals section
const allBigGoals = document.querySelector("#all-big-goals");

// checkpoint goal form
const checkpointGoalModal = document.querySelector("#checkpoint-goal-modal");

// daily system form
const dailySystemModal = document.querySelector("#daily-system-modal");

// anti goals form
const antiGoalModal = document.querySelector("#anti-goal-modal");

document.addEventListener("DOMContentLoaded", () => {
  /*************************/
  // AUTOMATIC RENDERINGS //
  /***********************/
  addGreeting(); // user greetings
  showHomePage(); // home page contents

  /*************************/
  //    CLICK LISTENER    //
  /***********************/
  window.onclick = function (event) {
    // when the user clicks anywhere outside of the modal or its child elements, close it
    if (event.target == modalCenter) {
      bigGoalModal.style.display = "none";
    }
  };
});

// PAGES
const showHomePage = () => {
  getAllBigGoals(); // get all big goals asap

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
    document.querySelector("#big-goal-deadline").min = defaultDeadlineDate();
    document.querySelector("#big-goal-deadline").value = defaultDeadlineDate();
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
const generateTimeline = (title) => {
  const timeline = document.querySelector("#timeline");

  try {
    fetch(`/big-goal/${title}/show-timeline`)
      .then((res) => {
        if (res.ok) {
          console.log("success!");
        } else {
          console.log("failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  } catch (error) {
    console.log(error);
  }

  // const days = getDaysDifference(startDate, endDate);

  // for (let i = 0; i < days; i++) {
  //   const dot = document.createElement("div");
  //   dot.classList.add("timeline-item");
  //   timeline.appendChild(dot);
  // }
};

const deleteOldGoal = (goal) => {
  try {
    // Deadline has passed, delete old goals
    fetch("/delete-old-goal", {
      method: "DELETE",
      body: JSON.stringify({
        title: goal.title,
        description: goal.description,
        deadline: goal.deadline,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Ensure to include CSRF token
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Old Big goals deleted successfully");
          // Optionally, you can perform further actions here
        } else {
          console.error("Failed to delete old goals");
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
        console.log(bigGoals);

        bigGoals.forEach((goal) => {
          const bigGoalBox = document.createElement("div");
          const title = goal.title;

          const currentDate = new Date();
          const deadline = new Date(goal.deadline);
          const thirty_after_deadline = new Date(deadline);
          thirty_after_deadline.setDate(deadline.getDate() + 30);
          const daysLeft = Math.ceil(
            (thirty_after_deadline - currentDate) / (1000 * 60 * 60 * 24)
          );

          bigGoalBox.classList.add(
            "bg-success-subtle",
            "box-radius",
            "big-goal-box"
          );

          bigGoalBox.dataset.title = title.split(" ").join("-");

          bigGoalBox.innerHTML = `
          <h4>${goal.title}</h4>
          <p>${goal.description}</p>
          <p class="m-0">Deadline: 
            <span class="${currentDate >= deadline ? "text-danger" : ""}">
            ${goal.deadline}
          </span>
          </p>
          <p class="m-0">
          ${
            currentDate >= deadline
              ? "This goal would be deleted in " + daysLeft + " days"
              : ""
          }
          </p>
          `;

          allBigGoals.append(bigGoalBox);

          if (currentDate >= thirty_after_deadline) {
            deleteOldGoal(goal);
          }
        });
      })
      .then(() => {
        const bigGoalBox = document.querySelectorAll(".big-goal-box");
        Array.from(bigGoalBox).forEach((bigGoal) => {
          const bigGoalTitle = bigGoal.dataset.title;
          bigGoal.addEventListener("click", () => {
            showBigGoalPage(bigGoalTitle);
          });
        });
      });
  } catch (error) {
    console.log(error);
  }
};
