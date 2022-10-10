let userId = document.querySelector('#userId');
let checkId = document.querySelector('#checkId'); //아이디 중복 확인 버튼
let joinBtn = document.querySelector('#joinBtn');
let tryConform = document.querySelector('#tryConform');
let AuthCodeBox = document.querySelector('#AuthCodeBox');
let sendEmail = document.querySelector('#sendEmail');
let userEmail = document.querySelector('#userEmail');
let pwForm = document.querySelector('#userPW');
let re_pwForm = document.querySelector('#re_password');
let emailCheck = document.querySelector('#emailCheck');
let registerFrm = document.querySelector('#registerFrm');
let IdCheck = document.querySelector('#IdCheck'); // 아이디 중복 체크 유무 확인용 hidden 태그
let EmailKeeper;
let sendedCode="hello";


checkId.addEventListener('click', (event) => { //아이디 중복 검사 리스너
    console.log("아이디 중복 검사 리스너");
    if(userId.value!=""){
        let getUserId = document.querySelector('#userId').value;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/IdCheck',true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        let data ="UserId="+getUserId;
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                let result = xhr.response;
                IdCheck.value = result;
                   if(result == 'true'){
                    alert("사용 가능한 아이디 입니다.");
                    checkId.disabled = true;
                    checkId.value = "완료";
                    checkId.style.background ="#4e73df"
                   }else{
                    alert("이미 가입한 아이디가 있습니다.");
                   }
            }
        }
        xhr.send(data);
    }else{
        alert("아이디를 입력해주세요.");
    }
});
userId.addEventListener('keyup', (event) => { //중복 확인 후, 수정 했을 때 다시 확인 하게 하는 코드
    checkId.disabled = false;
    IdCheck.value = false;
    checkId.value = "중복 확인";
    checkId.style.background ="#23d2e2"
});
sendEmail.addEventListener('click', (event) => { //이메일 코드 발송
    if(CheckEmail(userEmail.value) == false){
     alert("올바른 이메일을 입력해주세요.");
    }else{
        alert("코드를 발송하였습니다. 이메일을 확인해주세요!");
            userEmail.readOnly = true;
            let xhr = new XMLHttpRequest();
            let data ="userEmail="+userEmail.value;
            xhr.open('POST', '/sendEmail',true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function(){
                if(xhr.readyState === 4 && xhr.status === 200){
                    let result = xhr.response;
                    console.log(result);
                    sendedCode = result;
                }
            }
            xhr.send(data);
    }
});


tryConform.addEventListener('click', (event) => {//이메일 인증 코드 받기
    console.log('받은 코드: '+ sendedCode);
    if(AuthCodeBox.value==""){
        alert("인증 코드를 입력해주세요!");
        return;
    }else if(sendedCode==AuthCodeBox.value){
        emailCheck.value="true";
        alert("인증이 완료 되었습니다!");
        tryConform.value = "완료"
        tryConform.disabled = true;
        sendEmail.value = "완료"
        sendEmail.disabled = true;
        AuthCodeBox.disabled = true;
        sendEmail.style.background ="#4e73df"
        tryConform.style.background ="#4e73df"
        return;
    }else if(sendedCode!=AuthCodeBox.value){
        alert("인증 코드를 다시 확인 해주세요!");
        return;
    }
});



function CheckPass(str){
    let reg1 =  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
    return(reg1.test(str));
 };
 function CheckEmail(str){
    let reg2 = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return (reg2.test(str));
 };


joinBtn.addEventListener('click', (event) => { //회원가입 유효성 검사
    console.log("!!!!!!!!!!!!!!!!!!!!!!!: "+sendedCode);
    if(IdCheck.value=="false"){
        alert("아이디 중복 확인을 해주세요!");
        return;
    }else if(emailCheck.value=="false"){
        alert("이메일 인증을 해주세요!");
        return;
    }else if(userId.value==""){
        alert("아이디를 입력해주세요!");
        userId.focus();
        return;
    }else if(userEmail.value==""){
        alert("이메일을 입력해주세요!");
        userEmail.focus();
        return;
    }else if(pwForm.value==""){
        alert("비밀번호를 입력해주세요!");
        pwForm.focus();
        return;
    }
    else if(re_pwForm.value==""){
        alert("비밀번호 확인을 입력해주세요!");
        re_pwForm.focus();
        return;
    }
    else if(CheckPass(pwForm.value) == false){
        alert("비밀번호는 영문+숫자 6자를 조합하여 입력해주세요 !");
        pwForm.focus();
        return;
    }else if(re_pwForm.value==""){
        alert("비밀번호가 동일하지 않습니다!");
        re_pwForm.focus();
        return;
    }else{
        registerFrm.submit();
    }
});
