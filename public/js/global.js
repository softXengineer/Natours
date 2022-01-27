// /*eslint-disable*/
// import '@babel/polyfill';
// import axios from 'axios';

// const hideAlert = () => {
//   const el = document.querySelector('.alert');
//   if (el) el.parentElement.removeChild(el);
// };

// const showAlert = (type, msg) => {
//   hideAlert();
//   const alert = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector('body').insertAdjacentHTML('afterbegin', alert);
//   window.setTimeout(hideAlert, 5000);
// };

// const login = async (email, password) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:3000/api/v1/users/login',
//       data: {
//         email,
//         password
//       }
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Logged in successfully!');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

// const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       url: 'http://127.0.0.1:3000/api/v1/users/login'
//     });
//     if (res.data.status === 'success') location.reload(true);
//   } catch (err) {
//     showAlert('error', 'Error logging out! Try again.');
//   }
// };
