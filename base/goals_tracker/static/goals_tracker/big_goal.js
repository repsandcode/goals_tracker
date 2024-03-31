// daily system form
const dailySystemModal = document.querySelector("#daily-system-modal");
// checkpoint goal form
const checkpointGoalModal = document.querySelector("#checkpoint-goal-modal");
// anti goals form
const antiGoalModal = document.querySelector("#anti-goal-modal");

document
  .querySelector("#open-daily-system-modal")
  .addEventListener("click", () => showDailySystemModal());
document
  .querySelector("#close-daily-system-modal")
  .addEventListener("click", () => hideDailySystemModal());

const showDailySystemModal = () => {
  dailySystemModal.style.display = "block";
  document.querySelector("#daily-system-form").onsubmit = createDailySystem;
};
const hideDailySystemModal = () => {
  dailySystemModal.style.display = "none";
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
