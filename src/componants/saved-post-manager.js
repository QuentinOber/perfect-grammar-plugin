import PopupLoginRedirect from "./popup-login-redirect";

class SavedPostManager {
  constructor() {
    this.loginPopup = new PopupLoginRedirect();
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
        "X-WP-Nonce": nonce,
      },
      body: JSON.stringify({
        title: `Saved post : ${title}`,
        status: "publish",
        meta: { saved_post_id: postId },
      }),
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
        "X-WP-Nonce": nonce,
      },
    });
    if (!response.ok) throw new Error("Error deleting saved post");
    checkboxElement.removeAttribute("saved-id");
  }
}

export default SavedPostManager;
