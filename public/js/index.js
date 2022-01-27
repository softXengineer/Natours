/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { bookTour } from './stripe';
import { updateSettings } from './updateSettings';

const formLogin = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const formUserData = document.querySelector('.form-user-data');
const formUserSettings = document.querySelector('.form-user-settings');
const formBtn = document.querySelector('.btn__form--save');
const bookToorBtn = document.getElementById('book-tour');

if (formLogin) {
  formLogin.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (formUserData) {
  formUserData.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (formUserSettings) {
  formUserSettings.addEventListener('submit', async e => {
    e.preventDefault();
    formBtn.textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateSettings(
      { currentPassword, password, confirmPassword },
      'password'
    );
    formBtn.textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookToorBtn) {
  bookToorBtn.addEventListener('click', e => {
    bookToorBtn.textContent = 'Proccessing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
