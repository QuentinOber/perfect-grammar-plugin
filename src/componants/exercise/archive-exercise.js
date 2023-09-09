import DoneButton from "../done-button";
import SavedButton from "../save-button";
import SavedPostManager from "../saved-post-manager";
import DonePostManager from "../done-post-manager";
import PopupLoginRedirect from "../popup-login-redirect";
import Loader from "../loader";

class ExercisesArchive {
  //INITIATE AND DEFINE ARCHIVE
  constructor() {
    this.resultsContainer = document.querySelector("#exercises-archive-container");
    this.progressBar = document.getElementById("progress-bar");
    this.progressPercent = document.getElementById("progress-percent");

    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.attachEventListeners();
    this.savedPostManager = new SavedPostManager();
    this.donePostManager = new DonePostManager();
    this.fetchAndDisplayExerciseData(); // Fetch and display initial data
    this.loginPopup = new PopupLoginRedirect();
  }

  //ALL EVENTS

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.resultsContainer.addEventListener("click", (event) => {
      const checkboxEvent = event.target.closest(".validate-checkbox");
      if (checkboxEvent) {
        const exerciseItem = checkboxEvent.closest(".exercise-item");
        const titleEvent = exerciseItem.querySelector(".title-text");
        const boxSelected = checkboxEvent.closest(".exercise-item");
        this.handleClickDone(checkboxEvent, titleEvent, boxSelected);
      }
      const saveEvent = event.target.closest(".label-pf__checkbox");
      if (saveEvent) {
        const boxSelected = saveEvent.closest(".exercise-item");
        const titleEvent = boxSelected.querySelector(".title-text");

        this.handleClickSaved(saveEvent, titleEvent, boxSelected);
      }
    });
    // Level options
    this.selectedLevel = null;
    this.levelFilter = document.querySelector("#level-options");
    this.levelFilter.addEventListener("change", (e) => {
      this.selectedLevel = e.target.value;
      this.handleFilterChange();
    });

    // Search event
    this.searchInput = document.querySelector("#searchInput");
    this.clearSearchButton = document.querySelector("#clearSearch");

