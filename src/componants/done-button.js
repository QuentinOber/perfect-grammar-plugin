class DoneButton {
    static getDoneButtonHTML(postId, isDone, doneId) {
        return `
        <div class="done-checkbox-wrapper  exercise-item__done">
        <input type="checkbox" id="${postId}_checkbox" class="validate-checkbox" ${
            isDone ? 'checked' : ''
        } doneid="${doneId}" >
        <label for="${postId}_checkbox">
        <div class="tick_mark">
         </label>
            </div></div>
        
        `
    }
}

export default DoneButton
