
import React, {useState, useEffect, useRef,forwardRef,useImperativeHandle} from 'react';
import XIcon from '../static/img/icon/XIcon.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';

const ChatFriendItem = forwardRef((props, ref) =>{
	let [backgroundColor, setbackgroundColor] = useState('');
	
	useImperativeHandle(ref, () => ({
		
	}));

	
    return (
		<div style={{display:"flex", padding:"10px",backgroundColor:backgroundColor}} onClick={() => props.changeDisply('chatRoom','friend',props.FriendData.friendUserNo)}
			onMouseOver={(event) =>{ 
				setbackgroundColor('#F8F8F8');
			}}
			onMouseOut={(event) =>{ 
				setbackgroundColor('');
			}}
		>
			<a className="user-status-avatar" >
			{props.FriendData.userProfileImg ==='default' ? 
                    <img src={userImage} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                    :
                    <img src={"http://localhost:8080/profile/"+props.FriendData.userProfileImg} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                  }
			</a>
			<div style={{ width:"100%",marginLeft:"15px",marginTop:"12px"}}>
				<p style={{fontSize:"17px",fontWeight:"bold"}}>{props.FriendData.userId}</p>
			</div>
		</div>
    );
});

export default ChatFriendItem;