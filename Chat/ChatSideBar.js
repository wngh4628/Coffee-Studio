

import React, {useState, useEffect, useRef,forwardRef,useImperativeHandle} from 'react';
import MessagesIcon from '../static/img/icon/MessagesIcon.png';
import friends from '../static/img/icon/friend.png';

const ChatSideBar = forwardRef((props, ref) =>{
	const [friendColor, setcfriendColor] = useState('iconDark');
	const [chatColor, setchatColor] = useState('iconDark');

	let [ChatSideBarDisplayRef, setChatSideBarDisplayRef] = useState('none');

	useImperativeHandle(ref, () => ({
		ChatSideBarDisplay
	}));

	function ChatSideBarDisplay(WAYF){
		if(WAYF==='on'){
			setChatSideBarDisplayRef('');
		}else{
			setChatSideBarDisplayRef('none');
		}
	}
	
	
    return (
		<div style={{display:ChatSideBarDisplayRef, backgroundColor:"#EAEAEA", height:"100%", width:"65px", borderRight: "0.5px solid #D3D3D4", borderRadius:"10px 0 0 0 ", paddingTop:'65px',paddingLeft:"10px"}}>
			<div onClick={() => props.changeDisply('friend')} style={{ cursor: "pointer", textAlign:"center", marginBottom:"20px"}}>
				<img className={friendColor} 
				onMouseOver={(event) =>{ 
					setcfriendColor('iconSelected');
				  }}
				  onMouseOut={(event) =>{ 
					setcfriendColor('iconDark');
				  }}
				src={friends} alt ="face"  width='30' height='30'/>
			</div>
			<div onClick={() => props.changeDisply('chatLobby')} style={{ cursor: "pointer",textAlign:"center"}}>
				<img className={chatColor} 
				onMouseOver={(event) =>{ 
					setchatColor('iconSelected');
				  }}
				  onMouseOut={(event) =>{ 
					setchatColor('iconDark');
				  }}
				src={MessagesIcon} alt ="face"  width='30' height='30'/>
			</div>
		</div>	
    );
})

export default ChatSideBar;