
import React, { useState } from 'react'  
import  "../static/css/vendor/bootstrap.min.css";
import  "../static/css/styles.min.css";
import  "../static/css/userInfo/userJoin.css";

function UserJoin(props) {
	let checkId = document.querySelector('#checkId'); //아이디 중복 확인 버튼
	let sendEmail = document.querySelector('#sendEmail');
	let tryConform = document.querySelector('#tryConform');
	let passwordForm = document.querySelector('#userPW');
	let re_passwordForm = document.querySelector('#re_password');
	let userEmailForm = document.querySelector('#userEmail');
	

	const [inputs, setInputs] = useState({  
        userId: '',
        userEmail: '',
		AuthCodeBox: '',
		userPW: '',
		re_password: '',
		duplicationCheckState: "false",
		checkIdValue:'중복 확인',
		checkIdDisable:false,
		sendedCode:'',
		emailCheck:false,
		userEmailDisabled:false,
		tryConformValue:"인증하기",
		tryConformDisabled:false,
		sendEmailDisabled:false,
		AuthCodeBoxDisabled:false,
		sendEmailValue:"코드 발송",
    });

	const { userId, userEmail, AuthCodeBox, userPW, re_password} = inputs; 

    const onChange = (e) => {//input에 name을 가진 요소의 value에 이벤트를 걸었다
		const { name, value } = e.target   // 변수를 만들어 이벤트가 발생했을때의 value를 넣어줬다
		const nextInputs = { ...inputs,  [name]: value,}//스프레드 문법으로 기존의 객체를 복사한다.
		
		setInputs(nextInputs);       //만든 변수를 seInput으로 변경해준다.
    }


	function idCheck() {
		if(inputs.userId!==""){
			let getUserId = inputs.userId;
			let xhr = new XMLHttpRequest();
			xhr.open('POST', '/IdCheck',true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			let data ="UserId="+getUserId;
			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4 && xhr.status === 200){
					let result = xhr.response;
					inputs.IdCheck = result;
					console.log("!!!!!!!!!!!!!"+result);
					   if(result === 'true'){
						alert("사용 가능한 아이디 입니다.");
						const nextInputs = { ...inputs,  ["checkIdDisable"]: true, ["checkIdValue"]: "완료",["duplicationCheckState"]:"true",}
						setInputs(nextInputs); 
						checkId.style.background ="#965C3C"
					   }else{
						alert("이미 가입한 아이디가 있습니다.");
					   }
				}
			}
			xhr.send(data);
		}else{
			alert("아이디를 입력해주세요.");
		}
	}
	function letsSendEmail() {
		if(CheckEmail(inputs.userEmail) === false){
			alert("올바른 이메일을 입력해주세요.");
		   }else{
			   alert("코드를 발송하였습니다. 이메일을 확인해주세요!");
				   let xhr = new XMLHttpRequest();
				   let data ="userEmail="+inputs.userEmail;
				   xhr.open('POST', '/sendEmail',true);
				   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				   xhr.onreadystatechange = function(){
					   if(xhr.readyState === 4 && xhr.status === 200){
						   let result = xhr.response;
						   const nextInputs = { ...inputs,  ["sendedCode"]: result}
							setInputs(nextInputs);
						   console.log("result: "+result);
						   console.log("sendedCode: "+inputs.sendedCode);
					   }
				   }
				   xhr.send(data);
		   }
	}
	function CheckPass(str){
		let reg1 =  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
		return(reg1.test(str));
	 };
	 function CheckEmail(str){
		let reg2 = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
		return (reg2.test(str));
	 };
	
	
	const handleKeyPress = (e) => {
		console.log("222222222222222");
		const nextInputs = { ...inputs,  ["checkIdDisable"]: false,["checkIdValue"]: "중복 확인",["duplicationCheckState"]:"true",}
		checkId.style.background ="#FC9F6B"
		setInputs(nextInputs); 
		
	  };
	  function letsTryConform() {
		console.log('받은 코드: '+ inputs.sendedCode);
		if(inputs.AuthCodeBox===""){
			alert("인증 코드를 입력해주세요!");
			return;
		}else if(inputs.sendedCode===inputs.AuthCodeBox){
			const nextInputs = { ...inputs,  ["emailCheck"]: true,["userEmailDisabled"]:true,["tryConformValue"]:"완료",["tryConformDisabled"]:true,["sendEmailValue"]:"완료",["sendEmailDisabled"]:true,["AuthCodeBoxDisabled"]:true,}
			setInputs(nextInputs); 
			console.log();
			alert("인증이 완료 되었습니다!");
			sendEmail.style.background ="#965C3C"
			tryConform.style.background ="#965C3C"
			return;
		}else if(inputs.sendedCode!==AuthCodeBox.value){
			alert("인증 코드를 다시 확인 해주세요!");
			return;
		}
	  }
	  function letsJoin() {
		if(inputs.duplicationCheckState==="false"){
			alert("아이디 중복 확인을 해주세요!");
			return;
		}else if(inputs.userId===""){
			alert("아이디를 입력해주세요!");
			userId.focus();
			return;
		}else if(inputs.userEmail===""){
			alert("이메일을 입력해주세요!");
			userEmailForm.focus();
			return;
		}else if(inputs.emailCheck===false){
			alert("이메일 인증을 해주세요!");
			return;
		}else if(inputs.userPW===""){
			alert("비밀번호를 입력해주세요!");
			passwordForm.focus();
			return;
		}
		else if(inputs.re_password===""){
			alert("비밀번호 중복 확인을 입력해주세요!");
			re_passwordForm.focus();
			return;
		}
		else if(CheckPass(inputs.userPW) === false){
			alert("비밀번호는 영문+숫자 6자를 조합하여 입력해주세요 !");
			passwordForm.focus();
			return;
		}else if(inputs.re_password !==inputs.userPW){
			alert("비밀번호가 동일하지 않습니다!");
			re_passwordForm.focus();
			return;
		}else{
			
			fetch("/register", {
				method: 'post',
				headers: {
					'content-type': 'application/json'
				},
				body : JSON.stringify({
					userId : inputs.userId,
					userPW : inputs.userPW,
					userEmail : inputs.userEmail
				})
			}).then(res => res.json())
				.then(resonse => {
					if(resonse===true){
						window.location.replace("/loginForm");
					}else{
						alert("다시 시도해주세요");
					}
				});
		}
	  }

    return (
	<div className="userJoinOuter">
		<div className="form-box login-register-form-element" id="userJoinInner">
			<h1 className="form-box-title" style={{color:"#643B25", marginBottom:"20px", fontSize:"50px"}}>Coffee Studio</h1>
			<h2 className="form-box-title">계정 만들기</h2>
			<form className="form" id="registerFrm" name="register-page" style={{marginTop:'30px'}}>
				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="text" id="userId" name="userId" onChange={onChange} onKeyPress={handleKeyPress} placeholder="아이디" style={{width:"250px"}}/>
							<input type="button" className="button medium primary" disabled={inputs.checkIdDisable} name="checkId" id="checkId" onClick={idCheck} style={{width:"80px", marginLeft:"10px"}}  value={inputs.checkIdValue}/>
						</div>
					</div>
				</div>

				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="text" id="userEmail" name="userEmail" onChange={onChange} placeholder="이메일" disabled={inputs.userEmailDisabled} style={{width:"250px"}}/>
							<input type="button" className="button medium primary" id="sendEmail" onClick={letsSendEmail} style={{width:"80px", marginLeft:"10px"}} disabled={inputs.sendEmailDisabled} value={inputs.sendEmailValue}/>
						</div>
					</div>
				</div>

				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="text" id="AuthCodeBox"  name="AuthCodeBox" onChange={onChange} placeholder="인증 코드" disabled={inputs.AuthCodeBoxDisabled} style={{width:"250px"}}/>
							<input type="button" className="button medium primary" onClick={letsTryConform} id="tryConform" disabled={inputs.tryConformDisabled} style={{width:"80px", marginLeft:"10px"}} value={inputs.tryConformValue}/>
							<input type="hidden" id="emailCheck" value={inputs.emailCheck}/>
						</div>
					</div>
				</div>
				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="password" id="userPW" name="userPW" onChange={onChange} placeholder="비밀번호"/>
						</div>
					</div>
				</div>

				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="password" id="re_password" name="re_password" onChange={onChange} placeholder="비밀번호 확인"/>
						</div>
					</div>
				</div>

				<div className="form-row">
					<div className="form-item">
						<input type="button" className="button medium secondary"  onClick={letsJoin} id="joinBtn" value="가입하기"/>
					</div>
				</div>
			</form>
		</div>
	</div>

    );
}

export default UserJoin;