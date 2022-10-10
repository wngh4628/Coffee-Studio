
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
  const sendUserId = useNavigate();
  let loginUserNo = useSelector(state=>state.userNo);
  const [profileImg, setprofileImg] = useState('');
  const [coverImg, setcoverImg] = useState('');
  
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
      
    }, []);

    function moveMyPage() { 
        sendUserId('/mypage',{state: {userId: props.friendData.userNo, loginUserNo: props.friendData.userNo}});
    }
  
   
    return (
     <div class="user-preview" style={{width:"258px", height:"280px", marginBottom:"10px"}}>
          <figure class="profile-header-cover liquid" style={{ }}>
            <img src={coverImg} alt="cover-01" style={{objectFit: "cover",borderRadius: "12px 12px 0px 0px",height:"100px"}}/>
          </figure>
          <div class="user-preview-info">
            <div class="user-short-description" style={{paddingTop:"45px",height:"50px"}}>
              <a class="user-short-description-avatar user-avatar medium" style={{marginLeft:"-45px", width:"90px", height:"90px",borderRadius: "120px",backgroundColor:"white", cursor:'pointer'}}>
                <img src={profileImg} onClick={moveMyPage} alt ="face"  width='80' height='80' style={{marginTop:"6px",borderRadius: "80px",objectFit: "cover",marginBottom:"10px",}}/>
              </a>
              <p class="user-short-description-title" style={{cursor:'pointer'}} onClick={moveMyPage}>{props.friendData.userId}</p>
              <p class="user-short-description-text">{props.friendData.userEmail}</p>
            </div>


             <div class="user-preview-actions" style={{marginTop:"50px"}} onClick={moveMyPage}>
              <p class="button secondary"  >
              <img src={ProfileIcon} alt ="face"  width='16' height='16' style={{marginRight:"3px", marginBottom:"2px"}}/> 친구 페이지</p>
             </div>
           
          </div>
      </div>
    
    )
}

export default MypageFriend;
