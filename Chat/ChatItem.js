
import React, {useState, useEffect, useRef,forwardRef,useImperativeHandle} from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import userImage from '../UserInfo/userImg/user_baseProfile.png';

const ChatItem = forwardRef((props, ref) =>{
	let loginUserId = useSelector(state=>state.userNo);
	let [backgroundColor, setbackgroundColor] = useState('');
	useImperativeHandle(ref, () => ({
		
	}));

    return (
		<div>
			{props.chatData.sendUserNo !==  loginUserId ? 
				<div id="outer" style={{display:"flex",maxWidth:"280px",marginTop:"12px",paddingLeft:"10px"}}>
					{props.chatData.userProfileImg ==='default' ? 
                    <img src={userImage} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                    :
                    <img src={"http://localhost:8080/profile/"+props.chatData.userProfileImg} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                  }
					<div style={{borderRadius:"20px",maxWidth:"220px", backgroundColor:"#e4e6eb",marginLeft:"10px",padding:"10px"}}> 
						<div style={{fontSize:"15px",wordBreak:"break-all"}}>{props.chatData.msgContent}</div>
					</div>
				</div>
				:
				<div id="outer" style={{maxWidth:"250px",marginTop:"12px", marginLeft:"auto",display: "flex",justifyContent: "flex-end"}}>
					<div style={{display:"flex",marginLeft:"auto"}}>
						{props.chatData.readCnt === '0' ? 
							''
							:
							<p style={{marginRight:"10px",marginTop:"15px",}}>{props.chatData.readCnt}</p>
						}
						<div style={{marginLeft:"auto",borderRadius:"20px",backgroundColor:"#0084ff",padding:"10px",}}> 
							<div style={{fontSize:"15px", wordBreak:"break-all", color:'white',textAlign:"left"}}>{props.chatData.msgContent}</div>
						</div>
					</div>
					
				</div>
			}
		</div>
    );
});

export default ChatItem;