const fetchAllBigGoals = () => {
  try {
    fetch("big-goals")
      .then((res) => {
        if (res.ok) {
          console.log("success! retrieved all big goals");
        } else {
          console.log("failed to retrieve all big goals");
        }
        return res.json();
      })
      .then((goals) => {});
  } catch (error) {}
};
