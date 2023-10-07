/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/componants/class-activity/archive-class-activity.js":
/*!*****************************************************************!*\
  !*** ./src/componants/class-activity/archive-class-activity.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _save_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../save-button */ "./src/componants/save-button.js");
/* harmony import */ var _saved_post_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../saved-post-manager */ "./src/componants/saved-post-manager.js");
/* harmony import */ var _popup_login_redirect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../popup-login-redirect */ "./src/componants/popup-login-redirect.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../loader */ "./src/componants/loader.js");




class ClassActivityArchive {
  //INITIATE AND DEFINE ARCHIVE
  constructor() {
    this.resultsContainer = document.querySelector("#class-activity-archive-container");
    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.attachEventListeners();
    this.savedPostManager = new _saved_post_manager__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.fetchAndDisplayActivityData(); // Fetch and display initial data
    this.loginPopup = new _popup_login_redirect__WEBPACK_IMPORTED_MODULE_2__["default"]();
  }

  //ALL EVENTS

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.resultsContainer.addEventListener("click", event => {
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
    this.levelFilter.addEventListener("change", e => {
      this.selectedLevel = e.target.value;
      this.handleFilterChange();
    });

    // Search event
    this.searchInput = document.querySelector("#searchInput");
    this.clearSearchButton = document.querySelector("#clearSearch");
    this.searchInput.addEventListener("input", event => {
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
    this.sideBarArchive = document.querySelectorAll("#side-bar-archive label").forEach(label => {
      label.addEventListener("click", e => {
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
    this.resultsContainer.innerHTML = _loader__WEBPACK_IMPORTED_MODULE_3__["default"].getLoader();
  }
  async fetchAndDisplayActivityData() {
    await this.fetchActivityData();
    this.displayActivityData(this.activityData);
  }
  async fetchActivityData() {
    this.displayLoader();
    let headers = {
      "Content-Type": "application/json"
    };
    if (wpApiSettings && wpApiSettings.nonce) {
      headers["X-WP-Nonce"] = wpApiSettings.nonce;
    }
    try {
      if (this.pageLanguage == "pt") this.pageLanguage = "";
      const response = await fetch(`/wp-json/perfect-grammar/v1/activity/archive?lang=` + this.pageLanguage, {
        method: "GET",
        headers: headers
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
    const filteredData = this.getFilteredActivityData(this.selectedLevel, this.searchTerm, this.isOnlySaved, this.selectedCategories);
    this.displayActivityData(filteredData);
  }
  getFilteredActivityData(levelSelected = null, searchTerm = "", isOnlySaved, categorySelected = []) {
    let filteredData = this.activityData;
    if (levelSelected) {
      filteredData = filteredData.filter(activity => activity.level.includes(levelSelected));
    }
    if (searchTerm) {
      filteredData = filteredData.filter(activity => activity.title.toLowerCase().includes(searchTerm));
    }
    if (isOnlySaved) {
      filteredData = filteredData.filter(activity => activity.isSaved);
    }
    if (categorySelected.length) {
      filteredData = filteredData.filter(activity => {
        return activity.category.some(category => categorySelected.includes(category.toLowerCase()));
      });
    }
    return filteredData;
  }
  handleSearch() {
    let filteredData = this.activityData;
    if (this.searchTerm) {
      filteredData = filteredData.filter(activity => activity.title.toLowerCase().includes(this.searchTerm));
    }
    this.displayActivityData(filteredData);
  }

  // main display of data
  displayActivityData(activityData) {
    if (!activityData || activityData.length === 0) {
      this.resultsContainer.innerHTML = "<p>Aucune activités trouvées</p>";
      return;
    }
    this.resultsContainer.innerHTML = activityData.map(({
      title,
      level,
      permalink,
      postId,
      estimatedTime,
      isSaved,
      savedId,
      category,
      tags
    }) => `
        <a href="${permalink}"><div class="class-activity-post-item">
                     <div class="class-activity-saved">
        
                     ${_save_button__WEBPACK_IMPORTED_MODULE_0__["default"].getSavedButtonHTML(postId, isSaved, savedId)}
                  
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
                           ${tags.map(tag => `<p class="tag-item">
                               ${tag}
                             </p>`).join("")} 
                     </ul>
                  </div>
               
  
         </div></a>`).join("");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClassActivityArchive);

/***/ }),

/***/ "./src/componants/class-activity/single-class-activity.js":
/*!****************************************************************!*\
  !*** ./src/componants/class-activity/single-class-activity.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _save_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../save-button */ "./src/componants/save-button.js");
/* harmony import */ var _saved_post_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../saved-post-manager */ "./src/componants/saved-post-manager.js");
/* harmony import */ var _share_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../share-link */ "./src/componants/share-link.js");



class SingleActivity {
  constructor() {
    this.activityContainer = document.getElementById("activity-container");
    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.randomButton = document.getElementById("random-activity-button");
    this.activityContainerSecond = document.getElementById("activity-container-second");
    this.shareButton = new _share_link__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.attachEventListeners();
    // Get the activity ID from the data attribute on the container
    this.activityId = this.activityContainer.dataset.activityId;
    this.fetchExerciseData().then(this.displayExerciseData.bind(this));
    this.savedPostManager = new _saved_post_manager__WEBPACK_IMPORTED_MODULE_1__["default"]();
  }

  // ALL EVENTS HEREEE

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.activityContainer.addEventListener("click", event => {
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
          "X-WP-Nonce": nonce
        }
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
    const {
      title,
      category,
      tags,
      level,
      estimatedTime,
      postId,
      isSaved,
      savedId,
      instructions
    } = activityData;
    this.activityContainer.innerHTML = `
       
        <div class="title-banner hide-large">
        <h1 class="main-title-large">${title}</h1>
        </div>

        <div class="top-activity">
        <div class="level-activity">${level.join("/")}</div>
        
        <div class="save-done-button">
        ${_save_button__WEBPACK_IMPORTED_MODULE_0__["default"].getSavedButtonHTML(postId, isSaved, savedId)} 
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
       
         
      <ul class="grid-tags">${tags.map(tag => `<p class="tag-item">${tag}</p>`).join("")}</ul>
        <div class="divider div-transparent div-dot"></div>

        <div class="actions-footer">
        <div class="copy-link">${this.shareButton}</div>

       <div class="">
        ${_save_button__WEBPACK_IMPORTED_MODULE_0__["default"].getSavedButtonHTML(postId, isSaved, savedId)} 
      </div>
        
        
       </div>
       </div>
      `;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SingleActivity);

/***/ }),

/***/ "./src/componants/done-button.js":
/*!***************************************!*\
  !*** ./src/componants/done-button.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class DoneButton {
  static getDoneButtonHTML(postId, isDone, doneId) {
    return `
        <div class="done-checkbox-wrapper  exercise-item__done">
        <input type="checkbox" id="${postId}_checkbox" class="validate-checkbox" ${isDone ? 'checked' : ''} doneid="${doneId}" >
        <label for="${postId}_checkbox">
        <div class="tick_mark">
         </label>
            </div></div>
        
        `;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DoneButton);

/***/ }),

/***/ "./src/componants/done-post-manager.js":
/*!*********************************************!*\
  !*** ./src/componants/done-post-manager.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _popup_login_redirect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup-login-redirect */ "./src/componants/popup-login-redirect.js");

class DonePostManager {
  constructor() {
    this.loginPopup = new _popup_login_redirect__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  async createDonePost(postId, checkboxElement, title) {
    if (!user_status.logged_in) {
      this.loginPopup.show();
      return;
    }
    const nonce = wpApiSettings.nonce;
    const response = await fetch("/wp-json/wp/v2/done_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": nonce
      },
      body: JSON.stringify({
        title: `Saved post : ${title}`,
        status: "publish",
        meta: {
          done_post_id: postId
        }
      })
    });
    if (!response.ok) throw new Error("Error creating done post");
    const body = await response.json();
    //  console.log(checkboxElement, body.id);
    checkboxElement.setAttribute("doneId", body.id);
  }
  async deleteDonePost(doneId, checkboxElement) {
    if (!user_status.logged_in) {
      this.loginPopup.show();
      return;
    }
    const nonce = wpApiSettings.nonce;
    const response = await fetch(`/wp-json/wp/v2/done_post/${doneId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": nonce
      }
    });
    if (!response.ok) throw new Error("Error deleting done post");
    checkboxElement.removeAttribute("doneId");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DonePostManager);

/***/ }),

/***/ "./src/componants/exercise/archive-exercise.js":
/*!*****************************************************!*\
  !*** ./src/componants/exercise/archive-exercise.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _done_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../done-button */ "./src/componants/done-button.js");
/* harmony import */ var _save_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../save-button */ "./src/componants/save-button.js");
/* harmony import */ var _saved_post_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../saved-post-manager */ "./src/componants/saved-post-manager.js");
/* harmony import */ var _done_post_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../done-post-manager */ "./src/componants/done-post-manager.js");
/* harmony import */ var _popup_login_redirect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../popup-login-redirect */ "./src/componants/popup-login-redirect.js");
/* harmony import */ var _loader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../loader */ "./src/componants/loader.js");






class ExercisesArchive {
  //INITIATE AND DEFINE ARCHIVE
  constructor() {
    this.resultsContainer = document.querySelector("#exercises-archive-container");
    this.progressBar = document.getElementById("progress-bar");
    this.progressPercent = document.getElementById("progress-percent");
    this.pageLanguage = document.documentElement.lang.substring(0, 2);
    this.attachEventListeners();
    this.savedPostManager = new _saved_post_manager__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.donePostManager = new _done_post_manager__WEBPACK_IMPORTED_MODULE_3__["default"]();
    this.fetchAndDisplayExerciseData(); // Fetch and display initial data
    this.loginPopup = new _popup_login_redirect__WEBPACK_IMPORTED_MODULE_4__["default"]();
  }

  //ALL EVENTS

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.resultsContainer.addEventListener("click", event => {
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
    this.levelFilter.addEventListener("change", e => {
      this.selectedLevel = e.target.value;
      this.handleFilterChange();
    });

    // Search event
    this.searchInput = document.querySelector("#searchInput");
    this.clearSearchButton = document.querySelector("#clearSearch");
    this.searchInput.addEventListener("input", event => {
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
    this.sideBarArchive = document.querySelectorAll("#side-bar-archive label").forEach(label => {
      label.addEventListener("click", e => {
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
    const exerciseToUpdate = this.exerciseData.find(exercise => exercise.postId === Number(postItemID));
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
    this.resultsContainer.innerHTML = _loader__WEBPACK_IMPORTED_MODULE_5__["default"].getLoader();
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
          "X-WP-Nonce": wpApiSettings.nonce
        }
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
    const filteredData = this.getFilteredExerciseData(this.selectedLevel, this.searchTerm, this.isOnlySaved, this.selectedCategories);
    if (this.progressBar) {
      this.handleProgressBar();
    }
    this.displayExerciseData(filteredData);
  }
  getFilteredExerciseData(levelSelected = null, searchTerm = "", isOnlySaved, categorySelected = []) {
    let filteredData = this.exerciseData;
    if (levelSelected) {
      filteredData = filteredData.filter(exercise => exercise.level.includes(levelSelected));
    }
    if (searchTerm) {
      filteredData = filteredData.filter(exercise => exercise.title.toLowerCase().includes(searchTerm));
    }
    if (isOnlySaved) {
      filteredData = filteredData.filter(exercise => exercise.isSaved);
    }
    if (categorySelected.length) {
      filteredData = filteredData.filter(exercise => {
        return exercise.category.some(category => categorySelected.includes(category.toLowerCase()));
      });
    }
    return filteredData;
  }
  handleSearch() {
    let filteredData = this.exerciseData;
    if (this.searchTerm) {
      filteredData = filteredData.filter(exercise => exercise.title.toLowerCase().includes(this.searchTerm));
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
      const percentDone = doneExercices / totalExercices * 100;
      this.progressBar.style.setProperty("--progress", `${percentDone}%`);
    }
  }

  // main display of data
  displayExerciseData(exerciseData) {
    if (!exerciseData || exerciseData.length === 0) {
      this.resultsContainer.innerHTML = "<p>Aucun exercices trouvés</p>";
      return;
    }
    this.resultsContainer.innerHTML = exerciseData.map(({
      title,
      level,
      permalink,
      postId,
      isDone,
      doneId,
      isSaved,
      savedId
    }) => `
            <a href="${permalink}"><div class="exercise-item ${isSaved ? "box-highlight" : ""} ${isDone ? "box-reduced-opacity" : ""}">
            <div class="exercise-item__level">${level.join("/")}</div>
            <div class="exercise-item__title">
        <div id="title" class="title-text ${isDone ? "strikethrough" : ""}">${title}</div></div>
  
        ${_save_button__WEBPACK_IMPORTED_MODULE_1__["default"].getSavedButtonHTML(postId, isSaved, savedId)}
        ${_done_button__WEBPACK_IMPORTED_MODULE_0__["default"].getDoneButtonHTML(postId, isDone, doneId)}
         </div></a>`).join("");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ExercisesArchive);

/***/ }),

/***/ "./src/componants/exercise/single-exercise.js":
/*!****************************************************!*\
  !*** ./src/componants/exercise/single-exercise.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _done_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../done-button */ "./src/componants/done-button.js");
/* harmony import */ var _save_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../save-button */ "./src/componants/save-button.js");
/* harmony import */ var _saved_post_manager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../saved-post-manager */ "./src/componants/saved-post-manager.js");
/* harmony import */ var _done_post_manager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../done-post-manager */ "./src/componants/done-post-manager.js");
/* harmony import */ var _share_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../share-link */ "./src/componants/share-link.js");





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
    this.savedPostManager = new _saved_post_manager__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.donePostManager = new _done_post_manager__WEBPACK_IMPORTED_MODULE_3__["default"]();
  }

  // ALL EVENTS HEREEE

  // for DOM purposes i delegate to validate-checkbox
  attachEventListeners() {
    this.exerciseContainer.addEventListener("click", event => {
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
          "X-WP-Nonce": nonce
        }
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
    const {
      title,
      content,
      video,
      tags,
      level,
      postId,
      isSaved,
      savedId,
      isDone,
      doneId
    } = exerciseData;
    this.exerciseContainer.innerHTML = `
       

          
       
        <div class="title-banner hide-large">
        <h1 class="main-title-large">${title}</h1>
        </div>
        <div class="top-exercise">
        <div class="level-exercise">${level.join("/")}</div>
        
        <div class="save-done-button">
        ${_save_button__WEBPACK_IMPORTED_MODULE_1__["default"].getSavedButtonHTML(postId, isSaved, savedId)} 
        ${_done_button__WEBPACK_IMPORTED_MODULE_0__["default"].getDoneButtonHTML(postId, isDone, doneId)} 
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
          <ul class="grid-tags">${tags.map(tag => `<p class="tag-item">${tag}</p>`).join("")}</ul>

            </div>
            <div class="actions-footer">
      <div class="copy-link"> ${new _share_link__WEBPACK_IMPORTED_MODULE_4__["default"]()}</div>

     <div class="">
      ${_save_button__WEBPACK_IMPORTED_MODULE_1__["default"].getSavedButtonHTML(postId, isSaved, savedId)} 
    </div>
    </div>

            <div class="divider div-transparent div-dot"></div>

          

      `;
    this.exerciseContainerSecond.innerHTML = `
      <div class="divider div-transparent div-dot"></div>
      

      <div class="footer-exercise">
      <p class="title-medium t-center">${isDone ? "Exercice déjà validé !" : "Valider l'exercice ?"} </p>
       <div class="footer-done-button"> ${_done_button__WEBPACK_IMPORTED_MODULE_0__["default"].getDoneButtonHTML(postId, isDone, doneId)} </div>
        </div>
        </div>
      `;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SingleExercise);

/***/ }),

/***/ "./src/componants/loader.js":
/*!**********************************!*\
  !*** ./src/componants/loader.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Loader {
  static getLoader() {
    return `<div class="loader-container">
    <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">
    <div class="wheel"></div>
    <div class="hamster">
      <div class="hamster__body">
        <div class="hamster__head">
          <div class="hamster__ear"></div>
          <div class="hamster__eye"></div>
          <div class="hamster__nose"></div>
        </div>
        <div class="hamster__limb hamster__limb--fr"></div>
        <div class="hamster__limb hamster__limb--fl"></div>
        <div class="hamster__limb hamster__limb--br"></div>
        <div class="hamster__limb hamster__limb--bl"></div>
        <div class="hamster__tail"></div>
      </div>
    </div>
    <div class="spoke"></div>
  </div></div>
    `;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Loader);

/***/ }),

/***/ "./src/componants/popup-login-redirect.js":
/*!************************************************!*\
  !*** ./src/componants/popup-login-redirect.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class PopupLoginRedirect {
  constructor() {
    this.loginPopup = this.createLoginPopup();
    document.body.appendChild(this.loginPopup);
    const closeButton = document.getElementById('closePopup-pf');
    closeButton.addEventListener('click', this.hide.bind(this));
  }
  createLoginPopup() {
    const loginPopup = document.createElement('div');
    loginPopup.id = 'loginPopup-pf';
    loginPopup.style.display = 'none';
    loginPopup.innerHTML = `
            <div>
              <span id="closePopup-pf">&times;</span>
              <h2>Login Required</h2>
              <p>Connecte-toi pour sauvegarder tes exercices</p>
              <a href="/login"><button id="loginButton-pf" class="btn">Login</button></a>
            </div>
          `;
    const closeButton = loginPopup.querySelector('#closePopup-pf');
    closeButton.addEventListener('click', this.hide.bind(this));
    return loginPopup;
  }
  show() {
    this.loginPopup.style.display = 'block';
  }
  hide() {
    this.loginPopup.style.display = 'none';
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PopupLoginRedirect);

/***/ }),

/***/ "./src/componants/save-button.js":
/*!***************************************!*\
  !*** ./src/componants/save-button.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class SavedButton {
  static getSavedButtonHTML(postId, isSaved, savedId) {
    return `
        <div class="save-checkbox-wrapper exercise-item__save"> <label class="label-pf">       
        <input  class="label-pf__checkbox" type="checkbox" id="${postId}_save" ${isSaved ? 'checked' : ''} saved-id="${savedId}"/>
        <span class="label-pf__text">
          <span class="label-pf__check"><svg class="save-icon" "id="save-icon" data-name="Group 23" xmlns="http://www.w3.org/2000/svg" width="15.33" height="20.094" viewBox="0 0 15.33 20.094">
          <path id="Path_52" data-name="Path 52" d="M517.434,385.807a1.63,1.63,0,0,1-.953-.311,1.77,1.77,0,0,1-.725-1.441c0-2.294-.04-10.739-.064-14.623a3.809,3.809,0,0,1,1.086-2.7,3.4,3.4,0,0,1,2.426-1.023h8.3a3.611,3.611,0,0,1,3.512,3.692c0,3.871,0,13.037-.023,14.533a1.771,1.771,0,0,1-.726,1.405,1.626,1.626,0,0,1-1.45.232.666.666,0,0,1-.219-.119c-2.072-1.694-4.38-3.529-5.179-4.095-.8.579-3.148,2.483-5.249,4.239a.669.669,0,0,1-.213.12A1.646,1.646,0,0,1,517.434,385.807Zm1.769-18.764a2.084,2.084,0,0,0-1.482.631,2.474,2.474,0,0,0-.7,1.751c.023,3.885.066,12.335.064,14.632a.426.426,0,0,0,.171.358.3.3,0,0,0,.186.061c5.458-4.561,5.7-4.556,5.985-4.555.273,0,.509.006,5.887,4.4h0a.3.3,0,0,0,.179-.061.427.427,0,0,0,.171-.348h0c.028-1.484.026-10.64.023-14.507a2.281,2.281,0,0,0-2.181-2.362Z" transform="translate(-515.691 -365.713)" stroke-width="2"/>        </svg>
          </span>
        </span>
      </label>
    </div> `;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SavedButton);

/***/ }),

/***/ "./src/componants/saved-post-manager.js":
/*!**********************************************!*\
  !*** ./src/componants/saved-post-manager.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _popup_login_redirect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./popup-login-redirect */ "./src/componants/popup-login-redirect.js");

class SavedPostManager {
  constructor() {
    this.loginPopup = new _popup_login_redirect__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  async createSavedPost(postId, checkboxElement, title) {
    if (!user_status.logged_in) {
      this.loginPopup.show();
      return;
    }
    const nonce = wpApiSettings.nonce;
    const response = await fetch("/wp-json/wp/v2/saved_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": nonce
      },
      body: JSON.stringify({
        title: `Saved post : ${title}`,
        status: "publish",
        meta: {
          saved_post_id: postId
        }
      })
    });
    if (!response.ok) throw new Error("Error creating saved post");
    const body = await response.json();
    //  console.log(checkboxElement, body.id);
    checkboxElement.setAttribute("saved-id", body.id);
  }
  async deleteSavedPost(savedId, checkboxElement) {
    if (!user_status.logged_in) {
      this.loginPopup.show();
      return;
    }
    const nonce = wpApiSettings.nonce;
    const response = await fetch(`/wp-json/wp/v2/saved_post/${savedId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": nonce
      }
    });
    if (!response.ok) throw new Error("Error deleting saved post");
    checkboxElement.removeAttribute("saved-id");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SavedPostManager);

/***/ }),

