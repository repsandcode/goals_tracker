/*************************/
//   GLOBAL VARIABLES   //
/***********************/
const modalCenter = document.querySelector(".modal-center");
// big goal form
const bigGoalModal = document.querySelector("#big-goal-modal");
const bigGoalTitle = document.querySelector("#big-goal-title");
const bigGoalDeadline = document.querySelector("#big-goal-deadline");
const bigGoalDescription = document.querySelector("#big-goal-description");
// big goals section
const allBigGoals = document.querySelector("#all-big-goals");

document.addEventListener("DOMContentLoaded", () => {
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
  // big goal modal
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
    document.querySelector("#big-goal-form").onsubmit = createBigGoal;
  };
  const hideBigGoalModal = () => {
    bigGoalModal.style.display = "none";
  };

  fetchAllBigGoals(); // get all big goals asap
});

// fetch apis
const fetchAllBigGoals = () => {
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

          bigGoalBox.classList.add("shadow", "p-4", "mb-5", "bg-body-tertiary");

          bigGoalBox.innerHTML = `
          <h1>${goal.title}</h1>
          <p>${goal.description}</p>
          <p>${goal.deadline}</p>
          `;

          allBigGoals.append(bigGoalBox);
        });
      });
  } catch (error) {
    console.log(error);
  }
};
