
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import TDots from '../static/img/icon/ThreeDotsIcon.png';
import Swal from 'sweetalert2';
import underArrow from '../static/img/icon/underArrow.png';
import rereply from '../static/img/icon/rereply.png';
import upArrow from '../static/img/icon/upArrow.png';

const PostBody = forwardRef((props, ref) =>{
      // const childRef = useRef();
      // const [data, setData] = useState([]);
      let jwt = useSelector(state=>state.jwt);
      const [modifyOn, setmodifyOn] = useState(false);
      const [rereplyOn, setrereplyOn] = useState(false); //대댓글 보기
      const [profileImg, setprofileImg] = useState('');
      const [underLineOn, setunderLineOn] = useState({
        textDecoration:'',
        textUnderlinePosition:'',
        }
      );
    
      const [modifyContent, setmodifyContent] = useState('');
      const [optionBoxDispay, setOptionBoxDispay] = useState('none'); //옵션 박스 온오프 디스플레이 상태
      let replyRef = useRef();
      let loginUserId = useSelector(state=>state.userId);

      const onChange = (e) => {
        const { value } = e.target  
        setmodifyContent(value);   
      }

      function transDate(getDate) {
        let dt = new Date(getDate+" UTC").toLocaleString();
        let Month = dt.split(".")[1];
        let day = dt.split(".")[2];
        let AmPm = dt.split(" ")[3]
        let hour = dt.split(" ")[4].split(":")[0];
        let minutes = dt.split(" ")[4].split(":")[2];
        let date = Month+"월"+day+"일 "+AmPm+" "+hour+":"+minutes;
        return date;
      }

      useEffect(()=>{
        document.addEventListener('mousedown', handleClickOutside);
        return()=>{
        document.removeEventListener('mousedown', handleClickOutside);
        }
      })
      useEffect(()=>{
        console.log(props.rereData);
        if(props.rereData.userProfileImg==='default'){
          setprofileImg(userImage);
        }else{
          setprofileImg("http://localhost:8080/profile/"+props.rereData.userProfileImg);
        }
      },[])
      
      const handleClickOutside=(event)=>{
        if (replyRef && !replyRef.current.contains(event.target)) {
          setOptionBoxDispay('none');
        }
      }

      function optionBoxBtnOnOff() {
        if(optionBoxDispay==='none'){
          setOptionBoxDispay('block');
        }else if(optionBoxDispay==='block'){
          setOptionBoxDispay('none');
        }
      }

      function onModifyForm() {
        setOptionBoxDispay('none');
        setmodifyOn(true);
      }
      
      function offModifyForm() {
        setmodifyOn(false);
      }

      function letsModifyReply() { //대댓글 수정
        setmodifyOn(false);
        fetch('/modifyRereply', {
          method: 'post',
          headers: {
            'Authorization': jwt,
            'content-type': 'application/json'
          },
          body : JSON.stringify({
            mprrno : props.rereData.mprrno,
            replyContent : modifyContent
          })
        }).then(resonse => {
          props.modifyRereply(modifyContent,props.rereData.mprrno);
        });
      
      }
      function deleteThis() {
        setOptionBoxDispay('none');
         props.setSwalOn(true);

        Swal.fire({
          title: '댓글을 삭제하시겠습니까?',
          text: '삭제된 댓글은 복구할 수 없습니다.',
          icon: 'warning',
          showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
          confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
          cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
          confirmButtonText: '삭제', // confirm 버튼 텍스트 지정
          cancelButtonText: '취소', // cancel 버튼 텍스트 지정
          cancelButtonSize:'30px',
          
        }).then(result => {
          console.log(props.rereData.mprrno);
          if(result.isConfirmed) {
            fetch('/removeRereply', {
              method: 'post',
              headers: {
                'Authorization': jwt,
                'content-type': 'application/json'
              },
              body : JSON.stringify({
                mprrno : props.rereData.mprrno
              })
            }).then(resonse => {
              props.RemoveRereply(props.rereData.mprrno);
              Swal.fire({
              text:'삭제가 완료되었습니다.',
              icon: 'success',
              confirmButtonText: '완료', // confirm 버튼 텍스트 지정
              confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
              }).then(result => {
                  props.setSwalOn(false);
              });
            });
          }else{
             props.setSwalOn(false);
          }
        });
      }
     
      return (
      <div className="">
        <div className="post-comment" style={{borderBottom:"1px solid #eaeaf5", paddingLeft:"120px", backgroundColor:"#f8f8fb"}} >
          <div className="meta-line" style={{left:"300px", top:"10px", position:"absolute"}}>
            <div class="meta-line settings">
            {props.rereData.userId === loginUserId ? 
            <div class="post-settings-wrap">
              <div class="post-settings post-settings-dropdown-trigger" onClick={optionBoxBtnOnOff}>
                <img className="icon" src={TDots} alt ="icon"/>
              </div>

              <div class="simple-dropdown post-settings-dropdown" ref={replyRef} style={{position:"absolute", right:"1px", display:optionBoxDispay}}>
                <p class="simple-dropdown-link" onClick={onModifyForm}>수정하기</p>
                <p class="simple-dropdown-link" onClick={deleteThis} >삭제하기</p>
              </div>
            </div>
            : '' 
            }
            </div>
          </div>

          <a className="user-avatar small no-outline" href="profile-timeline.html" style={{marginLeft:"40px"}}>
            {props.rereData.userProfileImg ==='default' ? 
            <img src={userImage} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
            :
            <img src={"http://localhost:8080/profile/"+props.rereData.userProfileImg} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
          }
            
            
          </a>
          <a className="user-avatar small no-outline" href="profile-timeline.html" >
            <img src={rereply} alt ="face"  width='25' height='25' style={{Padding:"20px"}}/>
          </a>
        
          {modifyOn === true ? 
            <div className="" >
              <p className="post-comment-text" style={{textAlign:"left", marginTop:"10px"}}>
                <a className="post-comment-text-author" href="profile-timeline.html">{props.rereData.userId}</a>
                <textarea type="text" id="popup-post-reply" onChange={onChange} placeholder="댓글 수정" name="popup_post_reply" >{props.rereData.replyContent}</textarea>
                <p className="button small secondary confirmBtn" onClick={letsModifyReply} style={{margin:"5px", width:"60px",height:"40px"}}>수정</p>
                <p className="button small secondary confirmBtn" onClick={offModifyForm} style={{ backgroundColor:"#DD3333", margin:"5px",width:"60px",height:"40px"}}>취소</p>
              </p>
            </div>
            : 
            <p className="post-comment-text" style={{textAlign:"left", marginTop:"10px"}}>
              <a className="post-comment-text-author" href="profile-timeline.html">{props.rereData.userId}</a>
              {props.rereData.replyContent}
            </p>
            }
          <div className="content-actions">
            <div className="content-action">
              <div className="meta-line">
                <p className="meta-line-timestamp">{transDate(props.rereData.writeDate)}</p>
              </div>
            </div>
          </div>

      </div>
      </div>
      )
  
});

export default PostBody;
