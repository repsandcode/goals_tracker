// daily system form
const dailySystemModal = document.querySelector("#daily-system-modal");
const dailySystemModalContent = document.querySelector("#daily-system-modal-content");
const dailySystemForm = document.querySelector("#daily-system-form");
const dailySystemTitle = document.querySelector("#daily-system-title");
// checkpoint goal form
const checkpointGoalModal = document.querySelector("#checkpoint-goal-modal");
const checkpointGoalModalContent = document.querySelector("#checkpoint-goal-modal-content");
const checkpointGoalForm = document.querySelector("#checkpoint-goal-form");
const checkpointGoalTitle = document.querySelector("#checkpoint-goal-title");
const checkpointGoalDate = document.querySelector("#checkpoint-goal-date");
const checkpointGoalDescription = document.querySelector("#checkpoint-goal-description");
// anti goals form
const antiGoalModal = document.querySelector("#anti-goal-modal");

// hidden values
const uneditedTitle = document.querySelector("#no-edit-title-hidden").value;
const title = document.querySelector("#title-hidden").value;
const startDate = document.querySelector("#start-hidden").value;
const deadlineDate = document.querySelector("#deadline-hidden").value;




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

  fetch(`/big-goal/${uneditedTitle}/create-daily-system`, {
    method: "POST",
    body: JSON.stringify({
      bigGoal: title,
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
  checkpointGoalDate.min = formatDate(startDate);
  checkpointGoalDate.max = formatDate(deadlineDate);

  checkpointGoalForm.onsubmit = createCheckpointGoal;
};
const hideCheckpointGoalModal = () => {
  checkpointGoalModal.style.display = "none";
};
const createCheckpointGoal = (event) => {
  event.preventDefault();

  fetch(`/big-goal/${uneditedTitle}/create-checkpoint-goal`, {
    method: "POST",
    body: JSON.stringify({
      bigGoal: title,
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





const showAntiGoalModal = () => {
  antiGoalModal.style.display = "block";
  document.querySelector("#anti-goal-form").onsubmit = createAntiGoal;
};
const hideAntiGoalModal = () => {
  antiGoalModal.style.display = "none";
};
