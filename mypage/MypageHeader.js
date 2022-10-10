
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import imgA from '../static/img/mainLogo.png';
import Setting from '../static/img/setting.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import cover from '../UserInfo/userImg/cover.png';

function MypageHeader(props) {
    let jwt = useSelector(state=>state.jwt);
    let loginUserId = useSelector(state=>state.userId);
    let loginUserNo = useSelector(state=>state.userNo);
    let userEmail = useSelector(state=>state.userEmail);
    const [friendBtn, setfriendBtn] = useState("");
    const navigate = useNavigate();
    const [profileImg, setprofileImg] = useState('');
    const [coverImg, setcoverImg] = useState('');
  

    useEffect(() => { 
      console.log(props.userData);
      if(props.userData.userCoverImg==='default'){
        setcoverImg(cover);
      }else{
        setcoverImg("http://localhost:8080/coverImg/"+props.userData.userCoverImg);
      }

      if(props.userData.userProfileImg==='default'){
        setprofileImg(userImage);
      }else{
        setprofileImg("http://localhost:8080/profile/"+props.userData.userProfileImg);
      }

        if(loginUserNo === props.userData.userNo){ //내 페이지일 때
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={userInfoModify}> 프로필 수정</p>);
        }else if(props.userData.friendState===''){ //친구가 아닐 때
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={addFriend}> 친구 추가 +</p>);
        }else if(props.userData.friendState==='send'){ //로그인 유저가 친구 신청을 보냈을 때
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={CancelAddFriend}> 친구 신청 취소</p>);
        }else if(props.userData.friendState==='get'){ //친구 신청을 받았을 때
            setfriendBtn(
                <div >
                    <p class="profile-header-info-action button secondary"  style={{width:"125px", marginRight:"5px"}} onClick={acceptFriend}> 친구 요청 승인</p>
                    <p class="profile-header-info-action button secondary" style={{ backgroundColor:"#DD3333", width:"125px"}} onClick={rejectAddFriend}> 친구 신청 거절</p>
                </div>
            );
        }else if(props.userData.friendState==='friend'){ //친구일 때
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={removeFriend}>친구 삭제</p>);
        }
    }, []);

    function userInfoModify() {
        navigate('/userInfoModify');
    }
    function addFriend() {
        fetch('/addFirends', {
            method: 'post',
            headers: {
              'Authorization': jwt,
              'content-type': 'application/json'
            },
            body : JSON.stringify({
                userNo : loginUserNo,
                FriendUserNo : props.userData.userNo,
            })
          }).then(resonse => {
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={CancelAddFriend}> 친구 신청 취소</p>);
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
                FriendUserNo : props.userData.userNo,
            })
          }).then(resonse => {
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={addFriend}> 친구 추가 +</p>);
          });
    }

    function rejectAddFriend() {
        fetch('/rejectAddFriend', {
            method: 'post',
            headers: {
              'Authorization': jwt,
              'content-type': 'application/json'
            },
            body : JSON.stringify({
                userNo : loginUserNo,
                FriendUserNo : props.userData.userNo,
            })
          }).then(resonse => {
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={addFriend}> 친구 추가 +</p>);
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
                FriendUserNo : props.userData.userNo,
            })
          }).then(resonse => {
            setfriendBtn(<p class="profile-header-info-action button secondary" onClick={addFriend}>친구 삭제</p>);
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
                  FriendUserNo : props.userData.userNo,
              })
            }).then(resonse => {
                setfriendBtn(<p class="profile-header-info-action button secondary" onClick={addFriend}> 친구 추가 +</p>);
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

    return (
    <div class="profile-header" style={{width:"800px", height:"330px",margin: "auto",marginTop: "100px"}}>
        <figure class="profile-header-cover liquid" style={{ }}>
            <img src={coverImg} alt="" style={{objectFit: "cover",borderRadius: "12px 12px 0px 0px",height:"200px"}}/>
        </figure>

        <div class="profile-header-info" style={{bottom:"100px"}}>
            <div class="user-short-description big">
                <a class="user-short-description-avatar user-avatar big" style={{width:"180px", height:"180px",borderRadius: "120px",backgroundColor:"white"}}>
                    <img src={profileImg} alt =""  width='168' height='168' style={{marginTop:"6px",borderRadius: "80px",objectFit: "cover",marginBottom:"10px",}}/>
                </a>

                <p class="user-short-description-title" style={{marginTop:"18px"}}>
                    <a style={{marginLeft:"35px"}}>{props.userData.userId}</a>
                </p>
                <p class="user-short-description-text" style={{marginLeft:"35px"}}>{props.userData.userEmail}</p>
                <div class="profile-header-info-actions">
                    {friendBtn}
                </div>
            </div>
            <div class="user-stats">
                <div class="user-stat big">
                    <p class="user-stat-title">{props.userData.postCnt}</p>
                    <p class="user-stat-text">posts</p>
                </div>

                <div class="user-stat big">
                    <p class="user-stat-title">{props.userData.FriendCnt}</p>
                    <p class="user-stat-text">friends</p>
                </div>
            </div>

        </div>
    </div>
    )
}

export default MypageHeader;