/***/ "./src/componants/share-link.js":
/*!**************************************!*\
  !*** ./src/componants/share-link.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class ShareButton {
  constructor() {
    this.init();
  }
  init() {
    this.button = document.createElement("button");
    this.button.className = "share-button";
    this.button.innerHTML = `<span class="dashicons dashicons-admin-links"></span> Partager le lien`;
    const container = document.querySelector(".single-container");
    if (container) {
      container.appendChild(this.button);
      container.addEventListener("click", event => {
        let target = event.target;

        // Traverse up the DOM tree to find the closest button element
        while (target !== null && target.nodeName !== "BUTTON") {
          target = target.parentElement;
        }
        if (target && target.classList.contains("share-button")) {
          this.share(target);
        }
      });
    } else {
      console.error("Shared button container not found");
    }
  }
  share(target) {
    const url = window.location.href;
    const textarea = document.createElement("textarea");
    navigator.clipboard.writeText(url).then(() => {
      target.innerHTML = `<span class="dashicons dashicons-admin-links"></span> Lien copié !`;
    }).catch(error => {
      alert("An error occurred: " + error);
    });
  }
  toString() {
    return this.button.outerHTML;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShareButton);

/***/ }),

/***/ "./css/styles.scss":
/*!*************************!*\
  !*** ./css/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/styles.scss */ "./css/styles.scss");
