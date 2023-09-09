import "../css/styles.scss";

import ExercisesArchive from "./componants/exercise/archive-exercise.js";
import SingleExercise from "./componants/exercise/single-exercise.js";
import ClassActivityArchive from "./componants/class-activity/archive-class-activity.js";
import SingleActivity from "./componants/class-activity/single-class-activity.js";

// Calls the ExecisesArchive if there is a #exercises-archive-container, is that GOOD ? or better to enqueue a file with php conditions?
document.addEventListener("DOMContentLoaded", () => {
  const archiveExercisesContainer = document.querySelector(
    "#exercises-archive-container"
  );
  if (archiveExercisesContainer) {
    const exercisesArchive = new ExercisesArchive();
  }
});

// Same for SingleExercise
document.addEventListener("DOMContentLoaded", () => {
  const exerciseContainer = document.getElementById("exercise-container");
  if (exerciseContainer) {
    const singleExercise = new SingleExercise();
  }
});

// Same for ClassActivityArchive
document.addEventListener("DOMContentLoaded", () => {
  const archiveActivityContainer = document.querySelector(
    "#class-activity-archive-container"
  );
  if (archiveActivityContainer) {
    const classActivityArchive = new ClassActivityArchive();
  }
});

// Same for SingleActivity
document.addEventListener("DOMContentLoaded", () => {
  const activityContainer = document.getElementById("activity-container");
  if (activityContainer) {
    const singleActivity = new SingleActivity();
  }
});
