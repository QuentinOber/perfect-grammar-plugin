import PopupLoginRedirect from "./popup-login-redirect";

class DonePostManager {
  constructor() {
    this.loginPopup = new PopupLoginRedirect();
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
        "X-WP-Nonce": nonce,
      },
      body: JSON.stringify({
        title: `Saved post : ${title}`,
        status: "publish",
        meta: { done_post_id: postId },
      }),
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
        "X-WP-Nonce": nonce,
      },
    });
    if (!response.ok) throw new Error("Error deleting done post");
    checkboxElement.removeAttribute("doneId");
  }
}

export default DonePostManager;
