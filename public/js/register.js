// 회원 가입 시
document.querySelector('#register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = e.target.username.value;
  const password = e.target.password.value;
  // if (!username) {
  //   return alert('아이디를 입력하세요');
  // }
  // if (!password) {
  //   return alert('비밀번호를 입력하세요');
  // }
  try {
    const result = await axios.post('/user/register', { username, password });

    if (!result.data.flag) {
      return alert(result.data.message);
    }
    location.href = '/';
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = '';
  e.target.password.value = '';
});