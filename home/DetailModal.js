
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import searchIcon from '../static/img/cover/08.jpg';
import CommentIcon from '../static/img/icon/CommentIcon.png';
import ThumbsUpIcon from '../static/img/icon/ThumbsUpIcon.png';
import XIcon from '../static/img/icon/XIcon.png';
import LeftBtn from "./PostGalleryLeftBtn";
import RightBtn from "./PostGalleryRightBtn";
import TDots from '../static/img/icon/ThreeDotsIcon.png';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import ReplyItem from "../home/ReplyItem";
import Swal from 'sweetalert2';

const DetailModal = forwardRef((props, ref) =>{
    let jwt = useSelector(state=>state.jwt);
    const [showBtn, setshowBtn] = useState('none');
    const [Idx, setIdx] = useState();
    const [replyData, setreplyData] = useState([]); //댓글 정보
    const [replyCnt, setreplyCnt] = useState(0); //댓글 수
    const [likeCnt, setlikeCnt] = useState(0); //좋아요 수
    const [loginUserLikeState, setloginUserLikeState] = useState(''); //좋아요 수
    const saveReplyData = useRef(); //댓글 정보
    const [getcontent, setcontent] = useState('');
    const [SwalOn, setSwalOn] = useState(false); //알림 모달창 유무
    const [target, setTarget] = useState(""); // 댓글 스크롤 바닥 감지하는 역할
    const replyPagingOn = useRef(false);// 댓글 페이징 가능한지
    const paging = useRef(0); //페이징 넘버
    const loading = useRef(0); //페이징 넘버
    const childRef = useRef();

    const [btnState, setbtnState] = useState({
        Left:'',
        right:''
    });
    let dispatch = useDispatch();
    let wrapperRef = useRef();
    useEffect(()=>{
      document.addEventListener('mousedown', handleClickOutside);
      return()=>{
        document.removeEventListener('mousedown', handleClickOutside);
      }
    })

    const onIntersect = () => {
      loading.current = loading.current+1;
     if(replyPagingOn.current && loading.current>1){
      replyPagingOn.current = false;
      console.log("페이징");
        fetch('/getReply', {
          method: 'post',
          headers: {
            'Authorization': jwt,
            'content-type': 'application/json'
          },
          body : JSON.stringify({
            mpno : props.DataPipe.mpno,
            pageNo: paging.current,
          })
          
        }).then(resonse => resonse.json())
          .then(resonse => {
            console.log(resonse.getReply);
            if(resonse.getReply.length>0){
              let newData = [...saveReplyData.current];
              for(let i=0; i<resonse.getReply.length;i++){
                newData = [...newData, resonse.getReply[i]]
              }
              setreplyData(newData);
              loading.current = 0;
              saveReplyData.current = newData;
              paging.current = paging.current +8;
            }
        });
     }
    };

    useEffect(() => {
      let observer;
      if (target) {
        // callback 함수, option
        observer = new IntersectionObserver(onIntersect, {
          threshold: 0.4,
        });
        observer.observe(target); // 타겟 엘리먼트 지정
      }
      return () => observer && observer.disconnect();
    }, [target]);

    function nextIdx() {
      setIdx(Number(Idx)+1);
      changeBtn(Number(Idx)+1);
    }
  
    function backIdx() {
      console.log(Number(Idx)-1);
      setIdx(Number(Idx)-1);
      changeBtn(Number(Idx)-1);
    }

    useEffect(()=>{
      setreplyCnt(props.DataPipe.replyCnt);
      setlikeCnt(props.DataPipe.likeCnt);
      setloginUserLikeState(props.DataPipe.loginUserLikeState);
    },[])
    
    useEffect(()=>{
      transDate(props.DataPipe.writeDate);
      setIdx(props.DataPipe.idx);
      changeBtn(props.DataPipe.idx);
      
      fetch('/getReply', {
        method: 'post',
        headers: {
          'Authorization': jwt,
          'content-type': 'application/json'
        },
        body : JSON.stringify({
          mpno : props.DataPipe.mpno,
          pageNo: paging.current,
        })
        
      }).then(resonse => resonse.json())
        .then(resonse => {
          setreplyData(resonse.getReply);
          saveReplyData.current = resonse.getReply;
          paging.current = paging.current +8;
      });
      
    },[])

    const RemoveReply = (mprno,mpno,length) => {//댓글 삭제 (대댓글 번호, 댓글 번호 ,대댓글 개수)
      console.log("remove: " + mpno);
      fetch('/removeReply', {
        method: 'post',
        headers: {
          'Authorization': jwt,
          'content-type': 'application/json'
        },
        body : JSON.stringify({
          mprno : mprno,
          mpno : mpno
        })
      }).then(resonse => {
        setreplyCnt(Number(replyCnt)-Number(length)-1);
        props.countCnt(Number(replyCnt)-Number(length)-1,props.DataPipe.mpno);
        setreplyData(replyData.filter(user => user.mprno !== mprno));
      });
    };

    const RemoveRereply = (content,mprno) => {//대댓글 삭제
      let newArr = [];
      for(let i=0; i<replyData.length;i++){
        if(replyData[i].mprno=== mprno){
          newArr = [...newArr, {...replyData[i], subList:content}];
        }else{
          newArr = [...newArr, replyData[i]];
        }
      }
      setreplyCnt(Number(replyCnt)-1);
      setreplyData(newArr);
      props.countCnt(Number(replyCnt)-1,props.DataPipe.mpno);
    };

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

    const handleClickOutside=(event)=>{
      if (SwalOn===false && wrapperRef && !wrapperRef.current.contains(event.target)) {
        props.setIsDetailClicked(false);
        dispatch({type:'setBodyBack', getBody:'body'});
      }else {
        props.setIsDetailClicked(true);
      }
    }

    function offModal() {
      props.setIsDetailClicked(false);
        dispatch({type:'setBodyBack', getBody:'body'});
    }

    const onChange = (e) => {
      const { value } = e.target  
      setcontent(value);   
    }
    function modifyReply(Content,mprno) { //댓글 수정
      fetch('/modifyReply', {
        method: 'post',
        headers: {
          'Authorization': jwt,
          'content-type': 'application/json'
        },
        body : JSON.stringify({
          mprno : mprno,
          replyContent : Content
        })
      }).then(resonse => {
        let newArr = [];
        for(let i=0; i<replyData.length;i++){
          if(replyData[i].mprno=== mprno){
            newArr = [...newArr, {...replyData[i], replyContent:Content}];
          }else{
            newArr = [...newArr,replyData[i]];
          }
        }
        setreplyData(newArr);
      });
      
    }
    function modifyRereply(Content,mprno) { //대댓글 수정
      let newArr = [];
      for(let i=0; i<replyData.length;i++){
        if(replyData[i].mprno=== mprno){
          newArr = [...newArr, {...replyData[i], subList:Content}];
        }else{
          newArr = [...newArr,replyData[i]];
        }
        console.log(newArr);
      }
      setreplyData(newArr);
    }
    function letsRereply(Content,mprno) { //대댓글 작성

      let newArr = [];
      for(let i=0; i<replyData.length;i++){
        if(replyData[i].mprno=== mprno){
          newArr = [...newArr, {...replyData[i], subList:Content}];
        }else{
          newArr = [...newArr,replyData[i]];
        }
      }
      setreplyData(newArr);
      setreplyCnt(Number(replyCnt)+1);
      props.countCnt(Number(replyCnt)+1,props.DataPipe.mpno);
      // childRef.current.rendering('add');
    }

    function changeBtn(Idx) {
      if(Number(props.DataPipe.subList.length) == "1"){
        const nextInputs = { ...btnState,  ["Left"]: 'hidden',["right"]: 'hidden'} 
        setbtnState(nextInputs);
      }else if(Idx==='0'||Idx===0){
        const nextInputs = { ...btnState,  ["Left"]: 'hidden',["right"]: ''} 
        setbtnState(nextInputs);
      }else if(Idx==(props.DataPipe.subList.length-1)){
        const nextInputs = { ...btnState,  ["Left"]: '',["right"]: 'hidden'} 
        setbtnState(nextInputs);
      }else{
        const nextInputs = { ...btnState,  ["Left"]: '',["right"]: ''} 
        setbtnState(nextInputs);
      }
    }

    function letsPost() { //댓글 작성
      if(getcontent!==''){
        setcontent('');
        let formData = new FormData();
        formData.append("content", getcontent);
        fetch('/letsReply', {
          method: 'post',
          headers: {
            'Authorization': jwt,
            'content-type': 'application/json'
          },
          body : JSON.stringify({
            replyContent : getcontent,
            mpno : props.DataPipe.mpno,
          })
        }).then(resonse => resonse.json())
          .then(resonse => {
            let newData = [resonse]
            for(let i=0; i<replyData.length;i++){
              newData = [...newData, replyData[i]]
            }
            setreplyData(newData);
            setreplyCnt(Number(replyCnt)+1);
            props.countCnt(Number(replyCnt)+1,props.DataPipe.mpno);
        });
      }
    }
    function pushLike() {
      console.log(props.DataPipe.mpno);
      fetch('/pushMainPostLike', {
        method: 'post',
        headers: {
          'Authorization': jwt,
          'content-type': 'application/json'
        },
        body : JSON.stringify({
          mpno : props.DataPipe.mpno,
        })
      }).then(resonse => resonse.json())
      .then(resonse => {
        setlikeCnt(resonse);
        setloginUserLikeState('Y');
        props.likeReCnt(resonse,props.DataPipe.mpno,'Y');
      });
    }
    function cancelLike() {
      console.log(props.DataPipe.mpno);
      fetch('/cancelMainPostLike', {
        method: 'post',
        headers: {
          'Authorization': jwt,
          'content-type': 'application/json'
        },
        body : JSON.stringify({
          mpno : props.DataPipe.mpno,
        })
      }).then(resonse => resonse.json())
      .then(resonse => {
        setlikeCnt(resonse);
        setloginUserLikeState('N');
        props.likeReCnt(resonse,props.DataPipe.mpno,'N');
      });
    }

    return (
    <div className="popup-picture" id="ModifyModal1" ref={wrapperRef} >
      <div className="popup-picture-image-wrap" style={{}}
        onMouseOver={(event) =>{ 
          setshowBtn('block');
        }}
        onMouseOut={(event) =>{ 
          setshowBtn('none');
      }}
      >
      <LeftBtn backIdx={backIdx} displayState={showBtn} btnState={btnState}/>
      <figure className="popup-picture-image" style={{width:"1120px",height:"100%",}}>
        <img src={"http://localhost:8080/image/"+Idx+props.DataPipe.imgCode+'.jpg'} alt="cover-04" id="imgSize" style={{objectFit: "contain"}}/>
      </figure>
      <RightBtn displayState={showBtn} nextIdx={nextIdx} btnState={btnState}/>

    </div>
      <div className="popup-close-button popup-picture-trigger" onClick={offModal}>
        <img width={20} height={20} src={XIcon} alt ="icon"/>
      </div>

      <div className="widget-box no-padding" id='CommentBox' >
        <div className="widget-box-scrollable" >
          <div className="widget-box-settings" >
            <div className="post-settings-wrap">
              {/* <div className="post-settings widget-box-post-settings-dropdown-trigger">
                <img className="icon" src={TDots} alt ="icon"/>
              </div> */}

              <div className="simple-dropdown widget-box-post-settings-dropdown" style={{display:"none"}}>
                <p className="simple-dropdown-link">수정하기</p>

                <p className="simple-dropdown-link">삭제하기</p>
              </div>
            </div>
          </div>

          <div className="widget-box-status" >
            <div className="widget-box-status-content" >
              <div className="" >
              <div className="user-status" style={{display:"flex",marginRight:"auto"}}>
                  <a className="user-status-avatar" >
                  {props.DataPipe.userProfileImg ==='default' ? 
                    <img src={userImage} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                    :
                    <img src={"http://localhost:8080/profile/"+props.DataPipe.userProfileImg} alt ="face"  width='45' height='45' style={{borderRadius: "80px", objectFit: "cover", cursor:"Pointer"}}/>
                  }
                  </a>
                  <p className="user-status-title medium" >
                    <div style={{display:"flex", marginTop:"6px"}}>
                    <a className="bold" href="profile-timeline.html"  style={{textAlign:"left"}}>{props.DataPipe.userId}</a> 
                    </div>
                    <p className="user-status-text small" >{transDate(props.DataPipe.writeDate)}</p>
                  </p>
                </div>
              </div>
              <div style={{overflow: "auto", textOverflow: "clip"}}>
                <p className="widget-box-status-text" style={{textAlign:"left", marginTop:"15px",}}>{props.DataPipe.content}</p>
              </div>
              <div class="content-actions" style={{display:"flex"}}>
                <div class="content-action" style={{marginLeft:"auto",paddingRight:"10px"}}>
                <div class="meta-line">
                    <p class="meta-line-link">{"좋아요 "+likeCnt+"개"}</p>
                  </div>
                  <div class="meta-line">
                    <p class="meta-line-link">{"댓글 "+replyCnt+"개"}</p>
                  </div>
                  
                </div>
              </div>
            </div>
            
            <div class="post-options">
              <div class="post-option-wrap">
              {loginUserLikeState === 'Y' ?
                <div class="post-option reaction-options-dropdown-trigger" onClick={cancelLike}>
                  <img className="icon" width={20} height={20} src={ThumbsUpIcon} style={{ filter: "opacity(0.5) drop-shadow(0 0 0 #426BFA)"}} alt ="icon"/>
                  <a style={{fontSize:"14px",color:"#426BFA"}}>좋아요</a>
                </div>
              :
                <div class="post-option reaction-options-dropdown-trigger" onClick={pushLike}>
                  <img className="icon" width={20} height={20} src={ThumbsUpIcon} alt ="icon"/>
                  <a style={{fontSize:"14px"}}>좋아요</a>
                </div>
              }
              </div>

              <div class="post-option-wrap">
                <div class="post-option reaction-options-dropdown-trigger">
                  <img className="icon" width={20} height={20} src={CommentIcon} alt ="icon"/>
                  <a style={{fontSize:"14px"}}>댓글</a>
                </div>
              </div>

            </div>
          </div>

          <div className="post-comment-list" style={{height:"420px", borderBottom:"1px solid #eaeaf5", scroll:"auto"}}>
            {replyData.map((data,i) => (
                <div>
                  <ReplyItem  replyData={replyData[i]} replyPagingOn={replyPagingOn} lastIdx={replyData.length} nowIdx={i} RemoveRereply={RemoveRereply} letsRereply={letsRereply} modifyRereply={modifyRereply} modifyReply={modifyReply} setreplyData={setreplyData} RemoveReply={RemoveReply} setSwalOn={setSwalOn}/>
                  {i===replyData.length-1 ? <div ref={setTarget}></div>:''}
                </div>
                
                  ))
            }
          </div>
           
        </div>
       
        <div className="post-comment-form bordered-top" style={{display:"flex",padding: "10px"}}>
          <form className="form">
            <div className="form-row">
              <div className="form-item">
                <div className="form-input small">
                  <input type="text" id="popup-post-reply" value={getcontent} onChange={onChange} placeholder="댓글 달기" name="popup_post_reply" style={{ width:"290px"}}/>
                </div>
              </div>
            </div>
          </form>
          <p className="button small secondary confirmBtn"onClick={letsPost} style={{marginTop:"0px", marginRight: "4px", marginLeft: "4px",marginBottom: "4px",height:"46px", paddingTop:"4px"}}>개시</p>
        </div>
      </div>
    </div>
    )
  
});

export default DetailModal;
