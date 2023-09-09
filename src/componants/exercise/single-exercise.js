import DoneButton from "../done-button";
import SavedButton from "../save-button";
import SavedPostManager from "../saved-post-manager";
import DonePostManager from "../done-post-manager";
import ShareButton from "../share-link";

class SingleExercise {
  constructor() {
    this.exerciseContainer = document.getElementById("exercise-container");
    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.exerciseContainerSecond = document.getElementById("exercise-container-second");
    this.randomButton = document.getElementById("random-exercise-button");

    this.attachEventListeners();
    // Get the exercise ID from the data attribute on the container
    this.exerciseId = this.exerciseContainer.dataset.exerciseId;
    this.fetchExerciseData().then(this.displayExerciseData.bind(this));
    this.savedPostManager = new SavedPostManager();
    this.donePostManager = new DonePostManager();
  }

  // ALL EVENTS HEREEE

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.exerciseContainer.addEventListener("click", (event) => {
      const checkboxEvent = event.target.closest(".validate-checkbox");
      if (checkboxEvent) {
        this.handleClickDone(checkboxEvent);
      }
      const saveEvent = event.target.closest(".label-pf__checkbox");
      if (saveEvent) {
        this.handleClickSaved(saveEvent);
      }
    });

    this.randomButton.addEventListener("click", () => {
      if (this.pageLanguage == "pt") this.pageLanguage = "";

      window.location.href = "/wp-json/perfect-grammar/v1/exercise/random?lang=" + this.pageLanguage;
    });
  }

  handleClickDone(doneButtonData) {
    const postItemID = doneButtonData.id.replace("_checkbox", "");
    const titleMetaTag = document.querySelector('meta[name="titleRaw"]');
    const title = titleMetaTag ? titleMetaTag.getAttribute("content") : postItemID;

    if (doneButtonData.checked) {
      this.donePostManager.createDonePost(postItemID, doneButtonData, title);
      document.querySelector('.footer-done-button input[type="checkbox"]').checked = true;
    } else {
      this.donePostManager.deleteDonePost(doneButtonData.getAttribute("doneId"), doneButtonData);
      document.querySelector('.footer-done-button input[type="checkbox"]').checked = false;
    }
  }

  handleClickSaved(saveButtonData) {
    const postItemID = saveButtonData.id.replace("_save", "");
    const titleMetaTag = document.querySelector('meta[name="titleRaw"]');
    const title = titleMetaTag ? titleMetaTag.getAttribute("content") : postItemID;
    if (saveButtonData.checked) {
      this.savedPostManager.createSavedPost(postItemID, saveButtonData, title);
    } else {
      this.savedPostManager.deleteSavedPost(saveButtonData.getAttribute("saved-id"), saveButtonData);
    }
  }

  //ALL METHODS

  async fetchExerciseData() {
    const nonce = wpApiSettings.nonce;
    try {
      const response = await fetch(`/wp-json/perfect-grammar/v1/exercise/${this.exerciseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
      });
      if (!response.ok) {
        throw new Error("Exercise not found");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching exercise data:", error.message);
      return null;
    }
  }

  displayExerciseData(exerciseData) {
    if (!exerciseData) {
      this.exerciseContainer.innerHTML = "<p>Exercise not found</p>";
      return;
    }

    const { title, content, video, tags, level, postId, isSaved, savedId, isDone, doneId } = exerciseData;
    this.exerciseContainer.innerHTML = `
       

          
       
        <div class="title-banner hide-large">
        <h1 class="main-title-large">${title}</h1>
        </div>
        <div class="top-exercise">
        <div class="level-exercise">${level.join("/")}</div>
        
        <div class="save-done-button">
        ${SavedButton.getSavedButtonHTML(postId, isSaved, savedId)} 
        ${DoneButton.getDoneButtonHTML(postId, isDone, doneId)} 
        </div>
        </div>
        <div class="title-banner hide-mobile">
        <h1 class="main-title-large ">${title}</h1>
        </div>

          
          <div class="exercise-video">
          <div class="exercise-video__wrapper">${video}</div>  
          </div>

        
       
           <div class="exercise-explanations">
          <p class="exercise-explanations__title title-medium hide-mobile">Les points importants ❤️</p>
          <div class="key-info">${content}</div>
          </div>

          <div class="exercise-meta">
          <ul class="grid-tags">${tags.map((tag) => `<p class="tag-item">${tag}</p>`).join("")}</ul>

            </div>
            <div class="actions-footer">
      <div class="copy-link"> ${new ShareButton()}</div>

     <div class="">
      ${SavedButton.getSavedButtonHTML(postId, isSaved, savedId)} 
    </div>
    </div>

            <div class="divider div-transparent div-dot"></div>

          

      `;

    this.exerciseContainerSecond.innerHTML = `
      <div class="divider div-transparent div-dot"></div>
      

      <div class="footer-exercise">
      <p class="title-medium t-center">${isDone ? "Exercice déjà validé !" : "Valider l'exercice ?"} </p>
       <div class="footer-done-button"> ${DoneButton.getDoneButtonHTML(postId, isDone, doneId)} </div>
        </div>
        </div>
      `;
  }
}

export default SingleExercise;
