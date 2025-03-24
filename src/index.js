const isLoggedIn = true;
const loginSection = document.querySelector('#login-section');

if (!isLoggedIn) {
  loginSection.style.display = 'block';
} else {
  loginSection.style.display = 'none';
}