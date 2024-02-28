document.addEventListener("DOMContentLoaded", () => {
  // invoke greeting
  addGreeting();

  document
    .querySelector("#show-big-goal-form")
    .addEventListener("click", () => showBigGoalForm());
});

const showBigGoalForm = () => {
  console.log("clicked");
  document.querySelector("#big-goal-form").classList.toggle("d-none");
};
