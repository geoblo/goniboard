// 글 수정 시
document.querySelector('#edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = e.target.id.value;
  const title = e.target.title.value;
  const content = e.target.content.value;
  if (!title) {
    return alert('제목을 입력하세요');
  }
  try {
    const result = await axios.patch(`/post/${id}`, { title, content });
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