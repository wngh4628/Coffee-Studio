
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import removeIcon from '../static/img/icon/RemoveFriendIcon.png';
import ProfileIcon from '../static/img/icon/ProfileIcon.png';
import AddIcon from '../static/img/icon/AddFriendIcon.png';
import Swal from 'sweetalert2';
import cover from '../UserInfo/userImg/cover.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';

function MypageFriend(props) {
  let jwt = localStorage.getItem('Authorization');
  let loginUserNo = useSelector(state=>state.userNo);
  const [profileImg, setprofileImg] = useState('');
  const [coverImg, setcoverImg] = useState('');
  const [friendBtn, setfriendBtn] = useState("");
  const sendUserId = useNavigate();

    useEffect(() => { 
      if(props.SendReqestData.userCoverImg==='default'){
        setcoverImg(cover);
      }else{
        setcoverImg("http://localhost:8080/coverImg/"+props.SendReqestData.userCoverImg);
      }

      if(props.SendReqestData.userProfileImg==='default'){
        setprofileImg(userImage);
      }else{
        setprofileImg("http://localhost:8080/profile/"+props.SendReqestData.userProfileImg);
      }
  
    }, []);

    function CancelAddFriend() {
      fetch('/CancelAddFriend', {
          method: 'post',
          headers: {
            'Authorization': jwt,
            'content-type': 'application/json'
          },
          body : JSON.stringify({
               userNo : loginUserNo,
              FriendUserNo : props.SendReqestData.friendUserNo,
          })
        }).then(resonse => {
          props.removeData(props.SendReqestData.friendsNo); // 부모 useState에 지우기
          props.removeSendData(props.SendReqestData.friendsNo);// 부모에 부모 useState에 지우기
        });
        
    }
    
    function moveMyPage() { 
      sendUserId('/mypage',{state: {userId: props.SendReqestData.userNo, loginUserNo: props.SendReqestData.userNo}});
      window.location.reload();
    }
    
    return (
     <div class="user-preview" style={{width:"258px", height:"280px", marginBottom:"10px"}}>
          <figure class="profile-header-cover liquid" style={{}}>
            <img src={coverImg} alt="cover-01" onClick={moveMyPage} style={{objectFit: "cover",borderRadius: "12px 12px 0px 0px",height:"100px"}}/>
          </figure>
          <div class="user-preview-info">
            <div class="user-short-description" style={{paddingTop:"45px",height:"50px"}}>
              <a class="user-short-description-avatar user-avatar medium" style={{marginLeft:"-45px", width:"90px", height:"90px",borderRadius: "120px",backgroundColor:"white"}}>
                <img src={profileImg} alt ="face"  width='80' height='80' style={{cursor:'pointer',marginTop:"6px",borderRadius: "80px",objectFit: "cover",marginBottom:"10px",}}/>
              </a>
              <p class="user-short-description-title" style={{cursor:'pointer'}} onClick={moveMyPage}>{props.SendReqestData.userId}</p>
              <p class="user-short-description-text">{props.SendReqestData.userEmail}</p>
            </div>

            <div class="user-preview-actions" style={{marginTop:"50px"}}>
              <p class="button secondary" style={{ backgroundColor:"#DD3333"}} onClick={CancelAddFriend}>신청 취소</p>
            </div>
           
          </div>
      </div>
    
    )
}

export default MypageFriend;