/* harmony import */ var _componants_exercise_archive_exercise_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./componants/exercise/archive-exercise.js */ "./src/componants/exercise/archive-exercise.js");
/* harmony import */ var _componants_exercise_single_exercise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./componants/exercise/single-exercise.js */ "./src/componants/exercise/single-exercise.js");
/* harmony import */ var _componants_class_activity_archive_class_activity_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./componants/class-activity/archive-class-activity.js */ "./src/componants/class-activity/archive-class-activity.js");
/* harmony import */ var _componants_class_activity_single_class_activity_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./componants/class-activity/single-class-activity.js */ "./src/componants/class-activity/single-class-activity.js");






// Calls the ExecisesArchive if there is a #exercises-archive-container, is that GOOD ? or better to enqueue a file with php conditions?
document.addEventListener("DOMContentLoaded", () => {
  const archiveExercisesContainer = document.querySelector("#exercises-archive-container");
  if (archiveExercisesContainer) {
    const exercisesArchive = new _componants_exercise_archive_exercise_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
  }
});

// Same for SingleExercise
document.addEventListener("DOMContentLoaded", () => {
  const exerciseContainer = document.getElementById("exercise-container");
  if (exerciseContainer) {
    const singleExercise = new _componants_exercise_single_exercise_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
  }
});

// Same for ClassActivityArchive
document.addEventListener("DOMContentLoaded", () => {
  const archiveActivityContainer = document.querySelector("#class-activity-archive-container");
  if (archiveActivityContainer) {
    const classActivityArchive = new _componants_class_activity_archive_class_activity_js__WEBPACK_IMPORTED_MODULE_3__["default"]();
  }
});

// Same for SingleActivity
document.addEventListener("DOMContentLoaded", () => {
  const activityContainer = document.getElementById("activity-container");
  if (activityContainer) {
    const singleActivity = new _componants_class_activity_single_class_activity_js__WEBPACK_IMPORTED_MODULE_4__["default"]();
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map