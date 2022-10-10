
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useSelector, useDelector, useDispatch, connect} from 'react-redux';
import {createStore} from 'redux';
import Header from "../fragment/header";
import PostBody from "../home/PostBody";
import WriteBody from "../home/WriteBody";
import MypageHeader from "../mypage/MypageHeader";
import MypageSelect from "../mypage/MypageSelect";
import DetailModal from "../home/DetailModal";
import ModifyWriteBody from "../home/ModifyWriteBody";
import MypageFriend from "../mypage/MypageFriend";
import MypageFriendRequest from "../mypage/MypageFriendRequest";
import MypageSendReqest from "../mypage/MypageSendReqest";
import '../static/css/styles.min.css';
import '../static/css/vendor/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client'
import Stomp from 'stompjs';

function reducer(currentState, action) {
    let data = '';
    let jwt = localStorage.getItem('Authorization');

    if(currentState=== undefined){
        return {
            jwt:jwt,
            userId:'',
            userNo:'',
            userEmail:'',
            userProfileImg:'',
            userCoverImg:'',
            getApiData:data,
            formdata:'',
            addPost:'false',
            setBodyBack:'body',
            userEmail:'',
        }
    }
    
    const newState = {...currentState}
    if(action.type==='setUserInfo'){
        newState.userId =action.userId;
        newState.userEmail =action.userEmail;
        newState.userProfileImg =action.userProfileImg;
        newState.userCoverImg =action.userCoverImg;
        newState.userNo =action.userNo;
    }
    if(action.type==='setFormdata'){
        newState.formdata =action.setFormdata;
    }
    if(action.type==='setBodyBack'){
        console.log("1111111232");
        newState.setBodyBack =action.getBody;
    }
    
    return newState;   
}
const store = createStore(reducer);

