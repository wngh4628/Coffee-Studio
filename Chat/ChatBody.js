
import React, {useState, useEffect, useRef, forwardRef,useImperativeHandle} from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom"
import ChatSideBar from "../Chat/ChatSideBar";
import ChatLobby from "../Chat/ChatLobby";
import ChatFriend from "../Chat/ChatFriend";
import ChatRoom from "../Chat/ChatRoom";
import XIcon from '../static/img/icon/XIcon.png';

const ChatBody = forwardRef((props, ref) =>{
	let [ChatBodyDisplay, setChatBodyDisplay] = useState('none');
	let ChatBarRef = useRef('');
	let ChatFreindRef = useRef('');
	let ChatLobbyRef = useRef('');
	let ChatRoomRef = useRef('');
	let ChatRoomBack = useRef(''); //채팅방에서 뒤로가기 눌렀을 때, 돌아갈 화면 알려주는
	let chatRoomUserNo = useRef(''); 
	let jwt = localStorage.getItem('Authorization');
	
	const [FriendData, setFriendData] = useState([]);
	const [LobbyData, setLobbyData] = useState([]);
	const nowPage = useRef('');

	useImperativeHandle(ref, () => ({
		firstPage,
		changeChatDisplay,
		addChatting,
		ChatLobbyRead,
		chattingRead
	}));

	function changeChatDisplay(){
		if(ChatBodyDisplay==="flex"){
			setChatBodyDisplay("none");
			ChatLobbyRef.current.ChatLobbyDisply('');
			ChatFreindRef.current.ChatFriendDisply('');
			ChatBarRef.current.ChatSideBarDisplay('');
			ChatRoomRef.current.ChatRoomDisply('');
		}else{
			setChatBodyDisplay("flex"); 
		}
	}
	function addChatting(data){
		console.log('=================');
		console.log(data.rno);
		console.log(ChatRoomRef.current.getRNo());
		if(ChatRoomRef.current.getRNo()!=null){ //채팅방에 입장해 있는가?
			console.log(ChatRoomRef.current.getRNo());
			if(data.rno === ChatRoomRef.current.getRNo()){ // 방금 받은 메시지가 입장해 있는 방의 메시지인가?
				ChatRoomRef.current.addChattingData(data); //채팅방에 메시지 추가
				ChatLobbyRead(data);
				console.log(props.userNoRef.current);
				if(data.sendUserNo !== props.userNoRef.current){
					let data1 = {
						RNo: data.rno,
						getUserNo: data.sendUserNo,
						WAYF:'chat',
						category:'readCheck',
					};
					props.sendSocket(data1,'chat');
				}
				
			}
		}
		let newData = []
		for(let i=0; i<LobbyData.length;i++){ 
			if(data.rno===LobbyData[i].rno){ //기존에 채팅 이력이 있는지 없는지 확인하고, 있으면 해당 채팅방 가장 위로 올리기
				console.log(ChatRoomRef.current.getRNo());
				console.log(LobbyData[i]);
				if(ChatRoomRef.current.getRNo()!=null && data.rno === ChatRoomRef.current.getRNo()){
					newData = [...newData, {...LobbyData[i],['rno']:data.rno,['recentMsg']:data.msgContent,['recentDate']:data.sendData,['readCnt']:'0'}]
				}else{
					newData = [...newData, {...LobbyData[i],['rno']:data.rno,['recentMsg']:data.msgContent,['recentDate']:data.sendData,['readCnt']:Number(LobbyData[i].readCnt)+1}]
				}
				
				let newArr = LobbyData.filter(dataArr => dataArr.rno !== data.rno);
				for(let i=0; i<newArr.length;i++){
					newData = [...newData, newArr[i]]
				}
				setLobbyData(newData);
				break;
			}
		}
			
	}

	function ChatLobbyRead(RNo){//로비 데이터 readCnt 
		console.log('---------------');
		console.log(RNo);
		let newData = []
		for(let i=0; i<LobbyData.length;i++){ //기존에 채팅 이력이 있는지 없는지 확인하기
			
			console.log(LobbyData[i].rno);
			console.log(LobbyData[i].rno === RNo);
			if(LobbyData[i].rno === RNo){
				newData = [...newData, {...LobbyData[i],['readCnt']:'0'}]
			}else{
				newData = [...newData, LobbyData[i]]
			}
		}
		setLobbyData(newData);
	}
	function chattingRead(data){
		console.log(data);
		if(ChatRoomRef.current.getRNo()!=null){ //채팅방에 입장해 있는가?
			if(data.rno === ChatRoomRef.current.getRNo()){ // 방금 받은 메시지가 입장해 있는 방의 메시지인가?
				ChatRoomRef.current.chattingRead();
			}
		}
	}
	function firstPage(WAYF){// 첫 화면을 어떤걸로 표시할지 결정
       if(WAYF==='lobby'){ 
		ChatLobbyRef.current.ChatLobbyDisply('on');
		ChatBarRef.current.ChatSideBarDisplay('on');
		nowPage.current = 'chatLobby';
	   }
	}
	
	 useEffect(() => {
		if(LobbyData.length!==0){
			console.log(LobbyData);
			for(let i = 0; i< LobbyData.length; i++){// 새 소식이 있을 경우 아이콘에 빨간색 점 찍음
				console.log(LobbyData[i].readCnt);
				console.log(LobbyData[i].readCnt!=='0');
				if(LobbyData[i].readCnt!=='0'){
					props.changeChattingAlertIcon('On');
					break;
				}
				
				if(i===Number(LobbyData.length)-1){
					console.log('!!!!!!!!dyes');
					props.changeChattingAlertIcon('Off');
				}
			}
		}
    }, [LobbyData]);

	useEffect(() => {
		fetch('/getChatData', {
			method: 'post',
			headers: {
				'Authorization': jwt
			},
		}).then(res => res.json())
		.then(resonse => {
			console.log(resonse);
			setFriendData(resonse.myfriend);
			setLobbyData(resonse.getLobby);
		});
    }, []);

	function changeDisply(WAYF,From,data){ //친구 로비 채팅방 옵션바의 디스플레이 상태를 컨트롤하는 함수 (껐다 켰다함)
		if(WAYF==='friend'){
			if(From==='chatRoom'){
				ChatRoomRef.current.ChatRoomDisply('');
				ChatBarRef.current.ChatSideBarDisplay('on');
			}
			ChatLobbyRef.current.ChatLobbyDisply('');
			ChatFreindRef.current.ChatFriendDisply('on');
			nowPage.current ='friend';
		}else if(WAYF==='chatLobby'){
			if(From==='chatRoom'){
				ChatRoomRef.current.ChatRoomDisply('');
				ChatBarRef.current.ChatSideBarDisplay('on');
			}
			ChatLobbyRef.current.ChatLobbyDisply('on');
			ChatFreindRef.current.ChatFriendDisply('');
			nowPage.current ='chatLobby';
		}else if(WAYF==='chatRoom'){
			if(From==='friend'){
				console.log(data);
				ChatRoomBack.current = 'friend';
				chatRoomUserNo.current = data;
				ChatRoomRef.current.EnterChatRoom(From,data);
			}else if(From==='chatLobby'){
				console.log(data);
				ChatRoomBack.current = 'chatLobby';
				chatRoomUserNo.current = data;
				ChatRoomRef.current.EnterChatRoom(From,data);
			}
			ChatLobbyRef.current.ChatLobbyDisply('');
			ChatFreindRef.current.ChatFriendDisply('');
			ChatBarRef.current.ChatSideBarDisplay('');
			ChatRoomRef.current.ChatRoomDisply('on');
			nowPage.current ='chatRoom';
		}
	}
	
    return (
		<div className="dropdown-navigation header-settings-dropdown" style={{padding:"0px", display:ChatBodyDisplay, border: "0.5px solid #D3D3D4", position:"absolute", height:"560px",width:"390px",top:"490%",right:"1%"}}>
			<ChatSideBar ref={ChatBarRef}  changeDisply={changeDisply}/>
			<ChatFriend ref={ChatFreindRef} changeDisply={changeDisply} changeChatDisplay={changeChatDisplay} FriendData={FriendData}/>
			<ChatLobby ref={ChatLobbyRef} changeChatDisplay={changeChatDisplay} LobbyData={LobbyData} changeDisply={changeDisply}/>	
			<ChatRoom ChatLobbyRead={ChatLobbyRead} chatRoomUserNo={chatRoomUserNo} ref={ChatRoomRef} changeChatDisplay={changeChatDisplay} changeDisply={changeDisply} ChatRoomBack={ChatRoomBack} sendSocket={props.sendSocket}/>	
		</div>
	
    );
});

export default ChatBody;