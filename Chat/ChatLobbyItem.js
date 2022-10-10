
import React, {useState, useEffect, useRef,forwardRef,useImperativeHandle} from 'react';
import XIcon from '../static/img/icon/XIcon.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';

const ChatFriendItem = forwardRef((props, ref) =>{
	let [backgroundColor, setbackgroundColor] = useState('');
	
	useImperativeHandle(ref, () => ({
		
	}));

	function transDate(getDate) {
		let result = '';
        let dt = new Date(getDate+" UTC").toLocaleString();
		let nowDate = new Date();
		let getNowDate = nowDate.getFullYear()+" "+Number(nowDate.getMonth()+1)+" "+nowDate.getDate();
		
		let year = dt.split(".")[0];
        let Month = dt.split(".")[1];
        let day = dt.split(".")[2];
        let AmPm = dt.split(" ")[3]
        let hour = dt.split(" ")[4].split(":")[0];
        let minutes = dt.split(" ")[4].split(":")[1];

	
		if(getNowDate === year+Month+day){
			result = AmPm+" "+hour+":"+minutes;
		}else{
			result = Month+"월"+day+"일 "+AmPm+" "+hour+":"+minutes;
		}
        return result;
      }
	
    return (
		<div style={{display:"flex", padding:"10px",backgroundColor:backgroundColor}} onClick={() => props.changeDisply('chatRoom','chatLobby', props.lobbyData.friendNo)}
			onMouseOver={(event) =>{ 
				setbackgroundColor('#F8F8F8');
			}}
			onMouseOut={(event) =>{ 
				setbackgroundColor('');
			}}
		>
			<a className="user-status-avatar" >
			{props.lobbyData.userProfileImg ==='default' ? 
                    <img src={userImage} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                    :
                    <img src={"http://localhost:8080/profile/"+props.lobbyData.userProfileImg} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                  }
			</a>
			<div style={{ display:"flex",width:"100%",marginLeft:"15px", marginRight:"15px"}}>
				<div style={{width:"120px",marginTop:"4px"}}>
					<p style={{fontSize:"18px",fontWeight:"bold"}}>{props.lobbyData.userId}</p>
					<p id='lobbyPag' style={{marginTop:"3px",fontSize:"16px",maxWidth:"160px",webkitLineClamp:"2",webkitBoxOrient: "vertical"}}>{props.lobbyData.recentMsg}</p>
				</div>
				<div style={{marginTop:"4px"}}>
					<p style={{fontSize:"13px",maxWidth:"100px", marginLeft:"auto",textAlign:"right"}}>{transDate(props.lobbyData.recentDate)}</p>
					{props.lobbyData.readCnt !== '0' ?
						<div style={{width:"20px",height:"20px",marginLeft:"70px",backgroundColor:"red",borderRadius:"50%"}}>
							<p class="user-status-text small" style={{paddingTop:"4px",textAlign:"center",color:"white",marginTop:"5px", fontWeight:"bold"}}>{props.lobbyData.readCnt}</p>
						</div>
				  		:
				  		""
					}
					
				</div>
				
			</div>
		</div>
    );
});

export default ChatFriendItem;