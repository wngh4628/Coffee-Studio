
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import TDots from '../static/img/icon/ThreeDotsIcon.png';
import Swal from 'sweetalert2';
import underArrow from '../static/img/icon/underArrow.png';
import upArrow from '../static/img/icon/upArrow.png';
import ReReply from "../home/ReReplyItem";
import RereplyIcon from '../static/img/icon/rereply.png';

const PostBody = forwardRef((props, ref) =>{
      let jwt = useSelector(state=>state.jwt);
      const [modifyOn, setmodifyOn] = useState(false);
      const [profileImg, setprofileImg] = useState('');
      const [underLineOn, setunderLineOn] = useState({
        textDecoration:'',
        textUnderlinePosition:'',
        }
      );
   
      const [modifyContent, setmodifyContent] = useState(props.replyData.replyContent); //댓글 수정 시, 수정 내용
      const [optionBoxDispay, setOptionBoxDispay] = useState('none'); //옵션 박스 온오프 디스플레이 상태
      const [rereplyFormOn, setrereplyFormOn] = useState(false); //옵션 박스 온오프 디스플레이 상태
      const [rereplyContent, setrereplyContent] = useState(false); //대댓글 내용
      const [rereplyOn, setrereplyOn] = useState(false); //대댓글 보기
      let replyRef = useRef();
      let loginUserId = useSelector(state=>state.userId);

      const onChange = (e) => {
        const { value } = e.target  
        setmodifyContent(value);   
      }
      const rereplyChange = (e) => {
        const { value } = e.target  
        setrereplyContent(value);   
      }
    

      function transDate(getDate) {
        let dt = new Date(getDate+" UTC").toLocaleString();
        let Month = dt.split(".")[1];
        let day = dt.split(".")[2];
        let AmPm = dt.split(" ")[3]
        let hour = dt.split(" ")[4].split(":")[0];
        let minutes = dt.split(" ")[4].split(":")[1];
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
        if(Number(props.nowIdx)+1 ===Number(props.lastIdx)){
          props.replyPagingOn.current = true; 
        }
        console.log(props.replyData);
        if(props.replyData.userProfileImg==='default'){
          setprofileImg(userImage);
        }else{
          setprofileImg("http://localhost:8080/profile/"+props.replyData.userProfileImg);
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
      function offModifyForm() { //수정 or 삭제 모달창
        setmodifyOn(false);
      }
      function RereplyOnOff() { //대댓글 On off
        if(rereplyOn===true){
          setrereplyOn(false);
        }else{
          setrereplyOn(true);
        }
      }
      function inRereplyForm() { //대댓글 작성 박스On
        setrereplyFormOn(true);
      }
      function offRereplyForm() { //대댓글 작성 박스off
        setrereplyFormOn(false);
      }
      function letsModifyReply() {
        setmodifyOn(false);
        props.modifyReply(modifyContent,props.replyData.mprno);

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
          // 만약 Promise리턴을 받으면,
          if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
            let length = 0;
            if(props.replyData.subList !== null){
              length = props.replyData.subList.length;
            }
             props.RemoveReply(props.replyData.mprno, props.replyData.mpno, length);
              Swal.fire({
              text:'삭제가 완료되었습니다.',
              icon: 'success',
              confirmButtonText: '완료', // confirm 버튼 텍스트 지정
              confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
            }).then(result => {
              props.setSwalOn(false);
            });
          }else{
            props.setSwalOn(false);
          }
         
        });
        
      }
      function letsRereply() { //대댓글 작성
        if(rereplyContent!==''){
          setrereplyContent('');
          let formData = new FormData();
          formData.append("content", rereplyContent);
          fetch('/letsRereply', {
            method: 'post',
            headers: {
              'Authorization': jwt,
              'content-type': 'application/json'
            },
            body : JSON.stringify({
              replyContent : rereplyContent,
              mpno :props.replyData.mpno,
              mprno : props.replyData.mprno,
            })
          }).then(resonse => resonse.json())
            .then(resonse => {
              console.log('대댓글 작성');
              console.log(resonse);
              setrereplyFormOn(false);
              setrereplyOn(true);
              console.log(props.replyData.subList);
              let newData = [resonse];
              if(props.replyData.subList!==null){
                for(let i=0; i<props.replyData.subList.length;i++){
                  newData = [...newData, props.replyData.subList[i]]
                }
              }
              
             props.letsRereply(newData, props.replyData.mprno);
          });
        }
      }

      const RemoveRereply = (mprrno) => {//대댓글 삭제
        let newArr = props.replyData.subList.filter(dataArr => dataArr.mprrno !== mprrno);
        props.RemoveRereply(newArr,props.replyData.mprno);
      };

      const modifyRereply = (content, mprrno) => {//대댓글 수정
        let newArr = [];
        for(let i =0; i< props.replyData.subList.length;i++){
          if(props.replyData.subList[i].mprrno=== mprrno){
            newArr = [...newArr, {...props.replyData.subList[i], replyContent:content}];
          }else{
            newArr = [...newArr,props.replyData.subList[i]];
          }
          
        }
        console.log(newArr);
        props.modifyRereply(newArr,props.replyData.mprno);
      };

      return (
      <div className="">
        <div className="post-comment" style={{borderBottom:"1px solid #eaeaf5"}} >
          <div className="meta-line" style={{left:"300px", top:"10px", position:"absolute"}}>
            <div class="meta-line settings">
             
            {props.replyData.userId === loginUserId ? 
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

          <a className="user-avatar small no-outline">
            <img src={profileImg} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
          </a>
        
          {modifyOn === true ? 
            <div className="" >
              <p className="post-comment-text" style={{textAlign:"left", marginTop:"10px"}}>
                <a className="post-comment-text-author" href="profile-timeline.html">{props.replyData.userId}</a>
                <textarea type="text" id="popup-post-reply" onChange={onChange} placeholder="댓글 수정" name="popup_post_reply" >{props.replyData.replyContent}</textarea>
                <p className="button small secondary confirmBtn" onClick={letsModifyReply} style={{margin:"5px", width:"60px",height:"40px"}}>수정</p>
                <p className="button small secondary confirmBtn" onClick={offModifyForm} style={{ backgroundColor:"#DD3333", margin:"5px",width:"60px",height:"40px"}}>취소</p>
              </p>
            </div>
            : 
            <p className="post-comment-text" style={{textAlign:"left", marginTop:"10px"}}>
              <a className="post-comment-text-author" href="profile-timeline.html">{props.replyData.userId}</a>
              {props.replyData.replyContent}
            </p>
            }
          
          <div className="content-actions">
            <div className="content-action">
              
              <div className="meta-line">
                <p className="meta-line-link light" onClick={inRereplyForm}>답글</p>
              </div>
              <div className="meta-line">
                <p className="meta-line-timestamp">{transDate(props.replyData.writeDate)}</p>
              </div>
            </div>
          </div>
          {props.replyData.subList !== null && props.replyData.subList.length > 0 ? 
            <div className="meta-line" onClick={RereplyOnOff} style={{display:"flex",marginTop:"15px", marginLeft:"70px"}}>
            {rereplyOn === false ?  <img src={underArrow} alt ="face"  width='10' height='10'  style={{ marginLeft:"0px"}}/>:
             <img src={upArrow} alt ="face"  width='10' height='10'  style={{ marginLeft:"0px"}}/>
            }
            <p className="meta-line-timestamp" style={{color:"black",marginLeft:"4px",cursor:"pointer", textDecoration: underLineOn.textDecoration, textUnderlinePosition:underLineOn.textUnderlinePosition}}
            onMouseOver={(event) =>{ 
              setunderLineOn({ ...underLineOn,  ["textDecoration"]: "underline", ["textUnderlinePosition"]: "under"});
            }}
            onMouseOut={(event) =>{ 
              setunderLineOn({ ...underLineOn,  ["textDecoration"]: '', ["textUnderlinePosition"]: ''});
          }}
            >{'답글 '+ props.replyData.subList.length+'개 보기'}</p>
          </div>
          :''
          }
          
        </div>
        {rereplyFormOn === false ? '':
          <div className="post-comment-form bordered-top" style={{display:"flex",padding: "10px"}}>
            <img src={RereplyIcon} alt ="face"  width='20' height='20'  style={{ marginRight:"4px"}}/>
            <input type="text" id="popup-post-reply" onChange={rereplyChange} placeholder="댓글 달기" name="popup_post_reply" style={{ width:"260px", height:"40px"}}/>
            <p className="button small secondary confirmBtn" onClick={letsRereply} style={{marginTop:"0px", marginRight: "4px", marginLeft: "4px",marginBottom: "4px",width:"40px",height:"40px"}}>작성</p>
            <p className="button small secondary confirmBtn" onClick={offRereplyForm} style={{backgroundColor:"#DD3333",marginTop:"0px",  marginBottom: "4px",width:"40px",height:"40px"}}>취소</p>
          </div>
        }
       {rereplyOn === false ? '':
       <div>
         {props.replyData.subList !== null ? props.replyData.subList.map((data,i) => (
          <ReReply lastIdx={props.replyData.subList.length} RemoveRereply={RemoveRereply} modifyRereply={modifyRereply} rereData={props.replyData.subList[i]} setSwalOn={props.setSwalOn}/>
          )) : ''
        }
       </div>
       }
      
      </div>
      )
  
});

export default PostBody;