const MypageHome = (props) => {
    let jwt = localStorage.getItem('Authorization');
    const location = useLocation(); //전 페이지에서 넘겨 받은 변수
    const childRef = useRef();
    const addFriendRef = useRef();
    // const modifyPost = useRef();
    const [optionSelect, setoptionSelect] = useState('post'); 
    const [getFormData, setFormData] = useState(""); //글 올린 뒤 폼데이터 저장
    const [postBodyDisplay, setpostBodyDisplay] = useState('');
    const [WriteBodyTag, setWriteBodyTag] = useState(''); 
    // const [recentPage, setrecentPage] = useState(0); 
    const [EventSignal, setSignal] = useState(''); //함수 호출용
    const [BodyPart, setBodyPart] = useState(''); //BodyPart
    const [isModalClicked, setIsModalClicked] = useState(false);
    const [isDetailClicked, setIsDetailClicked] = useState(false);
    const [DataPipe, setDataPipe] = useState(''); //수정 눌렀을 때, 수정할 데이터 보내주기
    const [ModifyedDate, setModifyedDate] = useState(''); // 수정 완료 후, 수정된 데이터 
    const [BodyBack, setBodyBack] = useState('body');
    const [MypageHeaderTag, setMypageHeaderTag] = useState('');
    const [myFriendTag, setmyFriendTag] = useState('');
    const [MypageFriendRequestTag, setMypageFriendRequestTag] = useState('');
    const [sendRequestTag, setsendRequestTag] = useState('');
    const [SendReqestData, setSendReqestData] = useState(''); //내가 보낸 친구 요청 정보
    const [selectPageTag, setselectPageTag] = useState(''); //게시글 친구 요청 보낸 요청 넘기는 바
    const pagingOn = useRef(false);
    const paging = useRef(0);
    const userNo = useRef('');
    const userPaging = useRef('post'); //페이징할 페이지
    const [myFriendData, setmyFriendData] = useState([]);
    const [MypageFriendRequestData, setMypageFriendRequestData] = useState([]);
    const [loginUserNo, setloginUserNo] = useState(''); //넘어온 페이지가 로그인된 유저의 mypage인지 아닌지 구별하기 위한 userNo
    const loginUserMyPage = useRef('N'); //로그인된 유저의 페이지인지 아닌지
    const [getUserNo, setgetUserNo] = useState(); 
    var sock = new SockJS('http://localhost:8080/chat'); //웹소켓 연결
    let SockOJ = useRef(Stomp.over(sock));
    const LoginUserNoRef = useRef('');
    const HeaderRef = useRef();

    useEffect(() => {
        if(EventSignal!==''){
            childRef.current.addPost(EventSignal);
            setSignal('');
        }
        
        if(ModifyedDate!==''){
            console.log(ModifyedDate);
            childRef.current.modifyPost(ModifyedDate);
            setModifyedDate('');
        }
       
    }, [EventSignal,ModifyedDate]);

 
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight && pagingOn.current === true && userPaging.current==='post') {
            pagingOn.current = false; 
            console.log("밑 바닥");
            paging.current = Number(paging.current)+8;
            letsPaging();
        }
    }

    const letsPaging = () =>{
        console.log('letsPaging');
        fetch('/getMyPost', {//게시글 불러오기
            method: 'post',
            headers: {
                'Authorization': jwt,
                'content-type': 'application/json'
            },
            body : JSON.stringify({
                nowPageNo : paging.current,
                userNo : getUserNo,
            })
            }).then(resonse => resonse.json())
            .then(resonse => {
                if(resonse.postData.length>0){
                    console.log(resonse);
                    for(let i  = 0; i<resonse.postData.length; i++){
                        if(resonse.postData[i].subList.length===1){
                            resonse.postData[i].ImgBody='ImgBody1';
                        }else if(resonse.postData[i].subList.length===2){
                            resonse.postData[i].ImgBody='ImgBody2';
                        }else if(resonse.postData[i].subList.length===3){
                            resonse.postData[i].ImgBody='ImgBody3';
                        }else if(resonse.postData[i].subList.length===4){
                            resonse.postData[i].ImgBody='ImgBody4';
                        }else if(resonse.postData[i].subList.length===5){
                            resonse.postData[i].ImgBody='ImgBody5';
                        }else if(resonse.postData[i].subList.length===0){
                            resonse.postData[i].ImgBody='ImgBody';
                        }else{
                            console.log("이상!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        }
                    }
                    childRef.current.letsPaging(resonse.postData);
                    pagingOn.current = true; 
                }
         });
    }
    function sendSocket(data,WAYF){
        console.log(data);
        if(WAYF==='alert'){
            SockOJ.current.send("/app/chat/"+LoginUserNoRef.current,{},JSON.stringify(
                {
                  sendUserNo: LoginUserNoRef.current,
                  wayf:WAYF,
                  keyNo: data.mpno, //mpno
                  getUserNo: data.userNo,
                  category:'like',
                  massage:'!!!!!!!!!!',
                }
              ))
        }else if(WAYF==='chat'){
            console.log(data);
            console.log(WAYF);

            SockOJ.current.send("/app/chat/"+LoginUserNoRef.current,{},JSON.stringify(
                {
                  sendUserNo: LoginUserNoRef.current,
                  wayf:WAYF, //chat
                  keyNo: data.RNo, //RNo
                  getUserNo: data.getUserNo,
                  category:data.category, //text or image
                  massage:data.textMsg,
                }
              ))
        }
    }
    useEffect(() => {
        if(getUserNo!==''){
            console.log("UserNo:"+getUserNo);
            SockOJ.current.connect({}, () =>{
                console.log("UserNo:"+getUserNo);
                SockOJ.current.send("/app/join", {},JSON.stringify(getUserNo));

                SockOJ.current.subscribe('/queue/addChatToClient/'+getUserNo, function(messageDTO){
                    const messagedto = JSON.parse(messageDTO.body);
                    console.log(messagedto);
                    console.log(messagedto.wayf);
                    if(messagedto.wayf==='alert'){
                        HeaderRef.current.getAlert();
                    }else if(messagedto.wayf==='chat'){
                        console.log('chat');
                        console.log(messagedto);
                        HeaderRef.current.addChattingData(messagedto);
                    }
                });
            },) 
            console.log(location.state);
            console.log(location.state.userId);
            fetch('/getMyPost', {//게시글 불러오기
                method: 'post',
                headers: {
                    'Authorization': jwt,
                    'content-type': 'application/json'
                },
                body : JSON.stringify({
                    nowPageNo : 0,
                    userNo : location.state.userId,
                })
                }).then(resonse => resonse.json())
                .then(resonse => {
                    console.log("이상!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                for(let i  = 0; i<resonse.postData.length; i++){
                    if(resonse.postData[i].subList.length===1){
                        resonse.postData[i].ImgBody='ImgBody1';
                    }else if(resonse.postData[i].subList.length===2){
                        resonse.postData[i].ImgBody='ImgBody2';
                    }else if(resonse.postData[i].subList.length===3){
                        resonse.postData[i].ImgBody='ImgBody3';
                    }else if(resonse.postData[i].subList.length===4){
                        resonse.postData[i].ImgBody='ImgBody4';
                    }else if(resonse.postData[i].subList.length===5){
                        resonse.postData[i].ImgBody='ImgBody5';
                    }else if(resonse.postData[i].subList.length===0){
                        resonse.postData[i].ImgBody='ImgBody';
                    }else{
                        resonse.postData[i].ImgBody='ImgBody';
                    }
                }
                if(getUserNo===resonse.headData.userNo){
                    loginUserMyPage.current = 'Y';
                }
                setSendReqestData(resonse.sendFriendRequst);
                setmyFriendData(resonse.myfriend);
                setMypageFriendRequestData(resonse.friendRequst);
                setselectPageTag(<MypageSelect loginUserMyPage={loginUserMyPage} setoptionSelect={setoptionSelect}/>);
                setMypageHeaderTag(<MypageHeader userData = {resonse.headData}/>);
                setBodyPart(<PostBody postBodyDisplay={postBodyDisplay} setDataPipe={setDataPipe} BodyBack={BodyBack} Data ={resonse.postData} getFormData={EventSignal} ref={childRef} setIsDetailClicked={setIsDetailClicked} setIsModalClicked={setIsModalClicked} />);
                pagingOn.current = true; 
            });
        }
      }, [getUserNo])

    useEffect(() => { 
        fetch('/getUserInfo', {
			method: 'post',
			headers: {
				'Authorization': jwt
			},
		}).then(res => res.json())
		.then(resonse => {
            setgetUserNo(resonse.userNo);
            
		});
       
    }, [loginUserNo]);
    
    useEffect(() => { 
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        
    }, []);

   function addFriendData(data){ //친구 요청 페이지에서 수락 누르면 내 친구 페이지에 추가 해주는 함수
        
        setMypageFriendRequestData(MypageFriendRequestData.filter(dataArr => dataArr.friendsNo !== data.friendsNo));

        let newData = [data];
        for(let i=0; i<myFriendData.length;i++){
          newData = [...newData, myFriendData[i]]
        }
        setmyFriendData(newData);
   }
   
   function removeFriendData(data){ // 내 친구 페이지에서 친구 삭제
        setmyFriendData(myFriendData.filter(dataArr => dataArr.friendsNo !== data));
   }
   function removeSendData(data){ // 내 친구 페이지에서 친구 삭제
    setSendReqestData(SendReqestData.filter(dataArr => dataArr.friendsNo !== data));
    }
    
    const countCnt = (cnt, mpno) => {
        childRef.current.changeCnt(cnt, mpno);
    }
    const likeReCnt = (likeCnt, mpno, WAYF) => {
        childRef.current.likeReCnt(likeCnt, mpno,WAYF);
    }

    
    useEffect(() => { 
        
        setWriteBodyTag(<WriteBody  setFormData={setFormData} setSignal={setSignal} />);
       if(BodyPart!==''){
        if(optionSelect === 'post'){
            childRef.current.changeDisplay('post');
            setmyFriendTag('');
            userPaging.current = 'post';
            setMypageFriendRequestTag('');
            setsendRequestTag('');
        }else if(optionSelect === 'friend'){
            userPaging.current = 'friend';
            setWriteBodyTag('');
            setMypageFriendRequestTag('');
            setsendRequestTag('');
            childRef.current.changeDisplay('friend');
            setmyFriendTag(<MypageFriend removeFriendData={removeFriendData} ref={addFriendRef} loginUserMyPage={loginUserMyPage} myFriendData={myFriendData}/>);
        }else if(optionSelect === 'friendRequest'){
            userPaging.current = 'friendRequest';
            setWriteBodyTag('');
            setmyFriendTag('');
            setsendRequestTag('');
            setMypageFriendRequestTag(<MypageFriendRequest  addFriendData={addFriendData} MypageFriendRequestData={MypageFriendRequestData}/>);
            childRef.current.changeDisplay('friendRequest');
        }else if(optionSelect === 'sendRequest'){
            userPaging.current = 'sendRequest';
            setWriteBodyTag('');
            setmyFriendTag('');
            setMypageFriendRequestTag('');
            setsendRequestTag(<MypageSendReqest removeSendData={removeSendData} SendReqestData={SendReqestData}/>);
            childRef.current.changeDisplay('sendRequest');
        }
       }
       
    }, [optionSelect]);

    useEffect(() => {
        if(isDetailClicked===true){
            document.body.style= `overflow: hidden`;
            return () => document.body.style = `overflow: auto`
        }
      }, [isDetailClicked])

      function letsSocketConnect(userNo){
        console.log('!!!!!!!!!!!!!22'+userNo);
        LoginUserNoRef.current = userNo;
    }

    return (
        <div >
            <Provider store={store} >
                <Header sendSocket={sendSocket} letsSocketConnect={letsSocketConnect} setloginUserNo={setloginUserNo} ref={HeaderRef}/>
                {MypageHeaderTag}
                {selectPageTag}
                {WriteBodyTag}
                {myFriendTag}
                {sendRequestTag}
                {MypageFriendRequestTag}
                {isDetailClicked === true ? <DetailModal likeReCnt={likeReCnt} countCnt={countCnt} setIsDetailClicked={setIsDetailClicked} setDataPipe={setDataPipe} DataPipe={DataPipe} /> : '' }
                {BodyPart}
                {isModalClicked === true ? <ModifyWriteBody setModifyedDate={setModifyedDate} DataPipe={DataPipe}  setIsModalClicked={setIsModalClicked} />: '' }
            </Provider>
        </div>
    )
}

export default MypageHome;
