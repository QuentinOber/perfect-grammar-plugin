import SavedButton from "../save-button";
import SavedPostManager from "../saved-post-manager";
import PopupLoginRedirect from "../popup-login-redirect";
import Loader from "../loader";

class ClassActivityArchive {
  //INITIATE AND DEFINE ARCHIVE
  constructor() {
    this.resultsContainer = document.querySelector("#class-activity-archive-container");
    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.attachEventListeners();
    this.savedPostManager = new SavedPostManager();
    this.fetchAndDisplayActivityData(); // Fetch and display initial data
    this.loginPopup = new PopupLoginRedirect();
  }

  //ALL EVENTS

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.resultsContainer.addEventListener("click", (event) => {
      const saveEvent = event.target.closest(".label-pf__checkbox");

      if (saveEvent) {
        const activityItem = saveEvent.closest(".class-activity-post-item");
        const titleEvent = activityItem.querySelector(".title-text");
        console.log(titleEvent);

        this.handleClickSaved(saveEvent, titleEvent);
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

  handleClickSaved(saveButtonData, titleEvent) {
    const postItemID = saveButtonData.id.replace("_save", "");
    const title = "(Activity) " + titleEvent.innerText;

    if (saveButtonData.checked) {
      this.savedPostManager.createSavedPost(postItemID, saveButtonData, title);
    } else {
      this.savedPostManager.deleteSavedPost(saveButtonData.getAttribute("saved-id"), saveButtonData);
    }
  }

  //ALL METHODS
  displayLoader() {
    this.resultsContainer.innerHTML = Loader.getLoader();
  }

  async fetchAndDisplayActivityData() {
    await this.fetchActivityData();
    this.displayActivityData(this.activityData);
  }

  async fetchActivityData() {
    this.displayLoader();

    let headers = {
      "Content-Type": "application/json",
    };

    if (wpApiSettings && wpApiSettings.nonce) {
      headers["X-WP-Nonce"] = wpApiSettings.nonce;
    }
    try {
      if (this.pageLanguage == "pt") this.pageLanguage = "";
      const response = await fetch(`/wp-json/perfect-grammar/v1/activity/archive?lang=` + this.pageLanguage, {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) throw new Error("Activity data not found");
      this.activityData = await response.json();
    } catch (error) {
      throw error;
    }
  }

  // MAIN FILTER
  // Handle filter change events
  async handleFilterChange() {
    await this.fetchActivityData();

    const filteredData = this.getFilteredActivityData(
      this.selectedLevel,
      this.searchTerm,
      this.isOnlySaved,
      this.selectedCategories
    );

    this.displayActivityData(filteredData);
  }

  getFilteredActivityData(levelSelected = null, searchTerm = "", isOnlySaved, categorySelected = []) {
    let filteredData = this.activityData;
    if (levelSelected) {
      filteredData = filteredData.filter((activity) => activity.level.includes(levelSelected));
    }
    if (searchTerm) {
      filteredData = filteredData.filter((activity) => activity.title.toLowerCase().includes(searchTerm));
    }
    if (isOnlySaved) {
      filteredData = filteredData.filter((activity) => activity.isSaved);
    }

    if (categorySelected.length) {
      filteredData = filteredData.filter((activity) => {
        return activity.category.some((category) => categorySelected.includes(category.toLowerCase()));
      });
    }

    return filteredData;
  }

  handleSearch() {
    let filteredData = this.activityData;
    if (this.searchTerm) {
      filteredData = filteredData.filter((activity) => activity.title.toLowerCase().includes(this.searchTerm));
    }

    this.displayActivityData(filteredData);
  }

  // main display of data
  displayActivityData(activityData) {
    if (!activityData || activityData.length === 0) {
      this.resultsContainer.innerHTML = "<p>Aucune activités trouvées</p>";
      return;
    }
    this.resultsContainer.innerHTML = activityData
      .map(
        ({ title, level, permalink, postId, estimatedTime, isSaved, savedId, category, tags }) => `
        <a href="${permalink}"><div class="class-activity-post-item">
                     <div class="class-activity-saved">
        
                     ${SavedButton.getSavedButtonHTML(postId, isSaved, savedId)}
                  
                     </div>
                     <span class="class-activity-entry-categories">
                              
                                 ${category} </span>
                              

                     <h2 class="title-text">${title}</h2>

                     <div class="class-activity-entry-meta">
                              <span class="class-levels">Niveau :
                                       <span class="meta-item-levels">${level}</span>
                              </span>
                     
                     <div class="meta-item-estimated-time"><span class="dashicons dashicons-clock"></span> ${estimatedTime} minutes</div>
                        
                     </div>
                     <ul class="grid-tags">
                           ${tags
                             .map(
                               (tag) =>
                                 `<p class="tag-item">
                               ${tag}
                             </p>`
                             )
                             .join("")} 
                     </ul>
                  </div>
               
  
         </div></a>`
      )
      .join("");
  }
}

export default ClassActivityArchive;
