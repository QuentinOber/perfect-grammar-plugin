import SavedButton from "../save-button";
import SavedPostManager from "../saved-post-manager";
import ShareButton from "../share-link";

class SingleActivity {
  constructor() {
    this.activityContainer = document.getElementById("activity-container");
    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.randomButton = document.getElementById("random-activity-button");
    this.activityContainerSecond = document.getElementById("activity-container-second");
    this.shareButton = new ShareButton();

    this.attachEventListeners();
    // Get the activity ID from the data attribute on the container
    this.activityId = this.activityContainer.dataset.activityId;
    this.fetchExerciseData().then(this.displayExerciseData.bind(this));
    this.savedPostManager = new SavedPostManager();
  }

  // ALL EVENTS HEREEE

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.activityContainer.addEventListener("click", (event) => {
      const saveEvent = event.target.closest(".label-pf__checkbox");
      if (saveEvent) {
        this.handleClickSaved(saveEvent);
      }
    });

    this.randomButton.addEventListener("click", () => {
      if (this.pageLanguage == "pt") this.pageLanguage = "";

      window.location.href = "/wp-json/perfect-grammar/v1/activity/random?lang=" + this.pageLanguage;
    });
  }

  handleClickSaved(saveButtonData) {
    const postItemID = saveButtonData.id.replace("_save", "");
    const titleMetaTag = document.querySelector('meta[name="titleRaw"]');
    const title = titleMetaTag ? "(Activity) " + titleMetaTag.getAttribute("content") : postItemID;

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
      const response = await fetch(`/wp-json/perfect-grammar/v1/activity/${this.activityId}`, {
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
      console.error("Error fetching activity data:", error.message);
      return null;
    }
  }

  displayExerciseData(activityData) {
    if (!activityData) {
      this.activityContainer.innerHTML = "<p>Exercise not found</p>";
      return;
    }

    const { title, category, tags, level, estimatedTime, postId, isSaved, savedId, instructions } = activityData;
    this.activityContainer.innerHTML = `
       
        <div class="title-banner hide-large">
        <h1 class="main-title-large">${title}</h1>
        </div>

        <div class="top-activity">
        <div class="level-activity">${level.join("/")}</div>
        
        <div class="save-done-button">
        ${SavedButton.getSavedButtonHTML(postId, isSaved, savedId)} 
        </div>
        </div>
        <div class="title-banner hide-mobile">
        <h1 class="main-title-large ">${title}</h1>
        </div>
  
        <div class="activity-instructions">
        <h2> Instruction professeurs </h2>
        ${instructions}</div>

        <div class="activity-meta"> 
        <div class="estimated-time"><span class="dashicons dashicons-clock"></span> ${estimatedTime} minutes</div>
        <div class="category">${category}</div>
        <div class="copy-link">${this.shareButton}</div>
        </div>



         <div class="divider div-transparent div-dot"></div>
          
      `;
    this.activityContainerSecond.innerHTML = `
       
         
      <ul class="grid-tags">${tags.map((tag) => `<p class="tag-item">${tag}</p>`).join("")}</ul>
        <div class="divider div-transparent div-dot"></div>

        <div class="actions-footer">
        <div class="copy-link">${this.shareButton}</div>

       <div class="">
        ${SavedButton.getSavedButtonHTML(postId, isSaved, savedId)} 
      </div>
        
        
       </div>
       </div>
      `;
  }
}

export default SingleActivity;
