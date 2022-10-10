
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import backImg from '../static/img/cover/01.jpg';
import backImg2 from '../static/img/cover/33.jpg';
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
      
      if(props.loginUserMyPage.current==='Y'){ //내 페이지일 때
        setfriendBtn(<p class="button secondary" onClick={removeFriend} style={{ backgroundColor:"#DD3333"}} >
        {friendBtn}
        <img src={removeIcon} alt ="face"  width='16' height='16' style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 삭제</p>);
      }else if(props.friendData.friendUserNo===loginUserNo){ //친구가 본인일 때
        setfriendBtn(<p class="button secondary" onClick={moveMyPage}>
        {friendBtn}
        <img src={ProfileIcon} alt ="face"  width='16' height='16'  style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 페이지</p>);
      }else if(props.friendData.state===null){ //친구 신청
        setfriendBtn(<p class="button secondary" onClick={addFriend}>
        {friendBtn}
        <img src={AddIcon} alt ="face"  width='16' height='16' style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 추가 +</p>);
      }else if(props.friendData.state==='send'){ //로그인 유저가 친구 신청을 보냈을 때
        setfriendBtn(<p class="button secondary" onClick={CancelAddFriend} style={{ backgroundColor:"#DD3333"}} >
        {friendBtn}
        <img src={removeIcon} alt ="face"  width='16' height='16' style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 신청 취소</p>);
      }else if(props.friendData.state==='friend'){ //로그인 유저가 친구 신청을 보냈을 때
        setfriendBtn(<p class="button secondary"  onClick={moveMyPage}>
        {friendBtn}
        <img src={ProfileIcon} alt ="face"  width='16' height='16'  style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 페이지</p>);
      }
    }, []);

      function addFriend() {
        fetch('/addFirends', {
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
            setfriendBtn(<p class="button secondary" onClick={CancelAddFriend} style={{ backgroundColor:"#DD3333"}} >
            {friendBtn}
            <img src={removeIcon} alt ="face"  width='16' height='16' style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 신청 취소</p>);
          });
    }
    function CancelAddFriend() {
      fetch('/CancelAddFriend', {
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
          setfriendBtn(<p class="button secondary" onClick={addFriend}>
        {friendBtn}
        <img src={AddIcon} alt ="face"  width='16' height='16' style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 추가 +</p>);
        });
    }
    function removeFriend() {
      Swal.fire({
        title: '해당 회원님을 친구에서 삭제하시겠습니까?',
        icon: 'warning',

        showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
        confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
        cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
        confirmButtonText: '삭제', // confirm 버튼 텍스트 지정
        cancelButtonText: '취소', // cancel 버튼 텍스트 지정
        cancelButtonSize:'30px',
        
      }).then(result => {
        if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
          fetch('/removeFriend', {
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
            props.removeFriendData(props.friendData.friendsNo);
          props.removeData(props.friendData.friendsNo);
            Swal.fire({
            text:'삭제가 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '완료', // confirm 버튼 텍스트 지정
            confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
          });
          });
        }
      });
  }
  
    function moveMyPage() { 
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
              {friendBtn}
             </div>
           
          </div>
      </div>
    
    )
}

export default MypageFriend;
