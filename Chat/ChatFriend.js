
import React, {useState, useEffect, useRef,forwardRef,useImperativeHandle} from 'react';
import XIcon from '../static/img/icon/XIcon.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import ChatFriendItem from "../Chat/ChatFriendItem";

const ChatFriend = forwardRef((props, ref) =>{
	let [ChatFriendDisplayRef, setChatFriendDisplayRef] = useState('none');
	
	useImperativeHandle(ref, () => ({
		ChatFriendDisply
	}));

	function ChatFriendDisply(WAYF){
		if(WAYF==='on'){
			setChatFriendDisplayRef('');
		}else{
			setChatFriendDisplayRef('none');
		}
	}
	

    return (
		<div style={{display:ChatFriendDisplayRef, width:"80%", }}>
			<div style={{display:"flex"}}>
				<p style={{padding:'20px', fontSize:"17px",fontWeight:"bold"}}>친구</p>
				<div onClick={props.changeChatDisplay} style={{cursor: "pointer", marginLeft:"auto", marginRight:"0px", marginTop:"15px"}}>
					<img className="iconSelected" src={XIcon} alt ="face"  width='20' height='20' />	
				</div>
			</div>
			<div style={{width:"103%",height:"89%",borderTop:"0.5px solid #D3D3D4", overflow: "auto"}}>
				
				{props.FriendData.map((FriendData,i) => (
                	<ChatFriendItem FriendData={FriendData} changeDisply={props.changeDisply}/>
                  ))
            	}
			</div>
		</div>
    );
});

export default ChatFriend;