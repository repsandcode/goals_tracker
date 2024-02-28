document.addEventListener("DOMContentLoaded", () => {
  // show welcome banner
  addGreeting();

  // modals
  const modalCenter = document.querySelector(".modal-center");
  const bigGoalModal = document.querySelector("#big-goal-modal");

  // function to show the modal
  const showBigGoalModal = () => {
    console.log("clicked");
    bigGoalModal.style.display = "block";
  };

  // function to hide the modal
  const hideBigGoalModal = () => {
    bigGoalModal.style.display = "none";
  };

  // attach event listener to the button
  document
    .querySelector("#open-big-goal-form")
    .addEventListener("click", () => showBigGoalModal());

  // attach event listener to the close button
  document
    .querySelector(".close")
    .addEventListener("click", () => hideBigGoalModal());

  // any clicks
  window.onclick = function (event) {
    // when the user clicks anywhere outside of the modal or its child elements, close it
    if (event.target == modalCenter) {
      console.log("click");
      hideBigGoalModal();
    }
  };
});
