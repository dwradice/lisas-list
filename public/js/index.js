import '@babel/polyfill';
import 'bootstrap';
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { postProduct } from './listProduct';
import { updateProduct, deleteProduct } from './editProduct';
import './masonry';

// DOM ELEMENTS
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logOutBtn = document.querySelector('.nav-link-logout');
const userData = document.querySelector('.user-data');
const userPassword = document.querySelector('.user-password');
const listProduct = document.querySelector('.list-product');
const deleteProductBtn = document.querySelector('.delete-product-btn');
const updateProductBtn = document.querySelector('.update-product-btn');

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
    const photo = document.getElementById('product-photo-upload').files[0];
    const form = new FormData();
    form.append('name', document.getElementById('list-name').value);
    form.append('price', document.getElementById('list-price').value);
    form.append('category', document.getElementById('list-category').value);
    if (photo) {
      form.append('photo', photo);
    }
    postProduct(form);
  });
}

if (updateProductBtn) {
  updateProductBtn.addEventListener('click', e => {
    e.preventDefault();

    const id = updateProductBtn.dataset.id;
    const photo = document.getElementById('edit-product-photo-upload').files[0];

    const form = new FormData();
    form.append('name', document.getElementById('edit-name').value);
    form.append('price', document.getElementById('edit-price').value);
    form.append('category', document.getElementById('edit-category').value);
    if (photo) {
      form.append('photo', photo);
    }

    updateProduct(form, id);
  });
}

if (deleteProductBtn) {
  deleteProductBtn.addEventListener('click', e => {
    e.preventDefault();

    const id = deleteProductBtn.dataset.id;

    deleteProduct(id);
  });
}
