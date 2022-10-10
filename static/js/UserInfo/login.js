let userId = document.querySelector('#userId');
let userPw = document.querySelector('#userPw'); //아이디 중복 확인 버튼
let loginBtn = document.querySelector('#loginBtn');

loginBtn.addEventListener('click', (event) => { //회원가입 유효성 검사

    if(userId.value==""){
        alert("아이디를 입력해주세요.");
        return;
    }else if(userPw.value=="false"){
        alert("비밀번호를 입력해주세요");
        return;
    }else{
       fetch("/login", {
           method: 'post',
           headers: {
               'content-type': 'application/json'
           },
           body : JSON.stringify({
               username : userId.value,
               userPW : userPw.value
           })
       }).then(res => res.json())
           .then(token => {
                if(token.Authorization==null){
                    alert("아이디 혹은 비밀번호를 확인해주세요.");
                }else{
                   alert("로그인 되었습니다");
                   localStorage.setItem('jwt', token.Authorization);

                    const form = document.createElement('form');
                    form.action="/home1";
                    form.method="POST";
                    form.innerHTML = "<input name='Authorization' value='" + token.Authorization + "'>";

                    document.body.append(form);

                    form.submit();
//                   fetch("/home1", {
//                      method: 'get',
//                      headers: {
//                          'Authorization': token.Authorization
//                      }
//                  }).then(response => response)
//                  .then(data =>{
//                         console.log(data);
//                         console.log(data.url);
//                  })
//                  .catch(error => console.log(error));
                }

           });
    }
});
