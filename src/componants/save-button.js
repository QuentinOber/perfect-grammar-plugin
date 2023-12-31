class SavedButton {
    static getSavedButtonHTML(postId, isSaved, savedId) {
        return `
        <div class="save-checkbox-wrapper exercise-item__save"> <label class="label-pf">       
        <input  class="label-pf__checkbox" type="checkbox" id="${postId}_save" ${
            isSaved ? 'checked' : ''
        } saved-id="${savedId}"/>
        <span class="label-pf__text">
          <span class="label-pf__check"><svg class="save-icon" "id="save-icon" data-name="Group 23" xmlns="http://www.w3.org/2000/svg" width="15.33" height="20.094" viewBox="0 0 15.33 20.094">
          <path id="Path_52" data-name="Path 52" d="M517.434,385.807a1.63,1.63,0,0,1-.953-.311,1.77,1.77,0,0,1-.725-1.441c0-2.294-.04-10.739-.064-14.623a3.809,3.809,0,0,1,1.086-2.7,3.4,3.4,0,0,1,2.426-1.023h8.3a3.611,3.611,0,0,1,3.512,3.692c0,3.871,0,13.037-.023,14.533a1.771,1.771,0,0,1-.726,1.405,1.626,1.626,0,0,1-1.45.232.666.666,0,0,1-.219-.119c-2.072-1.694-4.38-3.529-5.179-4.095-.8.579-3.148,2.483-5.249,4.239a.669.669,0,0,1-.213.12A1.646,1.646,0,0,1,517.434,385.807Zm1.769-18.764a2.084,2.084,0,0,0-1.482.631,2.474,2.474,0,0,0-.7,1.751c.023,3.885.066,12.335.064,14.632a.426.426,0,0,0,.171.358.3.3,0,0,0,.186.061c5.458-4.561,5.7-4.556,5.985-4.555.273,0,.509.006,5.887,4.4h0a.3.3,0,0,0,.179-.061.427.427,0,0,0,.171-.348h0c.028-1.484.026-10.64.023-14.507a2.281,2.281,0,0,0-2.181-2.362Z" transform="translate(-515.691 -365.713)" stroke-width="2"/>        </svg>
          </span>
        </span>
      </label>
    </div> `
    }
}

export default SavedButton
