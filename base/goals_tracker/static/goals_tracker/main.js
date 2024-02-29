document.addEventListener("DOMContentLoaded", () => {
  /*************************/
  //   GLOBAL VARIABLES   //
  /***********************/
  const modalCenter = document.querySelector(".modal-center");
  const bigGoalModal = document.querySelector("#big-goal-modal");
  const bigGoalDeadline = document.querySelector("#big-goal-deadline");

  /*************************/
  // AUTOMATIC RENDERINGS //
  /***********************/
  addGreeting(); // user greetings
  // default deadline dates
  bigGoalDeadline.value = defaultDeadlineDate();
  bigGoalDeadline.min = defaultDeadlineDate();

  /*************************/
  //    EVENT LISTENERS   //
  /***********************/
  document
    .querySelector("#open-big-goal-modal")
    .addEventListener("click", () => showBigGoalModal());
  document
    .querySelector("#close-big-goal-modal")
    .addEventListener("click", () => hideBigGoalModal());

  /*************************/
  //    CLICK LISTENER    //
  /***********************/
  window.onclick = function (event) {
    // when the user clicks anywhere outside of the modal or its child elements, close it
    if (event.target == modalCenter) {
      hideBigGoalModal();
    }
  };

  /*************************/
  //  FUNCTIONS TO CALL   //
  /***********************/
  const showBigGoalModal = () => {
    bigGoalModal.style.display = "block";
  };
  const hideBigGoalModal = () => {
    bigGoalModal.style.display = "none";
  };
});