    this.searchInput.addEventListener("input", (event) => {
      if (this.searchInput.value !== "") {
        this.clearSearchButton.classList.remove("hide");
      } else {
        this.clearSearchButton.classList.add("hide");
      }
      this.searchTerm = event.target.value.toLowerCase();
      this.handleSearch();
    });
    this.clearSearchButton.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchTerm = "";
      this.clearSearchButton.classList.add("hide");
      this.searchInput.focus();
      this.handleFilterChange();
    });

    // Only saved event
    this.isOnlySaved = false;
    this.isOnlySavedCheckbox = document.querySelector("#only-saved");
    this.isOnlySavedCheckbox.addEventListener("change", () => {
      if (!user_status.logged_in) {
        this.loginPopup.show();
        return;
      }
      if (this.isOnlySavedCheckbox.checked) {
        this.isOnlySaved = this.isOnlySavedCheckbox.checked;
        this.handleFilterChange();
      } else {
        this.isOnlySaved = false;
        this.handleFilterChange();
      }
    });

    // Side bar filter
    this.selectedCategories = [];
    this.sideBarArchive = document.querySelectorAll("#side-bar-archive label").forEach((label) => {
      label.addEventListener("click", (e) => {
        const selectedCategory = e.currentTarget.id.toLowerCase();

        if (e.target.checked) {
          if (!this.selectedCategories.includes(selectedCategory)) {
            this.selectedCategories.push(selectedCategory);
          }
        } else {
          const index = this.selectedCategories.indexOf(selectedCategory);
          if (index > -1) {
            this.selectedCategories.splice(index, 1);
          }
        }

        this.handleFilterChange();
      });
    });
  }

  handleClickDone(doneButtonData, titleEvent, boxSelected) {
    const postItemID = doneButtonData.id.replace("_checkbox", "");
    const title = titleEvent.innerText;

    // added Number() looks like ID is not a number?
    const exerciseToUpdate = this.exerciseData.find((exercise) => exercise.postId === Number(postItemID));

    if (doneButtonData.checked) {
      this.donePostManager.createDonePost(postItemID, doneButtonData, title);
      titleEvent.classList.add("strikethrough");
      boxSelected.classList.add("box-reduced-opacity");
      exerciseToUpdate.isDone = true;
    } else {
      this.donePostManager.deleteDonePost(doneButtonData.getAttribute("doneId"), doneButtonData);
      titleEvent.classList.remove("strikethrough");
      boxSelected.classList.remove("box-reduced-opacity");
      exerciseToUpdate.isDone = false;
    }
    if (this.progressBar) {
      this.handleProgressBar();
    }
  }

  handleClickSaved(saveButtonData, titleEvent, boxSelected) {
    const title = titleEvent.innerText;
    const postItemID = saveButtonData.id.replace("_save", "");
    if (saveButtonData.checked) {
      this.savedPostManager.createSavedPost(postItemID, saveButtonData, title);
      boxSelected.classList.add("box-highlight");
    } else {
      this.savedPostManager.deleteSavedPost(saveButtonData.getAttribute("saved-id"), saveButtonData);
      boxSelected.classList.remove("box-highlight");
    }
  }

  //ALL METHODS
  displayLoader() {
    this.resultsContainer.innerHTML = Loader.getLoader();
  }

  async fetchAndDisplayExerciseData() {
    await this.fetchExerciseData();
    this.displayExerciseData(this.exerciseData);
    this.handleFilterChange(this.exerciseData);
  }

  async fetchExerciseData() {
    this.displayLoader();

    try {
      if (this.pageLanguage == "pt") this.pageLanguage = "";
      const response = await fetch(`/wp-json/perfect-grammar/v1/exercise/archive?lang=` + this.pageLanguage, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpApiSettings.nonce,
        },
      });
      if (!response.ok) throw new Error("Exercise data not found");
      this.exerciseData = await response.json();
    } catch (error) {
      throw error;
    }
  }

  // MAIN FILTER
  // Handle filter change events
  async handleFilterChange() {
    await this.fetchExerciseData();

    const filteredData = this.getFilteredExerciseData(
      this.selectedLevel,
      this.searchTerm,
      this.isOnlySaved,
      this.selectedCategories
    );
    if (this.progressBar) {
      this.handleProgressBar();
    }
    this.displayExerciseData(filteredData);
  }

  getFilteredExerciseData(levelSelected = null, searchTerm = "", isOnlySaved, categorySelected = []) {
    let filteredData = this.exerciseData;
    if (levelSelected) {
      filteredData = filteredData.filter((exercise) => exercise.level.includes(levelSelected));
    }
    if (searchTerm) {
      filteredData = filteredData.filter((exercise) => exercise.title.toLowerCase().includes(searchTerm));
    }
    if (isOnlySaved) {
      filteredData = filteredData.filter((exercise) => exercise.isSaved);
    }

    if (categorySelected.length) {
      filteredData = filteredData.filter((exercise) => {
        return exercise.category.some((category) => categorySelected.includes(category.toLowerCase()));
      });
    }
    return filteredData;
  }

  handleSearch() {
    let filteredData = this.exerciseData;
    if (this.searchTerm) {
      filteredData = filteredData.filter((exercise) => exercise.title.toLowerCase().includes(this.searchTerm));
    }

    this.displayExerciseData(filteredData);
  }

  handleProgressBar() {
    if (this.exerciseData) {
      const totalExercices = this.exerciseData.length;
      const doneExercices = this.exerciseData.reduce((acc, exercise) => {
        return exercise.isDone === true ? acc + 1 : acc;
      }, 0);
      this.progressPercent.innerHTML = `${doneExercices} / ${totalExercices}`;
      const percentDone = (doneExercices / totalExercices) * 100;
      this.progressBar.style.setProperty("--progress", `${percentDone}%`);
    }
  }

  // main display of data
  displayExerciseData(exerciseData) {
    if (!exerciseData || exerciseData.length === 0) {
      this.resultsContainer.innerHTML = "<p>Aucun exercices trouvés</p>";
      return;
    }
    this.resultsContainer.innerHTML = exerciseData
      .map(
        ({ title, level, permalink, postId, isDone, doneId, isSaved, savedId }) => `
            <a href="${permalink}"><div class="exercise-item ${isSaved ? "box-highlight" : ""} ${
              isDone ? "box-reduced-opacity" : ""
            }">
            <div class="exercise-item__level">${level.join("/")}</div>
            <div class="exercise-item__title">
        <div id="title" class="title-text ${isDone ? "strikethrough" : ""}">${title}</div></div>
  
        ${SavedButton.getSavedButtonHTML(postId, isSaved, savedId)}
        ${DoneButton.getDoneButtonHTML(postId, isDone, doneId)}
         </div></a>`
      )
      .join("");
  }
}

export default ExercisesArchive;
