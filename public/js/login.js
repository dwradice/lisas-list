const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:1032/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
