// daily system section
const dailySystemModal = document.querySelector("#daily-system-modal");
const dailySystemModalContent = document.querySelector("#daily-system-modal-content");
const dailySystemForm = document.querySelector("#daily-system-form");
const dailySystemTitle = document.querySelector("#daily-system-title");
// checkpoint goal section
const checkpointGoalModal = document.querySelector("#checkpoint-goal-modal");
const checkpointGoalModalContent = document.querySelector("#checkpoint-goal-modal-content");
const checkpointGoalForm = document.querySelector("#checkpoint-goal-form");
const checkpointGoalTitle = document.querySelector("#checkpoint-goal-title");
const checkpointGoalDate = document.querySelector("#checkpoint-goal-date");
const checkpointGoalDescription = document.querySelector("#checkpoint-goal-description");
// anti goals section
const antiGoalModal = document.querySelector("#anti-goal-modal");
const antiGoalForm = document.querySelector("#anti-goal-form");
const antiGoalDescription = document.querySelector("#anti-goal-description");
// hidden values
const uneditedTitle = document.querySelector("#no-edit-title-hidden");
const title = document.querySelector("#title-hidden");
const description = document.querySelector("#description-hidden");
const startDate = document.querySelector("#start-hidden");
const deadlineDate = document.querySelector("#deadline-hidden");
// timeline
const timeline = document.querySelector("#timeline");
const monthYear = document.querySelector("#month-year");

const allCompletedDailySystems = getAllCompletedDailySystems();
console.log(allCompletedDailySystems)


// COMPLETING A DAILY ACTION
const allDailySystemBox = document.querySelectorAll(".daily-system-box");
Array.from(allDailySystemBox).forEach((dailySystem) => {
  dailySystem.addEventListener("click", () => {
    const bigGoal = title.value;
    const action = dailySystem.innerText;
    const date = dailySystem.parentElement.parentElement.dataset.date || getTodaysDate();

    if (dailySystem.classList.contains("text-decoration-line-through")) {
      dailySystem.classList.remove("text-decoration-line-through");
      markIncompleteDailySystem(bigGoal, action, date);
    } else {
      dailySystem.classList.add("text-decoration-line-through");
      markCompleteDailySystem(bigGoal, action, date);
    }
  })
});


// TIMELINE
const showTodaysTimelineItem = (currentDate) => {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const getTodaysTimeline = Array.from(timelineItems).filter(item => item.dataset.date == currentDate);

  const currentDateDiv = getTodaysTimeline[0];
  const timelineHeadDiv = currentDateDiv.children[0];
  const day = timelineHeadDiv.children[1];
  
  currentDateDiv.classList.add("timeline-item-today");
  timelineHeadDiv.classList.add("timeline-item--head-today");
  day.classList.add("timeline-item--head-day-on");
  
  // Scroll the timeline container to the current date div
  if (currentDateDiv) {
      // Calculate the scrollLeft position to center the current date div
      const scrollLeftPos = currentDateDiv.offsetLeft - (window.innerWidth / 2) + (currentDateDiv.offsetWidth / 2);
      
      // Scroll the timeline container
      timeline.scrollLeft = scrollLeftPos;
  }
}
showTodaysTimelineItem(getTodaysDate());



// DELETE BIG GOAL
document.querySelector("#delete-now-btn").addEventListener("click", () => {
  const big_goal = {
    "title": title.value,
    "description": description.value,
    "start": formatDate(startDate.value),
    "deadline": formatDate(deadlineDate.value),
  }
  
  deleteOldGoal(big_goal);
})


// DAILY SYSTEM MODAL
document
  .querySelector("#open-daily-system-modal")
  .addEventListener("click", () => showDailySystemModal());
document
  .querySelector("#close-daily-system-modal")
  .addEventListener("click", () => hideDailySystemModal());

const showDailySystemModal = () => {
  dailySystemModal.style.display = "block";
  dailySystemForm.onsubmit = createDailySystem;
};
const hideDailySystemModal = () => {
  dailySystemModal.style.display = "none";
};
const createDailySystem = (event) => {
  event.preventDefault();

  fetch(`/big-goal/${uneditedTitle.value}/create-daily-system`, {
    method: "POST",
    body: JSON.stringify({
      bigGoal: title.value,
      action: dailySystemTitle.value,
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
        console.log("Daily System created succesfully");
        location.reload();
      }
      console.log("Failed creating Daily System");
    })
    .catch((error) => {
      // Handle network errors or exceptions here
      console.error("Error:", error);
    });
};



// CHECKPOINT GOAL MODAL
document
  .querySelector("#open-checkpoint-goal-modal")
  .addEventListener("click", () => showCheckpointGoalModal());
document
  .querySelector("#close-checkpoint-goal-modal")
  .addEventListener("click", () => hideCheckpointGoalModal());

const showCheckpointGoalModal = () => {
  checkpointGoalModal.style.display = "block";
  // modify min and max for checkpoint goal date
  checkpointGoalDate.min = formatDate(startDate.value);
  checkpointGoalDate.max = formatDate(deadlineDate.value);

  checkpointGoalForm.onsubmit = createCheckpointGoal;
};
const hideCheckpointGoalModal = () => {
  checkpointGoalModal.style.display = "none";
};
const createCheckpointGoal = (event) => {
  event.preventDefault();

  fetch(`/big-goal/${uneditedTitle.value}/create-checkpoint-goal`, {
    method: "POST",
    body: JSON.stringify({
      bigGoal: title.value,
      checkpointGoal: checkpointGoalTitle.value,
      description: checkpointGoalDescription.value,
      date: checkpointGoalDate.value,
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
        console.log("Checkpoint Goal created succesfully");
        location.reload();
      }
      console.log("Failed creating Checkpoint Goal");
    })
    .catch((error) => {
      // Handle network errors or exceptions here
      console.error("Error:", error);
    });
};


// ANTI GOAL MODAL
document
  .querySelector("#open-anti-goal-modal")
  .addEventListener("click", () => showAntiGoalModal());
document
  .querySelector("#close-anti-goal-modal")
  .addEventListener("click", () => hideAntiGoalModal());

const showAntiGoalModal = () => {
  antiGoalModal.style.display = "block";
  document.querySelector("#anti-goal-form").onsubmit = createAntiGoal;
};
const hideAntiGoalModal = () => {
  antiGoalModal.style.display = "none";
};
const createAntiGoal = (event) => {
  event.preventDefault();

  fetch(`/big-goal/${uneditedTitle.value}/create-anti-goal`, {
    method: "POST",
    body: JSON.stringify({
      bigGoal: title.value,
      description: antiGoalDescription.value,
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
        console.log("Anti Goal created succesfully");
        location.reload();
      }
      console.log("Failed creating Anti Goal");
    })
    .catch((error) => {
      // Handle network errors or exceptions here
      console.error("Error:", error);
    });
};
