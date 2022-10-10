
import React, {useState, useEffect, useRef,forwardRef,useImperativeHandle} from 'react';
import XIcon from '../static/img/icon/XIcon.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import ChatLobbyItem from "../Chat/ChatLobbyItem";

const ChatLobby = forwardRef((props, ref) =>{

	let [ChatLobbyDisplayRef, setChatLobbyDisplayRef] = useState('none');

	useImperativeHandle(ref, () => ({
		ChatLobbyDisply,
	}));

	function ChatLobbyDisply(WAYF){
		if(WAYF==='on'){
			setChatLobbyDisplayRef('');
		}else{
			setChatLobbyDisplayRef('none');
		}
	}
	
	
	
    return (
		<div style={{display:ChatLobbyDisplayRef, width:"80%"}}>
			<div style={{display:"flex"}}>
				<p style={{padding:'20px', fontSize:"17px",fontWeight:"bold"}}>채팅</p>
				<div onClick={props.changeChatDisplay} style={{cursor: "pointer", marginLeft:"auto", marginRight:"0px", marginTop:"15px"}}>
					<img className="iconSelected" src={XIcon} alt ="face"  width='20' height='20' />	
				</div>
			</div>
			<div style={{width:"103%",height:"89%",borderTop:"0.5px solid #D3D3D4", overflow: "auto"}}>
				{props.LobbyData.map((lobbyData,i) => (
						<ChatLobbyItem lobbyData={lobbyData} changeDisply={props.changeDisply}/>
					))
				}
			</div>
		</div>
    );
});

export default ChatLobby;