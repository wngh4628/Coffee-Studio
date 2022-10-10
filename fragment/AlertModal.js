
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import  "../static/css/vendor/bootstrap.min.css";
import  "../static/css/styles.min.css";
import  "../static/css/userInfo/userLogin.css";
import { useLocation } from "react-router-dom"

function AlertModal(props) {
	
	
    return (
		<div className="dropdown-navigation header-settings-dropdown" if="settingModal" style={{display:props.alertModal.settingModalDisplay, position:"absolute", top:"68px",right:"-18px"}}>
			<p className="user-status-title" style={{textAlign: "center"}}>
				<span className="bold"  >로그인 해주세요!</span>
			</p>
			<a className="dropdown-navigation-button button small secondary" href="/loginForm" >Log-In</a>
		</div>
	
    );
}

export default AlertModal;