
import React, {useState, useEffect, useRef} from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import  "../static/css/vendor/bootstrap.min.css";
import  "../static/css/styles.min.css";
import  "../static/css/userInfo/userLogin.css";
import { useLocation } from "react-router-dom"
import userImage from '../UserInfo/userImg/user_baseProfile.png';
function LogOn(props) {
	const movePage = useNavigate();
	const sendUserId = useNavigate();
	const IpAdress = useSelector(state=>state.IpAdress);
	const [profileImg, setprofileImg] = useState('');
	const [UserInfo, setUserInfo] = useState('');
	const getUserId = useSelector(state=>state.userId);
	function letsLogOut() {
		localStorage.removeItem("Authorization");
		movePage('/loginForm');
	}
	

	function moveMyPage() { 
		console.log(window.location.href);
		if(window.location.href ==='/mypage'){
			sendUserId('/mypage',{state: {userId: props.userNoRef.current, loginUserNo: props.userNoRef.current}});
		}else{
			sendUserId('/mypage',{state: {userId: props.userNoRef.current, loginUserNo: props.userNoRef.current}});
			window.location.reload();
		}
	}

    return (
		<div className="dropdown-navigation header-settings-dropdown" style={{display:props.displayState,position:"absolute", top:"62px",right:"25px"}}>
			{props.userInfo !== undefined ?
			<div className="dropdown-navigation-header" style={{display:"flex"}}>
				<div class="box" style={{borderRadius: "70%"}}>
					
					<img src={IpAdress+"/profile/"+props.userInfo.userProfileImg+".jpg"} alt ="face"  width='30' height='30' style={{borderRadius: "80px",objectFit: "cover"}}/>
					
				</div>
				<p className="user-status-title" style={{margin:"auto"}}>
					{props.userInfo.userId+"님 환영합니다."}
				</p>
			</div>
			:''}
			<a className="dropdown-navigation-link" onClick={moveMyPage}>마이 페이지</a>
			<a className="dropdown-navigation-link" href="/userInfoModify">개인 정보 수정</a>
			<a className="dropdown-navigation-button button small secondary" style={{color:"white"}} onClick={letsLogOut}>Logout</a>
	  </div>
	  

    );
}

export default LogOn;