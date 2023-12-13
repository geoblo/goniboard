// 라우터에 접근 권한을 제어하는 미들웨어 만들기
// 로그인한 사용자는 회원 가입과 로그인 라우터에 접근하면 안됨(이미 로그인을 했으니까)
// 로그인하지 않은 사용자는 로그아웃 라우터에 접근하면 안됨

// 로그인 중이면 req.isAuthenticated()가 true이고, 그렇지 않으면 false

// 로그인해야 볼 수 있는 곳은 isLoggedIn 미들웨어 사용
// 예: 마이페이지, 프로필 등
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인 필요'); // 401(비인증) 또는 403(미승인) 사용
  }
};

// 로그인하지 않은 사람에게만 보여야 하면 isNotLoggedIn 미들웨어 사용
// 예: 회원 가입, 로그인 등
const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};

// Quiz: 회원 가입 및 로그인 시 사용자가 아이디, 비번을 전송하고 있는데 
// 아이디와 비번이 비어있으면 '내용을 입력하세요' 라고 응답해주는 미들웨어 만들어보기
const checkIdAndPw = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.json({
      flag: false,
      message: '내용을 입력하세요'
    });
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
  checkIdAndPw
};