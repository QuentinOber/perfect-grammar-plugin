class PopupLoginRedirect {
    constructor() {
        this.loginPopup = this.createLoginPopup()
        document.body.appendChild(this.loginPopup)
        const closeButton = document.getElementById('closePopup-pf')
        closeButton.addEventListener('click', this.hide.bind(this))
    }

    createLoginPopup() {
        const loginPopup = document.createElement('div')
        loginPopup.id = 'loginPopup-pf'
        loginPopup.style.display = 'none'
        loginPopup.innerHTML = `
            <div>
              <span id="closePopup-pf">&times;</span>
              <h2>Login Required</h2>
              <p>Connecte-toi pour sauvegarder tes exercices</p>
              <a href="/login"><button id="loginButton-pf" class="btn">Login</button></a>
            </div>
          `
        const closeButton = loginPopup.querySelector('#closePopup-pf')
        closeButton.addEventListener('click', this.hide.bind(this))
        return loginPopup
    }

    show() {
        this.loginPopup.style.display = 'block'
    }

    hide() {
        this.loginPopup.style.display = 'none'
    }
}

export default PopupLoginRedirect
