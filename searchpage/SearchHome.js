
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useSelector, useDelector, useDispatch, connect} from 'react-redux';
import {createStore} from 'redux';
import Header from "../fragment/header";
import PostBody from "../home/PostBody";
import MypageHeader from "../mypage/MypageHeader";
import SearchSelect from "../searchpage/SearchSelect";
import DetailModal from "../home/DetailModal";
import ModifyWriteBody from "../home/ModifyWriteBody";
import SearchFriend from "../searchpage/SearchFriend";
import Notfound from "../searchpage/Notfound";
import NotfoundFriend from "../searchpage/NotfoundFriend";
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
    const [postBodyDisplay, setpostBodyDisplay] = useState('');
    const [EventSignal, setSignal] = useState(''); //함수 호출용
    const [BodyPart, setBodyPart] = useState(''); //BodyPart
    const [isModalClicked, setIsModalClicked] = useState(false);
    const [isDetailClicked, setIsDetailClicked] = useState(false);
    const [DataPipe, setDataPipe] = useState(''); //수정 눌렀을 때, 수정할 데이터 보내주기
    const [ModifyedDate, setModifyedDate] = useState(''); // 수정 완료 후, 수정된 데이터 
    const [NotfoundFriendTag, setNotfoundFriendTag] = useState('');
    const [BodyBack, setBodyBack] = useState('body');
    const LoginUserNoRef = useRef('');
    const [myFriendTag, setmyFriendTag] = useState('');
    const pagingOn = useRef(false);
    const paging = useRef(0);
    const userNo = useRef('');
    const {keyword} = location.state; 
    const userPaging = useRef('post'); //페이징할 페이지
    const [myFriendData, setmyFriendData] = useState([]);
    const [loginUserNo, setloginUserNo] = useState(''); //넘어온 페이지가 로그인된 유저의 mypage인지 아닌지 구별하기 위한 userNo
    let sock = new SockJS('http://localhost:8080/chat'); //웹소켓 연결
    let SockOJ = useRef(Stomp.over(sock));
    const HeaderRef = useRef();
    const [getUserNo, setgetUserNo] = useState(); 

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
    useEffect(() => {
        // timerId.current = setInterval(()=>{
        //     resetTime.current -= 1;
        //     setSec(resetTime.current);
        // }, 1000); //타이머
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
            
        }
      }, [getUserNo])

    const letsPaging = () =>{
        console.log('letsPaging');
        const {keyword} = location.state; 
        fetch('/searchPage', {//게시글 불러오기
            method: 'post',
            headers: {
                'Authorization': jwt,
                'content-type': 'application/json'
            },
            body : JSON.stringify({
                nowPageNo : paging.current,
                keyword : keyword,
            })
            }).then(resonse => resonse.json())
            .then(resonse => {
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
                    resonse.postData[i].ImgBody='ImgBody5';
                    console.log("이상!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                }
            }

            childRef.current.letsPaging(resonse.postData);
            pagingOn.current = true; 
                
         });
    }
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
            const {keyword} = location.state; 
            console.log(keyword);
        fetch('/searchPage', { //게시글 불러오기
            method: 'post',
            headers: {
                'Authorization': jwt,
                'content-type': 'application/json'
            },
            body : JSON.stringify({
                nowPageNo : 0,
                keyword : keyword,
            })
            }).then(resonse => resonse.json())
            .then(resonse => {
                
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
                    resonse.postData[i].ImgBody='ImgBody5';
                    console.log("이상!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                }
            }
            setmyFriendData(resonse.myfriend);
            if(resonse.postData.length>0){
                setBodyPart(<PostBody postBodyDisplay={postBodyDisplay} setDataPipe={setDataPipe} BodyBack={BodyBack} Data ={resonse.postData} getFormData={EventSignal} ref={childRef} setIsDetailClicked={setIsDetailClicked} setIsModalClicked={setIsModalClicked} />);
            }else{
                setBodyPart(<Notfound ref={childRef}  keyword={keyword}/>);
            }
            pagingOn.current = true; 
        });
        
    }, []);
    
    useEffect(() => { 
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        
    }, []);

    function letsSocketConnect(userNo){
        LoginUserNoRef.current = userNo;
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
   
    const countCnt = (cnt, mpno) => {
        childRef.current.changeCnt(cnt, mpno);
    }
    const likeReCnt = (likeCnt, mpno, WAYF) => {
        childRef.current.likeReCnt(likeCnt, mpno,WAYF);
    }

    
    useEffect(() => { 
        console.log('!!!!!!!!!!!');
        console.log(BodyPart!==' ');
       if(BodyPart!==''){
        console.log('!!!!!!!!!!!');
        console.log(optionSelect);
        if(optionSelect === 'post'){
            childRef.current.changeDisplay('post');
            setmyFriendTag('');
            userPaging.current = 'post';
        }else if(optionSelect === 'friend'){
            userPaging.current = 'friend';
            childRef.current.changeDisplay('friend');
            if(myFriendData.length>0){
                setmyFriendTag(<SearchFriend  ref={addFriendRef}  myFriendData={myFriendData}/>);
            }else{
                setmyFriendTag(<NotfoundFriend keyword={keyword}/>);
            }
        }
       }
       
    }, [optionSelect]);

    useEffect(() => {
        if(isDetailClicked===true){
            console.log('!!!!!!!!!!!');
            console.log(isDetailClicked);
            document.body.style= `overflow: hidden`;
            return () => document.body.style = `overflow: auto`
        }
      }, [isDetailClicked]);


    return (
        <div >
            <Provider store={store} >
                <Header sendSocket={sendSocket} letsSocketConnect={letsSocketConnect} SockOJ={SockOJ} ref={HeaderRef}/>
                <SearchSelect  setoptionSelect={setoptionSelect}/>
                {myFriendTag}
                {isDetailClicked === true ? <DetailModal likeReCnt={likeReCnt} countCnt={countCnt} setIsDetailClicked={setIsDetailClicked} setDataPipe={setDataPipe} DataPipe={DataPipe} /> : '' }
                {BodyPart}
                {isModalClicked === true ? <ModifyWriteBody setModifyedDate={setModifyedDate} DataPipe={DataPipe}  setIsModalClicked={setIsModalClicked} />: '' }
            
            </Provider>
        </div>
    )
}

export default MypageHome;
