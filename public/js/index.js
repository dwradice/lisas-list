import '@babel/polyfill';
import 'bootstrap';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { postProduct } from './listProduct';
import './masonry';

// DOM ELEMENTS
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logOutBtn = document.querySelector('.nav-link-logout');
const userData = document.querySelector('.user-data');
const userPassword = document.querySelector('.user-password');
const listProduct = document.querySelector('.list-product');

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (userData) {
  userData.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('update-name').value);
    form.append('email', document.getElementById('update-email').value);
    form.append('photo', document.getElementById('user-photo-upload').files[0]);

    console.log(form);

    updateSettings(form, 'data');
  });
}

if (userPassword) {
  userPassword.addEventListener('submit', e => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}

if (listProduct) {
  listProduct.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('list-name').value;
    const price = document.getElementById('list-price').value;
    const category = document.getElementById('list-category').value;

    postProduct(name, price, category);
  });
}
