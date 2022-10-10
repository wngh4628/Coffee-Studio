
import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useNavigate } from "react-router-dom";
import imgA from '../static/img/mainLogo.png';
import Setting from '../static/img/icon/ProfileIcon.png';
import searchIcon from '../static/img/icon/Search.png';
import NotificationsIcon from '../static/img/icon/NotificationsIcon.png';
import MessagesIcon from '../static/img/icon/MessagesIcon.png';
import WritePost from '../static/img/icon/writing.png';
import  "../static/css/vendor/bootstrap.min.css";
import  "../static/css/styles.min.css";
import  "../static/css/userInfo/userLogin.css";
import { useLocation } from "react-router-dom"
import AlertModal from "../fragment/AlertModal";
import LogOn from "../fragment/logOn";
import Swal from 'sweetalert2';
import ChatBody from "../Chat/ChatBody";
import { useMediaQuery } from 'react-responsive'

const Header = forwardRef((props, ref) =>{
	let dispatch = useDispatch();
	const IpAdress = useSelector(state=>state.IpAdress);
	let nowLocation = useLocation().pathname;
	const location = useLocation(); //전 페이지에서 넘겨 받은 변수
	let jwt = useSelector(state=>state.jwt);
	let wrapperRef = useRef();
	let alertRef = useRef();
	let userIdRef = useRef();
	let userNoRef = useRef();
	let ChatRef = useRef();
	let userProfileImgRef = useRef();
	let loginUserNo = useSelector(state=>state.userNo);
	const [ChatAlertIconDisplay, setChatAlertIconDisplay] = useState('none');
	const [userInfomation, setuserInfomation] = useState('');
	const [LogOnTag, setLogOnTag] = useState('');
	const sendUserId = useNavigate();
	const search = useNavigate();
	const [searchKeyword, setsearchKeyword] = useState('');
	const ChatWAYF = useRef("");
	
	useImperativeHandle(ref, () => ({
      }));

	const isDesktopOrMobile = useMediaQuery({query: '(max-width:768px)'});
	const [inputs, setInputs] = useState({  
        settingModalDisplay: 'none',
        loginState: 'N',
		userId:'',
    });
	const [alertModal, setalertModal] = useState({  
        settingModalDisplay: 'none',
    });
	const RoomRef = useRef(); // 소켓에서 넘어오는 채팅 데이터 추가

	useImperativeHandle(ref, () => ({
		getAlert,
		addChattingData
	}));

	function getAlert(){
		setaletState({['chat']:aletState.chat,['alert']:"action-list-item unread"});
	}
	function addChattingData(data){
		console.log(data);
		if(data.category==='readCheck'){
			ChatRef.current.chattingRead(data);
		}else{
			ChatRef.current.addChatting(data);
		}
		
	}
	function changeChattingAlertIcon(WAYF){ //채팅이 왔을 때, 'New'와 같은 빨간원형 아이콘을 켠다
		if(WAYF==='On'){
			setChatAlertIconDisplay('');
		}else{
			setChatAlertIconDisplay('none');
		}
	}

	const [aletState, setaletState] = useState({  
		chat: '',
		alert:''
	  });

	
	const onChangeKeyword = (e) => {
		const { value } = e.target  
		setsearchKeyword(value);   
	  }

	useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        return()=>{
          document.removeEventListener('mousedown', handleClickOutside);
        }
      })
	

      const handleClickOutside=(event)=>{
        if (wrapperRef && !wrapperRef.current.contains(event.target)) {
		  const nextInputs = { ...inputs,  ["settingModalDisplay"]: "none",}
			setInputs(nextInputs);  
        }
		if (alertRef && !alertRef.current.contains(event.target)) {
			const nextInputs = { ...alertModal,  ["settingModalDisplay"]: "none",}
			  setalertModal(nextInputs);  
		  }
      }
	  

	useEffect(() => {
		console.log(props.UserInfo);
		setuserInfomation(props.UserInfo);
	}, []);
	 
	
	const letsSearch = (e) => {
		if(searchKeyword===''){
			Swal.fire({
				text:'검색어를 입력해주세요.',
				icon: 'warning',
				confirmButtonText: '완료', // confirm 버튼 텍스트 지정
				confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
			  }).then(result => {
				props.setSwalOn(false);
			  });
		}else{
			if(window.location.href ==='/mypage'){
				search('/searchpage',{state: {keyword: searchKeyword}});
			}else{
				search('/searchpage',{state: {keyword: searchKeyword}});
				window.location.reload();
			}
		}
		
    }
	const onKeyPress = (e) => {
		if(e.key == 'Enter') {
			letsSearch();
		}
	}
	
	function ChatDispalyChange() {
		ChatRef.current.changeChatDisplay();
		ChatRef.current.firstPage('lobby');
	}
	function modalChange() {
		if(inputs.settingModalDisplay===""){
			const nextInputs = { ...inputs,  ["settingModalDisplay"]: "none",}
			setInputs(nextInputs);  
		}else{
			const nextInputs = { ...inputs,  ["settingModalDisplay"]: "",}
			setInputs(nextInputs); 
		}
	}
	function AlertModalChange() {
		if(alertModal.settingModalDisplay===""){
			ChatWAYF.current ='';
			const nextInputs = { ...alertModal,  ["settingModalDisplay"]: "none",}
			setalertModal(nextInputs);  
		}else{
			ChatWAYF.current ='lobby';
			const nextInputs = { ...alertModal,  ["settingModalDisplay"]: "",}
			setalertModal(nextInputs); 
		}
	}
	
	  function moveHome() { 
        sendUserId('/user/home');
      }
	  
	  function moveMyPage() { 
		if(window.location.href ==='/mypage'){
			sendUserId('/mypage',{state: {userId: loginUserNo, loginUserNo: loginUserNo}});
		}else{
			sendUserId('/mypage',{state: {userId: loginUserNo, loginUserNo: loginUserNo}});
			window.location.reload();
		}
      }
	  useEffect(() => { 
        
    	}, [])
		
    return (
		<header  style={{position:"fixed",top: "0",left: "0",right: "0",zIndex: "98"}}>
			{!isDesktopOrMobile ?
			<div className="" style={{height:"60px", display:"flex", backgroundColor:"white",alignItems:"center",borderBottom:"1px solid #DBDBDB",}} >
			
				<div style={{width:"600px",display:"flex"}}>
					<div className="" onClick={moveHome} style={{ marginLeft:"auto",alignItems: "flex-end"}}>
						<div className="header-brand" style={{cursor:"pointer"}}>
							<p style={{fontSize:"28px", fontWeight:"bold",fontFamily:"Rajdhani,sans-serif",color:"#965C3C",}}>Coffee Studio</p>
						</div>
					</div>
				</div>

				<div style={{textAlign: "center", display:"flex", width:"350px",marginLeft:"200px"}}>
					<div className="" id="search-main" style={{textAlign: "center", width:"280px",}}>
						<input  type="text" name="search_result"  onChange={onChangeKeyword}  style={{height:"36px",backgroundColor:"#efefef"}} placeholder="검색" onKeyPress={onKeyPress} value={searchKeyword}/>
					</div>
				</div>
				
				<div className="" style={{display:"flex", witdh:"500px"}} ref={wrapperRef}>
					<div style={{ cursor: "pointer",}} onClick={props.OnOffWriteBody}>
						<img className='' src={WritePost} alt ="face"  width='25' height='25'/>
					</div>
					<div className={aletState.chat} onClick={ChatDispalyChange} style={{ cursor: "pointer",marginLeft:"20px"}}>
						<img src={MessagesIcon} alt ="Msg"  width='25' height='25'/>
						<div style={{display:ChatAlertIconDisplay,position:"absolute", width:"20px",height:"20px",backgroundColor:"red",top:"40px",left:"45px",borderRadius:"50%"}}>
							<p class="user-status-text small" style={{textAlign:"center",color:"white",marginTop:"3px", fontWeight:"bold"}}>N</p>
						</div>
					</div>
					<div className={aletState.alert} onClick={AlertModalChange} ref={alertRef} style={{ cursor: "pointer",marginLeft:"20px"}}>
						<img className='' src={NotificationsIcon} alt ="face"  width='25' height='25'/>
					</div>
					<div className="MyProfile" onClick={modalChange} style={{textAlign: "center",marginLeft:"20px"}}>
						<img src={Setting} alt ="face"  width='25' height='25' style={{ cursor: "pointer"}}/>
					</div>
					<AlertModal alertModal={alertModal}/>
					 <LogOn userNoRef={userNoRef} userProfileImgRef={userProfileImgRef} displayState = {inputs.settingModalDisplay} userInfo={props.UserInfo}/> 
				</div>
			</div>
			:<div className="" style={{height:"60px", display:"flex", backgroundColor:"white",alignItems:"center",borderBottom:"1px solid #DBDBDB"}} >
			
			<div style={{width:"200px",display:"flex"}}>
				<div className="" onClick={moveHome} style={{ marginLeft:"auto",alignItems: "flex-end"}}>
					<div className="header-brand" style={{cursor:"pointer"}}>
						<p style={{fontSize:"28px", fontWeight:"bold",fontFamily:"Rajdhani,sans-serif",color:"#965C3C",}}>Coffee Studio</p>
					</div>
				</div>
			</div>

			
			<div className="" style={{display:"flex", witdh:"500px", marginLeft:"50px"}} ref={wrapperRef}>
				<div style={{ cursor: "pointer",}} >
					<img className='' src={searchIcon} alt ="face"  width='25' height='25'/>
				</div>
				<div style={{ cursor: "pointer",marginLeft:"20px"}} onClick={props.OnOffWriteBody}>
					<img className='' src={WritePost} alt ="face"  width='25' height='25'/>
				</div>
				<div className={aletState.chat} onClick={ChatDispalyChange} style={{ cursor: "pointer",marginLeft:"20px"}}>
					<img src={MessagesIcon} alt ="Msg"  width='25' height='25'/>
					<div style={{display:ChatAlertIconDisplay,position:"absolute", width:"20px",height:"20px",backgroundColor:"red",top:"40px",left:"45px",borderRadius:"50%"}}>
						<p class="user-status-text small" style={{textAlign:"center",color:"white",marginTop:"3px", fontWeight:"bold"}}>N</p>
					</div>
				</div>
				<div className={aletState.alert} onClick={AlertModalChange} ref={alertRef} style={{ cursor: "pointer",marginLeft:"20px"}}>
					<img className='' src={NotificationsIcon} alt ="face"  width='25' height='25'/>
				</div>
				<div className="MyProfile" onClick={modalChange} style={{textAlign: "center",marginLeft:"20px"}}>
					<img src={Setting} alt ="face"  width='25' height='25' style={{ cursor: "pointer"}}/>
				</div>
				<AlertModal alertModal={alertModal}/>
				{LogOnTag}
				<LogOn userNoRef={userNoRef} userProfileImgRef={userProfileImgRef} displayState = {inputs.settingModalDisplay} userInfo={props.UserInfo}/>
			</div>
		</div>}
		</header>
    );
});

export default Header;