// 휴대폰 인증 토큰 전송API를 요청해주세요.
let global_phone;

const getValidationNumber = async () => {
  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  global_phone =
    document.getElementById("PhoneNumber01").value +
    document.getElementById("PhoneNumber02").value +
    document.getElementById("PhoneNumber03").value;

  axios
    .post("http://localhost:4000/tokens/phone", {
      phone: global_phone,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      console.error("서버 요청 중 오류 발생:", error);
    });
};

// 휴드폰 인증 완료 API를 요청해주세요.
const submitToken = async () => {
  token = document.getElementById("TokenInput").value;
  axios
    .patch("http://localhost:4000/tokens/phone", {
      phone: global_phone,
      token: token,
    })
    .then((res) => {
      if (res.data === true) {
        console.log("핸드폰 인증 완료");
      } else {
        console.log("핸드폰 인증 완료 실패");
      }
    })
    .catch((error) => {
      console.error("서버 요청 중 오류 발생:", error);
    });
};

// 회원 가입 API를 요청해주세요.
const submitSignup = async (phone) => {
  console.log("회원 가입 이메일 전송");
  const name = document.getElementById("SignupName").value;
  const personal =
    document.getElementById("SignupPersonal1").value +
    document.getElementById("SignupPersonal2").value;
  const prefer = document.getElementById("SignupPrefer").value;
  const email = document.getElementById("SignupEmail").value;
  const pwd = document.getElementById("SignupPwd").value;

  try {
    const response = await axios.post("http://localhost:4000/users", {
      signup: { name, global_phone, personal, prefer, email, pwd },
    });
    console.log("회원 가입 성공");
  } catch (error) {
    console.error("회원 가입 API 요청 중 오류 발생:", error);
  }
};
