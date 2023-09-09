(()=>{"use strict";const e=class{static getDoneButtonHTML(e,t,s){return`\n        <div class="done-checkbox-wrapper  exercise-item__done">\n        <input type="checkbox" id="${e}_checkbox" class="validate-checkbox" ${t?"checked":""} doneid="${s}" >\n        <label for="${e}_checkbox">\n        <div class="tick_mark">\n         </label>\n            </div></div>\n        \n        `}},t=class{static getSavedButtonHTML(e,t,s){return`\n        <div class="save-checkbox-wrapper exercise-item__save"> <label class="label-pf">       \n        <input  class="label-pf__checkbox" type="checkbox" id="${e}_save" ${t?"checked":""} saved-id="${s}"/>\n        <span class="label-pf__text">\n          <span class="label-pf__check"><svg class="save-icon" "id="save-icon" data-name="Group 23" xmlns="http://www.w3.org/2000/svg" width="15.33" height="20.094" viewBox="0 0 15.33 20.094">\n          <path id="Path_52" data-name="Path 52" d="M517.434,385.807a1.63,1.63,0,0,1-.953-.311,1.77,1.77,0,0,1-.725-1.441c0-2.294-.04-10.739-.064-14.623a3.809,3.809,0,0,1,1.086-2.7,3.4,3.4,0,0,1,2.426-1.023h8.3a3.611,3.611,0,0,1,3.512,3.692c0,3.871,0,13.037-.023,14.533a1.771,1.771,0,0,1-.726,1.405,1.626,1.626,0,0,1-1.45.232.666.666,0,0,1-.219-.119c-2.072-1.694-4.38-3.529-5.179-4.095-.8.579-3.148,2.483-5.249,4.239a.669.669,0,0,1-.213.12A1.646,1.646,0,0,1,517.434,385.807Zm1.769-18.764a2.084,2.084,0,0,0-1.482.631,2.474,2.474,0,0,0-.7,1.751c.023,3.885.066,12.335.064,14.632a.426.426,0,0,0,.171.358.3.3,0,0,0,.186.061c5.458-4.561,5.7-4.556,5.985-4.555.273,0,.509.006,5.887,4.4h0a.3.3,0,0,0,.179-.061.427.427,0,0,0,.171-.348h0c.028-1.484.026-10.64.023-14.507a2.281,2.281,0,0,0-2.181-2.362Z" transform="translate(-515.691 -365.713)" stroke-width="2"/>        </svg>\n          </span>\n        </span>\n      </label>\n    </div> `}},s=class{constructor(){this.loginPopup=this.createLoginPopup(),document.body.appendChild(this.loginPopup),document.getElementById("closePopup-pf").addEventListener("click",this.hide.bind(this))}createLoginPopup(){const e=document.createElement("div");return e.id="loginPopup-pf",e.style.display="none",e.innerHTML='\n            <div>\n              <span id="closePopup-pf">&times;</span>\n              <h2>Login Required</h2>\n              <p>Connecte-toi pour sauvegarder tes exercices</p>\n              <a href="/login"><button id="loginButton-pf" class="btn">Login</button></a>\n            </div>\n          ',e.querySelector("#closePopup-pf").addEventListener("click",this.hide.bind(this)),e}show(){this.loginPopup.style.display="block"}hide(){this.loginPopup.style.display="none"}},i=class{constructor(){this.loginPopup=new s}async createSavedPost(e,t,s){if(!user_status.logged_in)return void this.loginPopup.show();const i=wpApiSettings.nonce,n=await fetch("/wp-json/wp/v2/saved_post",{method:"POST",headers:{"Content-Type":"application/json","X-WP-Nonce":i},body:JSON.stringify({title:`Saved post : ${s}`,status:"publish",meta:{saved_post_id:e}})});if(!n.ok)throw new Error("Error creating saved post");const a=await n.json();t.setAttribute("saved-id",a.id)}async deleteSavedPost(e,t){if(!user_status.logged_in)return void this.loginPopup.show();const s=wpApiSettings.nonce;if(!(await fetch(`/wp-json/wp/v2/saved_post/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json","X-WP-Nonce":s}})).ok)throw new Error("Error deleting saved post");t.removeAttribute("saved-id")}},n=class{constructor(){this.loginPopup=new s}async createDonePost(e,t,s){if(!user_status.logged_in)return void this.loginPopup.show();const i=wpApiSettings.nonce,n=await fetch("/wp-json/wp/v2/done_post",{method:"POST",headers:{"Content-Type":"application/json","X-WP-Nonce":i},body:JSON.stringify({title:`Saved post : ${s}`,status:"publish",meta:{done_post_id:e}})});if(!n.ok)throw new Error("Error creating done post");const a=await n.json();t.setAttribute("doneId",a.id)}async deleteDonePost(e,t){if(!user_status.logged_in)return void this.loginPopup.show();const s=wpApiSettings.nonce;if(!(await fetch(`/wp-json/wp/v2/done_post/${e}`,{method:"DELETE",headers:{"Content-Type":"application/json","X-WP-Nonce":s}})).ok)throw new Error("Error deleting done post");t.removeAttribute("doneId")}},a=class{static getLoader(){return'<div class="loader-container">\n    <div aria-label="Orange and tan hamster running in a metal wheel" role="img" class="wheel-and-hamster">\n    <div class="wheel"></div>\n    <div class="hamster">\n      <div class="hamster__body">\n        <div class="hamster__head">\n          <div class="hamster__ear"></div>\n          <div class="hamster__eye"></div>\n          <div class="hamster__nose"></div>\n        </div>\n        <div class="hamster__limb hamster__limb--fr"></div>\n        <div class="hamster__limb hamster__limb--fl"></div>\n        <div class="hamster__limb hamster__limb--br"></div>\n        <div class="hamster__limb hamster__limb--bl"></div>\n        <div class="hamster__tail"></div>\n      </div>\n    </div>\n    <div class="spoke"></div>\n  </div></div>\n    '}},c=class{constructor(){this.init()}init(){this.button=document.createElement("button"),this.button.className="share-button",this.button.innerHTML='<span class="dashicons dashicons-admin-links"></span> Partager le lien';const e=document.querySelector(".single-container");e?(e.appendChild(this.button),e.addEventListener("click",(e=>{let t=e.target;for(;null!==t&&"BUTTON"!==t.nodeName;)t=t.parentElement;t&&t.classList.contains("share-button")&&this.share(t)}))):console.error("Shared button container not found")}share(e){const t=window.location.href;document.createElement("textarea"),navigator.clipboard.writeText(t).then((()=>{e.innerHTML='<span class="dashicons dashicons-admin-links"></span> Lien copié !'})).catch((e=>{alert("An error occurred: "+e)}))}toString(){return this.button.outerHTML}};document.addEventListener("DOMContentLoaded",(()=>{document.querySelector("#exercises-archive-container")&&new class{constructor(){this.resultsContainer=document.querySelector("#exercises-archive-container"),this.progressBar=document.getElementById("progress-bar"),this.progressPercent=document.getElementById("progress-percent"),this.pageLanguage=document.documentElement.lang.substring(0,2),this.attachEventListeners(),this.savedPostManager=new i,this.donePostManager=new n,this.fetchAndDisplayExerciseData(),this.loginPopup=new s}attachEventListeners(){this.resultsContainer.addEventListener("click",(e=>{const t=e.target.closest(".validate-checkbox");if(t){const e=t.closest(".exercise-item").querySelector(".title-text"),s=t.closest(".exercise-item");this.handleClickDone(t,e,s)}const s=e.target.closest(".label-pf__checkbox");if(s){const e=s.closest(".exercise-item"),t=e.querySelector(".title-text");this.handleClickSaved(s,t,e)}})),this.selectedLevel=null,this.levelFilter=document.querySelector("#level-options"),this.levelFilter.addEventListener("change",(e=>{this.selectedLevel=e.target.value,this.handleFilterChange()})),this.searchInput=document.querySelector("#searchInput"),this.clearSearchButton=document.querySelector("#clearSearch"),this.searchInput.addEventListener("input",(e=>{""!==this.searchInput.value?this.clearSearchButton.classList.remove("hide"):this.clearSearchButton.classList.add("hide"),this.searchTerm=e.target.value.toLowerCase(),this.handleSearch()})),this.clearSearchButton.addEventListener("click",(()=>{this.searchInput.value="",this.searchTerm="",this.clearSearchButton.classList.add("hide"),this.searchInput.focus(),this.handleFilterChange()})),this.isOnlySaved=!1,this.isOnlySavedCheckbox=document.querySelector("#only-saved"),this.isOnlySavedCheckbox.addEventListener("change",(()=>{user_status.logged_in?this.isOnlySavedCheckbox.checked?(this.isOnlySaved=this.isOnlySavedCheckbox.checked,this.handleFilterChange()):(this.isOnlySaved=!1,this.handleFilterChange()):this.loginPopup.show()})),this.selectedCategories=[],this.sideBarArchive=document.querySelectorAll("#side-bar-archive label").forEach((e=>{e.addEventListener("click",(e=>{const t=e.currentTarget.id.toLowerCase();if(e.target.checked)this.selectedCategories.includes(t)||this.selectedCategories.push(t);else{const e=this.selectedCategories.indexOf(t);e>-1&&this.selectedCategories.splice(e,1)}this.handleFilterChange()}))}))}handleClickDone(e,t,s){const i=e.id.replace("_checkbox",""),n=t.innerText,a=this.exerciseData.find((e=>e.postId===Number(i)));e.checked?(this.donePostManager.createDonePost(i,e,n),t.classList.add("strikethrough"),s.classList.add("box-reduced-opacity"),a.isDone=!0):(this.donePostManager.deleteDonePost(e.getAttribute("doneId"),e),t.classList.remove("strikethrough"),s.classList.remove("box-reduced-opacity"),a.isDone=!1),this.progressBar&&this.handleProgressBar()}handleClickSaved(e,t,s){const i=t.innerText,n=e.id.replace("_save","");e.checked?(this.savedPostManager.createSavedPost(n,e,i),s.classList.add("box-highlight")):(this.savedPostManager.deleteSavedPost(e.getAttribute("saved-id"),e),s.classList.remove("box-highlight"))}displayLoader(){this.resultsContainer.innerHTML=a.getLoader()}async fetchAndDisplayExerciseData(){await this.fetchExerciseData(),this.displayExerciseData(this.exerciseData),this.handleFilterChange(this.exerciseData)}async fetchExerciseData(){this.displayLoader();try{"pt"==this.pageLanguage&&(this.pageLanguage="");const e=await fetch("/wp-json/perfect-grammar/v1/exercise/archive?lang="+this.pageLanguage,{method:"GET",headers:{"Content-Type":"application/json","X-WP-Nonce":wpApiSettings.nonce}});if(!e.ok)throw new Error("Exercise data not found");this.exerciseData=await e.json()}catch(e){throw e}}async handleFilterChange(){await this.fetchExerciseData();const e=this.getFilteredExerciseData(this.selectedLevel,this.searchTerm,this.isOnlySaved,this.selectedCategories);this.progressBar&&this.handleProgressBar(),this.displayExerciseData(e)}getFilteredExerciseData(e=null,t="",s,i=[]){let n=this.exerciseData;return e&&(n=n.filter((t=>t.level.includes(e)))),t&&(n=n.filter((e=>e.title.toLowerCase().includes(t)))),s&&(n=n.filter((e=>e.isSaved))),i.length&&(n=n.filter((e=>e.category.some((e=>i.includes(e.toLowerCase())))))),n}handleSearch(){let e=this.exerciseData;this.searchTerm&&(e=e.filter((e=>e.title.toLowerCase().includes(this.searchTerm)))),this.displayExerciseData(e)}handleProgressBar(){if(this.exerciseData){const e=this.exerciseData.length,t=this.exerciseData.reduce(((e,t)=>!0===t.isDone?e+1:e),0);this.progressPercent.innerHTML=`${t} / ${e}`;const s=t/e*100;this.progressBar.style.setProperty("--progress",`${s}%`)}}displayExerciseData(s){s&&0!==s.length?this.resultsContainer.innerHTML=s.map((({title:s,level:i,permalink:n,postId:a,isDone:c,doneId:r,isSaved:o,savedId:d})=>`\n            <a href="${n}"><div class="exercise-item ${o?"box-highlight":""} ${c?"box-reduced-opacity":""}">\n            <div class="exercise-item__level">${i.join("/")}</div>\n            <div class="exercise-item__title">\n        <div id="title" class="title-text ${c?"strikethrough":""}">${s}</div></div>\n  \n        ${t.getSavedButtonHTML(a,o,d)}\n        ${e.getDoneButtonHTML(a,c,r)}\n         </div></a>`)).join(""):this.resultsContainer.innerHTML="<p>Aucun exercices trouvés</p>"}}})),document.addEventListener("DOMContentLoaded",(()=>{document.getElementById("exercise-container")&&new class{constructor(){this.exerciseContainer=document.getElementById("exercise-container"),this.pageLanguage=document.documentElement.lang.substring(0,2),this.exerciseContainerSecond=document.getElementById("exercise-container-second"),this.randomButton=document.getElementById("random-exercise-button"),this.attachEventListeners(),this.exerciseId=this.exerciseContainer.dataset.exerciseId,this.fetchExerciseData().then(this.displayExerciseData.bind(this)),this.savedPostManager=new i,this.donePostManager=new n}attachEventListeners(){this.exerciseContainer.addEventListener("click",(e=>{const t=e.target.closest(".validate-checkbox");t&&this.handleClickDone(t);const s=e.target.closest(".label-pf__checkbox");s&&this.handleClickSaved(s)})),this.randomButton.addEventListener("click",(()=>{"pt"==this.pageLanguage&&(this.pageLanguage=""),window.location.href="/wp-json/perfect-grammar/v1/exercise/random?lang="+this.pageLanguage}))}handleClickDone(e){const t=e.id.replace("_checkbox",""),s=document.querySelector('meta[name="titleRaw"]'),i=s?s.getAttribute("content"):t;e.checked?(this.donePostManager.createDonePost(t,e,i),document.querySelector('.footer-done-button input[type="checkbox"]').checked=!0):(this.donePostManager.deleteDonePost(e.getAttribute("doneId"),e),document.querySelector('.footer-done-button input[type="checkbox"]').checked=!1)}handleClickSaved(e){const t=e.id.replace("_save",""),s=document.querySelector('meta[name="titleRaw"]'),i=s?s.getAttribute("content"):t;e.checked?this.savedPostManager.createSavedPost(t,e,i):this.savedPostManager.deleteSavedPost(e.getAttribute("saved-id"),e)}async fetchExerciseData(){const e=wpApiSettings.nonce;try{const t=await fetch(`/wp-json/perfect-grammar/v1/exercise/${this.exerciseId}`,{method:"GET",headers:{"Content-Type":"application/json","X-WP-Nonce":e}});if(!t.ok)throw new Error("Exercise not found");return await t.json()}catch(e){return console.error("Error fetching exercise data:",e.message),null}}displayExerciseData(s){if(!s)return void(this.exerciseContainer.innerHTML="<p>Exercise not found</p>");const{title:i,content:n,video:a,tags:r,level:o,postId:d,isSaved:l,savedId:h,isDone:v,doneId:u}=s;this.exerciseContainer.innerHTML=`\n       \n\n          \n       \n        <div class="title-banner hide-large">\n        <h1 class="main-title-large">${i}</h1>\n        </div>\n        <div class="top-exercise">\n        <div class="level-exercise">${o.join("/")}</div>\n        \n        <div class="save-done-button">\n        ${t.getSavedButtonHTML(d,l,h)} \n        ${e.getDoneButtonHTML(d,v,u)} \n        </div>\n        </div>\n        <div class="title-banner hide-mobile">\n        <h1 class="main-title-large ">${i}</h1>\n        </div>\n\n          \n          <div class="exercise-video">\n          <div class="exercise-video__wrapper">${a}</div>  \n          </div>\n\n        \n       \n           <div class="exercise-explanations">\n          <p class="exercise-explanations__title title-medium hide-mobile">Les points importants ❤️</p>\n          <div class="key-info">${n}</div>\n          </div>\n\n          <div class="exercise-meta">\n          <ul class="grid-tags">${r.map((e=>`<p class="tag-item">${e}</p>`)).join("")}</ul>\n\n            </div>\n            <div class="actions-footer">\n      <div class="copy-link"> ${new c}</div>\n\n     <div class="">\n      ${t.getSavedButtonHTML(d,l,h)} \n    </div>\n    </div>\n\n            <div class="divider div-transparent div-dot"></div>\n\n          \n\n      `,this.exerciseContainerSecond.innerHTML=`\n      <div class="divider div-transparent div-dot"></div>\n      \n\n      <div class="footer-exercise">\n      <p class="title-medium t-center">${v?"Exercice déjà validé !":"Valider l'exercice ?"} </p>\n       <div class="footer-done-button"> ${e.getDoneButtonHTML(d,v,u)} </div>\n        </div>\n        </div>\n      `}}})),document.addEventListener("DOMContentLoaded",(()=>{document.querySelector("#class-activity-archive-container")&&new class{constructor(){this.resultsContainer=document.querySelector("#class-activity-archive-container"),this.pageLanguage=document.documentElement.lang.substring(0,2),this.attachEventListeners(),this.savedPostManager=new i,this.fetchAndDisplayActivityData(),this.loginPopup=new s}attachEventListeners(){this.resultsContainer.addEventListener("click",(e=>{const t=e.target.closest(".label-pf__checkbox");if(t){const e=t.closest(".class-activity-post-item").querySelector(".title-text");console.log(e),this.handleClickSaved(t,e)}})),this.selectedLevel=null,this.levelFilter=document.querySelector("#level-options"),this.levelFilter.addEventListener("change",(e=>{this.selectedLevel=e.target.value,this.handleFilterChange()})),this.searchInput=document.querySelector("#searchInput"),this.clearSearchButton=document.querySelector("#clearSearch"),this.searchInput.addEventListener("input",(e=>{""!==this.searchInput.value?this.clearSearchButton.classList.remove("hide"):this.clearSearchButton.classList.add("hide"),this.searchTerm=e.target.value.toLowerCase(),this.handleSearch()})),this.clearSearchButton.addEventListener("click",(()=>{this.searchInput.value="",this.searchTerm="",this.clearSearchButton.classList.add("hide"),this.searchInput.focus(),this.handleFilterChange()})),this.isOnlySaved=!1,this.isOnlySavedCheckbox=document.querySelector("#only-saved"),this.isOnlySavedCheckbox.addEventListener("change",(()=>{user_status.logged_in?this.isOnlySavedCheckbox.checked?(this.isOnlySaved=this.isOnlySavedCheckbox.checked,this.handleFilterChange()):(this.isOnlySaved=!1,this.handleFilterChange()):this.loginPopup.show()})),this.selectedCategories=[],this.sideBarArchive=document.querySelectorAll("#side-bar-archive label").forEach((e=>{e.addEventListener("click",(e=>{const t=e.currentTarget.id.toLowerCase();if(e.target.checked)this.selectedCategories.includes(t)||this.selectedCategories.push(t);else{const e=this.selectedCategories.indexOf(t);e>-1&&this.selectedCategories.splice(e,1)}this.handleFilterChange()}))}))}handleClickSaved(e,t){const s=e.id.replace("_save",""),i="(Activity) "+t.innerText;e.checked?this.savedPostManager.createSavedPost(s,e,i):this.savedPostManager.deleteSavedPost(e.getAttribute("saved-id"),e)}displayLoader(){this.resultsContainer.innerHTML=a.getLoader()}async fetchAndDisplayActivityData(){await this.fetchActivityData(),this.displayActivityData(this.activityData)}async fetchActivityData(){this.displayLoader();let e={"Content-Type":"application/json"};wpApiSettings&&wpApiSettings.nonce&&(e["X-WP-Nonce"]=wpApiSettings.nonce);try{"pt"==this.pageLanguage&&(this.pageLanguage="");const t=await fetch("/wp-json/perfect-grammar/v1/activity/archive?lang="+this.pageLanguage,{method:"GET",headers:e});if(!t.ok)throw new Error("Activity data not found");this.activityData=await t.json()}catch(e){throw e}}async handleFilterChange(){await this.fetchActivityData();const e=this.getFilteredActivityData(this.selectedLevel,this.searchTerm,this.isOnlySaved,this.selectedCategories);this.displayActivityData(e)}getFilteredActivityData(e=null,t="",s,i=[]){let n=this.activityData;return e&&(n=n.filter((t=>t.level.includes(e)))),t&&(n=n.filter((e=>e.title.toLowerCase().includes(t)))),s&&(n=n.filter((e=>e.isSaved))),i.length&&(n=n.filter((e=>e.category.some((e=>i.includes(e.toLowerCase())))))),n}handleSearch(){let e=this.activityData;this.searchTerm&&(e=e.filter((e=>e.title.toLowerCase().includes(this.searchTerm)))),this.displayActivityData(e)}displayActivityData(e){e&&0!==e.length?this.resultsContainer.innerHTML=e.map((({title:e,level:s,permalink:i,postId:n,estimatedTime:a,isSaved:c,savedId:r,category:o,tags:d})=>`\n        <a href="${i}"><div class="class-activity-post-item">\n                     <div class="class-activity-saved">\n        \n                     ${t.getSavedButtonHTML(n,c,r)}\n                  \n                     </div>\n                     <span class="class-activity-entry-categories">\n                              \n                                 ${o} </span>\n                              \n\n                     <h2 class="title-text">${e}</h2>\n\n                     <div class="class-activity-entry-meta">\n                              <span class="class-levels">Niveau :\n                                       <span class="meta-item-levels">${s}</span>\n                              </span>\n                     \n                     <div class="meta-item-estimated-time"><span class="dashicons dashicons-clock"></span> ${a} minutes</div>\n                        \n                     </div>\n                     <ul class="grid-tags">\n                           ${d.map((e=>`<p class="tag-item">\n                               ${e}\n                             </p>`)).join("")} \n                     </ul>\n                  </div>\n               \n  \n         </div></a>`)).join(""):this.resultsContainer.innerHTML="<p>Aucune activités trouvées</p>"}}})),document.addEventListener("DOMContentLoaded",(()=>{document.getElementById("activity-container")&&new class{constructor(){this.activityContainer=document.getElementById("activity-container"),this.pageLanguage=document.documentElement.lang.substring(0,2),this.randomButton=document.getElementById("random-activity-button"),this.activityContainerSecond=document.getElementById("activity-container-second"),this.shareButton=new c,this.attachEventListeners(),this.activityId=this.activityContainer.dataset.activityId,this.fetchExerciseData().then(this.displayExerciseData.bind(this)),this.savedPostManager=new i}attachEventListeners(){this.activityContainer.addEventListener("click",(e=>{const t=e.target.closest(".label-pf__checkbox");t&&this.handleClickSaved(t)})),this.randomButton.addEventListener("click",(()=>{"pt"==this.pageLanguage&&(this.pageLanguage=""),window.location.href="/wp-json/perfect-grammar/v1/activity/random?lang="+this.pageLanguage}))}handleClickSaved(e){const t=e.id.replace("_save",""),s=document.querySelector('meta[name="titleRaw"]'),i=s?"(Activity) "+s.getAttribute("content"):t;e.checked?this.savedPostManager.createSavedPost(t,e,i):this.savedPostManager.deleteSavedPost(e.getAttribute("saved-id"),e)}async fetchExerciseData(){const e=wpApiSettings.nonce;try{const t=await fetch(`/wp-json/perfect-grammar/v1/activity/${this.activityId}`,{method:"GET",headers:{"Content-Type":"application/json","X-WP-Nonce":e}});if(!t.ok)throw new Error("Exercise not found");return await t.json()}catch(e){return console.error("Error fetching activity data:",e.message),null}}displayExerciseData(e){if(!e)return void(this.activityContainer.innerHTML="<p>Exercise not found</p>");const{title:s,category:i,tags:n,level:a,estimatedTime:c,postId:r,isSaved:o,savedId:d,instructions:l}=e;this.activityContainer.innerHTML=`\n       \n        <div class="title-banner hide-large">\n        <h1 class="main-title-large">${s}</h1>\n        </div>\n\n        <div class="top-activity">\n        <div class="level-activity">${a.join("/")}</div>\n        \n        <div class="save-done-button">\n        ${t.getSavedButtonHTML(r,o,d)} \n        </div>\n        </div>\n        <div class="title-banner hide-mobile">\n        <h1 class="main-title-large ">${s}</h1>\n        </div>\n  \n        <div class="activity-instructions">\n        <h2> Instruction professeurs </h2>\n        ${l}</div>\n\n        <div class="activity-meta"> \n        <div class="estimated-time"><span class="dashicons dashicons-clock"></span> ${c} minutes</div>\n        <div class="category">${i}</div>\n        <div class="copy-link">${this.shareButton}</div>\n        </div>\n\n\n\n         <div class="divider div-transparent div-dot"></div>\n          \n      `,this.activityContainerSecond.innerHTML=`\n       \n         \n      <ul class="grid-tags">${n.map((e=>`<p class="tag-item">${e}</p>`)).join("")}</ul>\n        <div class="divider div-transparent div-dot"></div>\n\n        <div class="actions-footer">\n        <div class="copy-link">${this.shareButton}</div>\n\n       <div class="">\n        ${t.getSavedButtonHTML(r,o,d)} \n      </div>\n        \n        \n       </div>\n       </div>\n      `}}}))})();