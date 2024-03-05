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

  /*************************/
  //  FUNCTIONS TO CALL   //
  /***********************/
});

// show pages
const showHomePage = () => {
  fetchAllBigGoals(); // get all big goals asap

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
    document.querySelector("#big-goal-form").onsubmit = createBigGoal;
  };
  const hideBigGoalModal = () => {
    bigGoalModal.style.display = "none";
  };
};

const showBigGoalPage = () => {
  homePage.style.display = "none";
  bigGoalPage.style.display = "block";
};

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
          const title = goal.title;

          bigGoalBox.classList.add(
            "bg-success-subtle",
            "box-radius",
            "big-goal-box"
          );

          bigGoalBox.dataset.title = title.split(" ").join("-");

          bigGoalBox.innerHTML = `
          <h4>${goal.title}</h4>
          <p>${goal.description}</p>
          <p>${goal.deadline}</p>
          `;

          allBigGoals.append(bigGoalBox);
        });
      })
      .then(() => {
        const bigGoalBox = document.querySelectorAll(".big-goal-box");
        Array.from(bigGoalBox).forEach((bigGoal) => {
          bigGoal.addEventListener("click", () => {
            showBigGoalPage();
          });
        });
      });
  } catch (error) {
    console.log(error);
  }
};
