// daily system section
const dailySystemModal = document.querySelector("#daily-system-modal");
const dailySystemModalContent = document.querySelector("#daily-system-modal-content");
const dailySystemForm = document.querySelector("#daily-system-form");
const dailySystemTitle = document.querySelector("#daily-system-title");
const dailySystemMsg = document.querySelector("#daily-system-message");
// hidden values
const uneditedTitle = document.querySelector("#no-edit-title-hidden");
const title = document.querySelector("#title-hidden");
const description = document.querySelector("#description-hidden");
const startDate = document.querySelector("#start-hidden");
const deadlineDate = document.querySelector("#deadline-hidden");
const bgDailySystems = document.querySelector("#bg-daily-systems")?.value.split(",");
// timeline
const timeline = document.querySelector("#timeline");
const monthYear = document.querySelector("#month-year");
// delete big goal 
const deleteBigGoalModal = document.querySelector("#delete-big-goal-modal");
// delete daily system
const deleteDailySystemModal = document.querySelector("delete-daily-system-modal");


// DELETING A DAILY ACTION
const dailySystemDeleteIcon = document.querySelectorAll(".daily-system-box--delete-icon");
Array.from(dailySystemDeleteIcon).forEach((deleteIcon) => {
  deleteIcon.addEventListener("click", () => {
    const dailySystemText = deleteIcon.previousElementSibling.innerText;
    const deleteText = 
    `Are you sure you want to delete this Daily System?
"${dailySystemText}"`;
    console.log(deleteIcon, dailySystemText);
    if (confirm(deleteText)) {
      console.log(`Deleting "${dailySystemText}" ...`);
      deleteDailySystem(title, dailySystemText);
    } else {
      console.log(`Retain "${dailySystemText}"...`);
    }
  })
});
const deleteDailySystem = (bigGoal, dailySystem) => {
  try {
    fetch("/delete-daily-system", {
      method: "DELETE",
      body: JSON.stringify({
        big_goal: bigGoal,
        action: dailySystem,
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Ensure to include CSRF token
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(`${dailySystem} of ${bigGoal} ... deleted successfully`);
          window.location.href = "/";
        } else {
          console.error(`Failed to delete ... ${dailySystem} of ${bigGoal}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
  }
}


// SHOW CURRENT MONTH
if (monthYear) {
  monthYear.classList.add("mb-3");
  monthYear.innerHTML = `<h1>${getCurrentMonthAndYear()[0]} <span class="fw-normal">${getCurrentMonthAndYear()[1]}</span></h1>`
}


// COMPLETING A DAILY ACTION
const allDailySystemBox = document.querySelectorAll(".daily-system-box");
Array.from(allDailySystemBox).forEach((dailySystem) => {
  dailySystem.addEventListener("click", () => {
    const checkBox = dailySystem.firstElementChild.firstChild;
    const dailyAction = dailySystem.lastElementChild;
    const actionText = dailyAction.innerText;
    const bigGoal = title.value;

    const date = dailySystem.parentElement.parentElement.dataset.date;
    const dateToday = getTodayHyphened();
    
    getAllCompletedDailySystems()
      .then((completedSystems) => {
        console.log(completedSystems);
        
        // Check if the date is today
        if (date !== dateToday) {
          alert("Completing goals that are not today is disabled. Focus on today first.");
          return;
        }

        // Check if completedSystems exists and has the property for the given date
        if (completedSystems && completedSystems.hasOwnProperty(date)) {
          // Check if the action is already marked as completed
          if (completedSystems[date][bigGoal].includes(actionText)) {
            checkBox.classList.remove("daily-system-box--check");
            dailyAction.classList.remove("daily-system-box--check");
            
            checkBox.classList.remove("bi-check-circle");
            checkBox.classList.add("bi-circle"); 
            markIncompleteDailySystem(bigGoal, actionText, date);
          } else {
            checkBox.classList.add("daily-system-box--check");
            dailyAction.classList.add("daily-system-box--check");

            checkBox.classList.remove("bi-circle");
            checkBox.classList.add("bi-check-circle"); 
            markCompleteDailySystem(bigGoal, actionText, date);
          }
        } else {
          checkBox.classList.add("daily-system-box--check");
          dailyAction.classList.add("daily-system-box--check");

          checkBox.classList.remove("bi-circle");
          checkBox.classList.add("bi-check-circle"); 
          markCompleteDailySystem(bigGoal, actionText, date);
        }
      })
      .catch((error) => {
        console.error("Error fetching completed daily systems:", error);
      });
  })
});


// TIMELINE
const showTodaysTimelineItem = (currentDate) => {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const getTodaysTimeline = Array.from(timelineItems).filter(item => item.dataset.date == currentDate);

  const currentDateDiv = getTodaysTimeline[0];
  
  // Scroll the timeline container to the current date div
  if (currentDateDiv) {
    const timelineHeadDiv = currentDateDiv.children[0];
    const timelineBodyDiv = currentDateDiv.children[1];
    const day = timelineHeadDiv.children[1];
    
    currentDateDiv.classList.add("timeline-item--today");
    timelineHeadDiv.classList.add("timeline-item--head-today");
    timelineBodyDiv.classList.add("timeline-item--body-today");
    day.classList.add("timeline-item--head-day-on");

      // Calculate the scrollLeft position to center the current date div
      const scrollLeftPos = currentDateDiv.offsetLeft - (window.innerWidth / 2.5) + (currentDateDiv.offsetWidth / 2);
      
      // Scroll the timeline container
      timeline.scrollLeft = scrollLeftPos;
  }
}
showTodaysTimelineItem(getTodayHyphened());


// DELETE BIG GOAL
document
  .querySelector("#open-delete-big-goal-modal")
  ?.addEventListener("click", () => showDeleteBigGoalModal());
const showDeleteBigGoalModal = () => {
  deleteBigGoalModal.style.display = "block";

  document.querySelector("#close-delete-big-goal-modal").addEventListener("click", () => hideDeleteBigGoalModal());

  document.querySelector("#delete-now-btn").addEventListener("click", () => {
    const big_goal = {
      "title": title.value,
      "description": description.value,
      "start": formatDate(startDate.value),
      "deadline": formatDate(deadlineDate.value),
    }
    
    deleteOldGoal(big_goal);
  });
};
const hideDeleteBigGoalModal = () => {
  deleteBigGoalModal.style.display = "none";
}


// DAILY SYSTEM MODAL
document
  .querySelector("#open-daily-system-modal")
  ?.addEventListener("click", () => showDailySystemModal());
document
  .querySelector("#close-daily-system-modal")
  ?.addEventListener("click", () => hideDailySystemModal());

const showDailySystemModal = () => {
  dailySystemModal.style.display = "block";
  dailySystemForm.onsubmit = createDailySystem;
};
const hideDailySystemModal = () => {
  dailySystemModal.style.display = "none";
};
const createDailySystem = (event) => {
  event.preventDefault();

  if (bgDailySystems.includes(dailySystemTitle.value)) {
    dailySystemMsg.innerText = "You already have this Daily System."
  } else {
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
  }

};
