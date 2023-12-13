// 글 등록 시
document.querySelector('#write-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const content = e.target.content.value;
  // if (!title) {
  //   return alert('제목을 입력하세요');
  // }
  try {
    const formData = new FormData(); // multipart/form-data 타입으로 보냄
    formData.append('title', title);
    formData.append('content', content);
    formData.append('img', e.target.img.files[0]);

    // const result = await axios.post('/post/write', { title, content });
    const result = await axios.post('/post/write', formData);
    console.log(result.data);

    if (!result.data.flag) {
      return alert(result.data.message);
    }
    location.href = '/post';
  } catch (err) {
    console.error(err);
  }
  e.target.title.value = '';
  e.target.content.value = '';
});