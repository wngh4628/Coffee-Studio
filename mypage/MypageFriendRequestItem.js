
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import cover from '../UserInfo/userImg/cover.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';

function MypageFriend(props) {
  let loginUserNo = useSelector(state=>state.userNo);
  let jwt = useSelector(state=>state.jwt);
  const [profileImg, setprofileImg] = useState('');
  const [coverImg, setcoverImg] = useState('');
  const sendUserId = useNavigate();

    useEffect(() => { 
      console.log(props.friendData.UserCoverImg);
      if(props.friendData.userCoverImg==='default'){
        setcoverImg(cover);
      }else{
        setcoverImg("http://localhost:8080/coverImg/"+props.friendData.userCoverImg);
      }

      if(props.friendData.userProfileImg==='default'){
        setprofileImg(userImage);
      }else{
        setprofileImg("http://localhost:8080/profile/"+props.friendData.userProfileImg);
      }
    }, []);

    function rejectAddFriend() {
      fetch('/rejectAddFriend', {
          method: 'post',
          headers: {
            'Authorization': jwt,
            'content-type': 'application/json'
          },
          body : JSON.stringify({
              userNo : loginUserNo,
              FriendUserNo : props.friendData.friendUserNo,
          })
        }).then(resonse => {
          props.removeFriendRequest(props.friendData.friendsNo,'reject');
        });
  }

  function acceptFriend() {
      fetch('/acceptFriend', {
          method: 'post',
          headers: {
            'Authorization': jwt,
            'content-type': 'application/json'
          },
          body : JSON.stringify({
              userNo : loginUserNo,
              FriendUserNo : props.friendData.friendUserNo,
          })
        }).then(resonse => {
           props.removeFriendRequest(props.friendData.friendsNo,'add',props.friendData);
        });
  }
    function moveMyPage() { 
      console.log(props.friendData);
      sendUserId('/mypage',{state: {userId: props.friendData.friendUserNo, loginUserNo: props.friendData.friendUserNo}});
      window.location.reload();
    }

   
    return (
     <div class="user-preview" style={{width:"258px", height:"280px", marginBottom:"10px"}}>
          <figure class="profile-header-cover liquid" style={{ }}>
            <img src={coverImg} alt="cover-01" style={{objectFit: "cover",borderRadius: "12px 12px 0px 0px",height:"100px"}}/>
          </figure>
          <div class="user-preview-info">
            <div class="user-short-description" style={{paddingTop:"45px",height:"50px"}}>
              <a class="user-short-description-avatar user-avatar medium" style={{cursor:'pointer',marginLeft:"-45px", width:"90px", height:"90px",borderRadius: "120px",backgroundColor:"white"}}>
                <img src={profileImg} onClick={moveMyPage} alt ="face"  width='80' height='80' style={{marginTop:"6px",borderRadius: "80px",objectFit: "cover",marginBottom:"10px",}}/>
              </a>
              <p class="user-short-description-title" style={{cursor:'pointer'}} onClick={moveMyPage}>{props.friendData.userId}</p>
              <p class="user-short-description-text">{props.friendData.userEmail}</p>
            </div>

            <div class="user-preview-actions" style={{marginTop:"50px"}}>
              <p class="button secondary" onClick={acceptFriend} >승인</p>
              <p class="button secondary" style={{ backgroundColor:"#DD3333"}} onClick={rejectAddFriend}>거절</p>
            </div>

            
          </div>
      </div>
    
    )
}

export default MypageFriend;
