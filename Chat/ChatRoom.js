
import React, {useState, useEffect, useRef,useCallback,forwardRef,useImperativeHandle} from 'react';
import XIcon from '../static/img/icon/XIcon.png';
import backIcon from '../static/img/icon/backIcon.png';
import ChatItem from "../Chat/ChatItem";

const ChatRoom = forwardRef((props, ref) =>{
	const scrollRef = useRef();
	let [ChatRoomDisplayRef, setChatRoomDisplayRef] = useState('none');
	const [textMsg, settextMsg] = useState('');
	const [chattingData, setchattingData] = useState([]);
	const [chatRoomData, setchatRoomData] = useState([]);
	let jwt = localStorage.getItem('Authorization');

	useImperativeHandle(ref, () => ({
		ChatRoomDisply,
		addChattingData,
		EnterChatRoom,
		getRNo,
		chattingRead
	}));

	useEffect(() => {
		scrollToBottom();
    }, [chattingData])

	const scrollToBottom = () => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	  };

	function EnterChatRoom(WAYF,data){
		console.log(WAYF);
		console.log(data);
		setchatRoomData([]);
		setchattingData([]);
		if(WAYF==='friend'){
			fetch('/getChattingData', {
				method: 'post',
				headers: {
					'content-type': 'application/json',
					'Authorization': jwt
				},
				body : JSON.stringify({
					wayf:WAYF,
					friendNo:data
				})
			}).then(res => res.json())
			.then(resonse => {
				setchatRoomData(resonse);
				if(resonse.chattingData!==null){
					setchattingData(resonse.chattingData);
				}
				console.log(resonse.rno);
				props.ChatLobbyRead(resonse.rno);
				let data1 = {
					RNo: resonse.rno,
					getUserNo: props.chatRoomUserNo.current,
					WAYF:'chat',
					category:'readCheck',
				};
				props.sendSocket(data1,'chat');
			});
		}else if(WAYF==='chatLobby'){
			fetch('/getChattingData', {
				method: 'post',
				headers: {
					'content-type': 'application/json',
					'Authorization': jwt
				},
				body : JSON.stringify({
					wayf:WAYF,
					friendNo:data,
				})
			}).then(res => res.json())
			.then(resonse => {
				setchatRoomData(resonse);
				if(resonse.chattingData!==null){
					setchattingData(resonse.chattingData);
				}
				console.log(resonse);
				console.log(resonse.rno);
				props.ChatLobbyRead(resonse.rno);
				let data1 = {
					RNo: resonse.rno,
					getUserNo: props.chatRoomUserNo.current,
					WAYF:'chat',
					category:'readCheck',
				};
				props.sendSocket(data1,'chat');
			});
		}
	}

	function getRNo(){
		return chatRoomData.rno;
	}

	function chattingRead(){
		console.log('chattingRead');
		let newData = []
		for(let i=0; i<chattingData.length;i++){ //채칭 읽음 표시 0으로 만들기
			newData = [...newData, {...chattingData[i],['readCnt']:'0'}]
		}
		setchattingData(newData);
	}

	function ChatRoomDisply(WAYF){
		if(WAYF==='on'){
			setChatRoomDisplayRef('');
		}else{
			setchatRoomData([]);
			setchattingData([]);
			setChatRoomDisplayRef('none');
		}
	}
	function addChattingData(data){
		console.log("chatroom");
		console.log(data);
		setchatRoomData({...chatRoomData, ["RNo"]:data.rno});
		
		let newData = []
        for(let i=0; i<chattingData.length;i++){
          newData = [...newData, chattingData[i]]
        }
		newData = [...newData,data]
		setchattingData(newData);
		scrollToBottom();
	}
	const onChangeKeyword = (e) => {
		const { value } = e.target  
		settextMsg(value);   
	}
	const onKeyPress = (e) => {
		if(e.key == 'Enter') {
			sendMsg();
		}
	}
	function sendMsg(){
		settextMsg('');
		let data = {
			RNo: chatRoomData.rno,
			getUserNo: props.chatRoomUserNo.current,
			WAYF:'chat',
			category:'text',
			textMsg:textMsg
		};
		props.sendSocket(data,'chat');
	}
	useEffect(() => {
        if(chattingData!==[]){
            // console.log(chattingData);
			// console.log(chattingData.length);
        }
    }, [chattingData])

	

    return (
		
		<div style={{display:ChatRoomDisplayRef, width:"100%", borderRadius:"10px",backgroundColor:"#fcfcfd"}} >
			<div style={{display:"flex", backgroundColor:"#EAEAEA",borderBottom:"0.5px solid #D3D3D4",borderRadius:"10px 10px 0 0"}}>
				<div onClick={() => props.changeDisply(props.ChatRoomBack.current,'chatRoom')} style={{marginLeft:"15px", cursor: "pointer", marginRight:"auto", marginRight:"0px", marginTop:"15px"}}>
					<img className="iconSelected" src={backIcon} alt ="face"  width='20' height='20' />	
				</div>
				<p style={{padding:'20px', fontSize:"17px",fontWeight:"bold"}}>{chatRoomData.friendUserId}</p>
				<div onClick={props.changeChatDisplay} style={{cursor: "pointer", marginLeft:"auto", marginRight:"0px", marginTop:"15px"}}>
					<img className="iconSelected" src={XIcon} alt ="face"  width='20' height='20' />	
				</div>
			</div>
			<div style={{maxHeight:"78%", overflow: "auto"}} ref={scrollRef}>
				{chattingData.map((chatData,i) => (
					<ChatItem chatData={chattingData[i]}/>
				))}
			</div>
		
			<div style={{padding:"10px",display:"flex",position: "absolute", bottom:"0", height:"65px",width:"100%"}}>
				<div className="form-input" style={{marginRight:"5px",width:"290px", height:"40px"}}>
					<input type="text" autocomplete="off" value={textMsg} style={{height:"40px"}} name="username" onChange={onChangeKeyword} placeholder="Aa" onKeyPress={onKeyPress}/>
				</div>
				<button onClick={sendMsg} style={{width:"80px", height:"40px", color:"white",backgroundColor:"#007bff"}}>전송</button>
			</div>
		</div>
    );
});

export default ChatRoom;