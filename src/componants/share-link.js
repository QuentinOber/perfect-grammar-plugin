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
      container.addEventListener("click", (event) => {
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

    navigator.clipboard
      .writeText(url)
      .then(() => {
        target.innerHTML = `<span class="dashicons dashicons-admin-links"></span> Lien copié !`;
      })
      .catch((error) => {
        alert("An error occurred: " + error);
      });
  }

  toString() {
    return this.button.outerHTML;
  }
}

export default ShareButton;
