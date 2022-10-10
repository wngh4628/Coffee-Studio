
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import  "../static/css/vendor/bootstrap.min.css";
import  "../static/css/styles.min.css";
import  "../static/css/userInfo/userLogin.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Header2(props) {
	let userId = document.querySelector('#userId');
	let userPw = document.querySelector('#userPw'); //아이디 중복 확인 버튼
	const movePage = useNavigate();

	const [inputs, setInputs] = useState({  
        username: '',
        userPW: '',
    });

	const onChange = (e) => {
		const { name, value } = e.target  
		const nextInputs = { ...inputs,  [name]: value,}
		setInputs(nextInputs);      
    }
	function moveOtherPage() { 
        console.log(props.BoardData);
        movePage('/join');
      }

	function letsLogin() {
		if(inputs.userId===""){
			Swal.fire({
				text:'아이디를 입력해주세요.',
				icon: 'warning',
				confirmButtonText: '완료', // confirm 버튼 텍스트 지정
				confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
			  });
			return;
		}else if(inputs.userPw==="false"){
			Swal.fire({
				text:'비밀번호를 입력해주세요.',
				icon: 'warning',
				confirmButtonText: '완료', // confirm 버튼 텍스트 지정
				confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
			  });
			return;
		}else{
		   fetch("/letslogin", {
			   method: 'post',
			   headers: {
				   'content-type': 'application/json'
			   },
			   body : JSON.stringify({
					userId : inputs.username,
				   userPW : inputs.userPW
			   })
		   }).then(res => res.json())
			   .then(response => {
				console.log(response.Authorization);
				if(response.Authorization==null){
					Swal.fire({
						text:'아이디 혹은 비밀번호를 확인해주세요.',
						icon: 'warning',
						confirmButtonText: '완료', // confirm 버튼 텍스트 지정
						confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
					  });
                }else{
					window.localStorage.setItem("Authorization", response.Authorization);
					Swal.fire({
						text:'로그인 완료되었습니다.',
						icon: 'success',
						confirmButtonText: '완료', // confirm 버튼 텍스트 지정
						confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
					  }).then(response => {
							movePage('/user/home');
				  });
				   
                }
			   });
		}
	}
    return (
	<div className="userLoginBox" >
		<div className="form-box login-register-form-element" id="userLoginBox_in">
			
			<h1 className="form-box-title" style={{color:"#643B25", marginBottom:"20px", fontSize:"50px"}}>Coffee Studio</h1>
			<h2 className="form-box-title">로그인</h2>
			<form className="form" id="loginFrm" style={{marginTop:'30px'}}>
				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="text" id="userId" name="username" placeholder="아이디" onChange={onChange}/>
						</div>
					</div>
				</div>

				<div className="form-row">
					<div className="form-item">
						<div className="form-input">
							<input type="password" id="userPw" name="userPW" placeholder="비밀번호" onChange={onChange}/>
						</div>
					</div>
				</div>

				<div className="form-row space-between">

					<div className="form-item">
						<a className="form-link" onClick={moveOtherPage} style={{marginRight:"10px", color:"#adafca",cursor:"Pointer"}}>회원가입</a>
						<a className="form-link" style={{marginRight:"10px", color:"#adafca", cursor:"Pointer"}}>아이디 찾기</a>
						<a className="form-link" style={{marginRight:"10px", color:"#adafca",cursor:"Pointer"}}>비밀번호 찾기</a>
					</div>
				</div>

				
				<div className="form-row">
					<div className="form-item">
						<input type="button" className="button medium secondary" onClick={letsLogin} id="loginBtn" style={{width:"356px"}} value="로그인"/>
					</div>
				</div>
			</form>
		</div>
	</div>

		
    );
}

export default Header2;