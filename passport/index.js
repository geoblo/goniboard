const passport = require('passport');
const local = require('./localStrategy'); // 로컬 로그인 전략(=로그인 시 어떻게 처리할지 동작)
const { ObjectId } = require('mongodb');

const { client } = require('../database');
const db = client.db('board'); // board 데이터베이스에 연결

// passport를 이해하는 핵심 부분 작성
module.exports = () => {
  // req.login()으로 로그인 시 실행되며, 세션 객체(req.session)에 어떤 데이터를 저장할지 정함
  // 즉, 세션 만들기가 자동 실행되고 쿠키도 알아서 보내줌
  passport.serializeUser((user, done) => {
    // console.log(user); // 로그인 중인 사용자 정보

    // 첫번째 인자값: 에러 발생 시 에러 값
    // 두번째 인자값: 세션에 저장할 데이터(일단 서버 메모리에 저장됨)
    // 로그인 시 사용자 데이터를 세션에 저장하는데 세션에 사용자 정보를 모두 저장하면
    // 세션의 용량이 커지고 데이터 일관성에 문제가 발생하므로 아이디만 저장
    done(null, user._id); // _id만 저장
    // done(null, { id: user._id, username: user.username });
  });

  // 각 요청마다 실행되며, passport.session 미들웨어가 이 메서드를 호출
  // serializeUser의 done의 두번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 됨
  // 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회
  // 조회한 정보를 req.user에 저장하므로 앞으로 req.user를 통해 로그인한 사용자의 정보를 가져올 수 있음
  // 세션 쿠키를 까서 세션 ID로 세션 객체를 찾아서 그 안에 데이터를 첫번째 매개변수로 전달
  passport.deserializeUser(async (id, done) => {
    // console.log(id); // 세션에 저장한 내용

    try {
      const user = await db.collection('user').findOne({ _id: new ObjectId(id) });
      done(null, user); // req.user에 저장
      // 이제 아무데서나 req.user를 쓰면 현재 로그인한 사용자의 정보를 쓸 수 있음
    } catch (err) {
      done(err);
    }
  });

  local();
};

// 전체 과정
// 로그인 과정
// 1. /user/login 라우터를 통해 로그인 요청이 들어옴
// 2. 라우터에서 passport.authenticate 메서드 호출
// 3. 로그인 전략(LocalStrategy) 수행
// 4. 로그인 성공 시 사용자 정보 객체와 함께 req.login 호출
// 5. req.login 메서드가 passport.serializeUser 호출
// 6. req.session에 사용자 아이디만 저장해서 세션 생성
// 7. express-session에 설정한 대로 브라우저에 connect.sid 세션 쿠키 전송
// 8. 로그인 완료

// 1~4번은 아직 구현하지 않았으며, 로컬 로그인을 구현하면서 상응하는 코드를 보게 될 것

// 다음은 로그인 이후의 과정
// 1. 요청이 들어옴(어떠한 요청이든 상관없음)
// 2. 라우터에 요청이 도달하기 전에 passport.session 미들웨어가 passport.deserializeUser 메서드 호출
// 3. connect.sid 세션 쿠키를 읽고 세션 ID로 세션 객체(req.session)를 찾아서
// 4. 그 안에 저장된 아이디로 데이터베이스에서 사용자 조회
// 5. 조회된 사용자 정보를 req.user에 저장
// 6. 라우터에서 req.user 객체 사용 가능