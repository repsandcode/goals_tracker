// daily system form
const dailySystemModal = document.querySelector("#daily-system-modal");
const dailySystemForm = document.querySelector("#daily-system-form");
const dailySystemTitle = document.querySelector("#daily-system-title");
// checkpoint goal form
const checkpointGoalModal = document.querySelector("#checkpoint-goal-modal");
// anti goals form
const antiGoalModal = document.querySelector("#anti-goal-modal");

// titles
const uneditedTitle = document.querySelector("#no-edit-title-hidden");
const title = document.querySelector("#title");

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

  fetch(`${uneditedTitle}/create-daily-system`, {
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

const showCheckpointGoalModal = () => {
  checkpointGoalModal.style.display = "block";
  document.querySelector("#checkpoint-goal-form").onsubmit =
    createCheckpointGoal;
};
const hideCheckpointGoalModal = () => {
  checkpointGoalModal.style.display = "none";
};

const showAntiGoalModal = () => {
  antiGoalModal.style.display = "block";
  document.querySelector("#anti-goal-form").onsubmit = createAntiGoal;
};
const hideAntiGoalModal = () => {
  antiGoalModal.style.display = "none";
};
