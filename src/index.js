import { Login } from './components/util.js';
import { Register } from './components/login/Register.js';

customElements.define('login-panel', Login);
customElements.define('register-panel', Register);

const swapper = {
    text: document.querySelector('#swapper-text'),
    link: document.querySelector('#swapper-link')
};

function handleTemplate() {
    const login = document.querySelector('#login-panel');
    const register = document.querySelector('#register-panel');
    
    
    const isLoginVisible = login.style.display !== "none";

    login.style.display = isLoginVisible ? "none" : "block";
    register.style.display = isLoginVisible ? "block" : "none";

    swapper.text.textContent = isLoginVisible ? "Already have an account?" : "Don't have an account?";
    swapper.link.textContent = isLoginVisible ? "Login Here" : "Register Here";
}

document.addEventListener('DOMContentLoaded', () => {
    handleTemplate();

    swapper.link.addEventListener('click', handleTemplate);
});