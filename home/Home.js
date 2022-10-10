
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useSelector, useDelector, useDispatch, connect} from 'react-redux';
import {createStore} from 'redux';
import { useNavigate } from "react-router-dom";
import Header from "../fragment/header";
import WriteBody from "../home/WriteBody";
import ModifyWriteBody from "../home/ModifyWriteBody";
import DetailModal from "../home/DetailModal";
import PostBody from "../home/PostBody";
import SockJS from 'sockjs-client'
import Stomp from 'stompjs';
import Swal from 'sweetalert2';

const Home = (props) => {
    let jwt = localStorage.getItem('Authorization');
   
    const movePage = useNavigate();
    const [UserInfo, setUserInfo] = useState(); 
    const pagingOn = useRef(true);
    const paging = useRef(0);
    // const [BodyPart, setBodyPart] = useState(''); //BodyPart
    const childRef = useRef();
    const WriteBodyRef = useRef();
    const [BoardData, setBoardData] = useState([]); 
    const [isDetailClicked, setIsDetailClicked] = useState(false);//상세 보기 켜는
    const [isWriteBodyClicked, setisWriteBodyClicked] = useState(false);//글 작성 적는 
    const [ModifyTag, setModifyTag] = useState(''); //수정 페이지 태그
    const [WriteBodyTag, setWriteBodyTag] = useState(''); //글쓰기 호출용
    const [isModalClicked, setIsModalClicked] = useState(false);
    // let sock = new SockJS('http://localhost:8080/chat'); //웹소켓 연결
    //let SockOJ = useRef(Stomp.over(sock));
    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight-1 && pagingOn.current === true) {
            pagingOn.current = false; 
            console.log("밑 바닥");
            paging.current = Number(paging.current)+8;
            letsPaging();
        }
    }
    
    const letsPaging = () =>{
        console.log(paging.current);
       
        fetch('/getMainPost', {//게시글 불러오기
            method: 'post',
            headers: {
                'Authorization': jwt,
                'content-type': 'application/json'
            },
            body : JSON.stringify({
                nowPageNo : paging.current
            })
            }).then(resonse => resonse.json())
            .then(resonse => {//프로미스
                if(resonse.length>0){
                    for(let i  = 0; i<resonse.length; i++){
                        if(resonse[i].subList.length===1){
                            resonse[i].ImgBody='ImgBody1';
                        }else if(resonse[i].subList.length===2){
                            resonse[i].ImgBody='ImgBody2';
                        }else if(resonse[i].subList.length===3){
                            resonse[i].ImgBody='ImgBody3';
                        }else if(resonse[i].subList.length===4){
                            resonse[i].ImgBody='ImgBody4';
                        }else if(resonse[i].subList.length===5){
                            resonse[i].ImgBody='ImgBody5';
                        }else if(resonse[i].subList.length===0){
                            resonse[i].ImgBody='ImgBody';
                        }else{
                            console.log("이상!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        }
                    }
                    childRef.current.letsPaging(resonse);
                    pagingOn.current = true; 
                }
         });
        
    }
    useEffect(() => { 
        if(jwt !== null){
            fetch('/getMainPost', {//게시글 불러오기
                method: 'post',
                headers: {
                    'Authorization': jwt,
                    'content-type': 'application/json'
                },
                body : JSON.stringify({
                    nowPageNo : paging.current
                })
                }).then(resonse => resonse.json())
                .then(resonse => {
                    console.log(resonse);
                    setUserInfo(resonse.userinfo);
                    setBoardData(resonse.postinfo);
                
            });
            
            
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }else{
            Swal.fire({
                text:'로그인 후 이용 가능합니다.',
                icon: 'warning',
                confirmButtonText: '완료', // confirm 버튼 텍스트 지정
                confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
              }).then(response => {
                    movePage('/loginForm');
              });
          
        }
    }, []);

    useEffect(() => {
        if(isDetailClicked===true){
            document.body.style= `overflow: hidden`;
            return () => document.body.style = `overflow: auto`
        }
      }, [isDetailClicked])

    useEffect(() => { //글 쓰기 켜는 
        if(isWriteBodyClicked===true){
            document.body.style= `overflow: hidden`;
            return () => document.body.style = `overflow: auto`
        }
    }, [isWriteBodyClicked])

    function OnOffWriteBody(){ //게시글 작성 온 오프
        if(isWriteBodyClicked===true){
            setisWriteBodyClicked(false);
        }else{
            setisWriteBodyClicked(true);
        }
    }
    function PostWrite(Data) { //게시글 작성
        console.log(Data);
        console.log("!!!!!$#$#$");
        let newData = [Data]
        for(let i=0; i<BoardData.length;i++){
          newData = [...newData, BoardData[i]]
        }
        console.log(newData);
        setBoardData(newData);
    }

    function PostModify(Data) { //게시글 수정
        console.log(Data);
        console.log("모디파이!!!!!");
        let newArr = [];
        for(let i=0; i<BoardData.length;i++){
          if(BoardData[i].mpno=== Data.mpno){
            newArr = [...newArr,Data];
          }else{
            newArr = [...newArr,BoardData[i]];
          }
          setBoardData(newArr);
        }
    }
    function PostDelete(Data) { //게시글 삭제
        console.log(Data);
        console.log("삭제!!!!!");
        fetch('/removeMainPost', {
            method: 'post',
            headers: {
              'Authorization': jwt,
              'content-type': 'application/json'
            },
            body : JSON.stringify({
              mpno : Data.mpno
            })
          }).then(resonse => {
            setBoardData(BoardData.filter(data => data.mpno !== Data.mpno));
          });
        
    }
    function PostModifyOnOff(Data) {//게시글 수정 온 오프
        console.log(Data);
        if(Data===undefined){
            setModifyTag("");
        }else{
            setIsModalClicked(true);
            setModifyTag(
                <div style={{display:"flex",position:"fixed",top:"0",left: "0", bottom: "0", right: "0",justifyContent:"center",alignItems:"center", zIndex : "100",backgroundColor : "rgba(0,0,0,0.6)"}}>
                    < ModifyWriteBody  DataPipe={Data} PostModify={PostModify}  PostModifyOnOff={PostModifyOnOff} setIsModalClicked={setIsModalClicked}/>
                </div>
            );
        }
    }
   
    return (
        <div >
            <Header id="body_open"  UserInfo={UserInfo} OnOffWriteBody={OnOffWriteBody} />
            
            {isWriteBodyClicked === true ? 
                <div style={{display:"flex",position:"fixed",top:"0",left: "0", bottom: "0", right: "0",justifyContent:"center",alignItems:"center", zIndex : "100",backgroundColor : "rgba(0,0,0,0.6)"}}>
                    < WriteBody UserInfo ={UserInfo} setisWriteBodyClicked={setisWriteBodyClicked} PostWrite={PostWrite} ref={WriteBodyRef}/>
                </div>
            :""}
            {ModifyTag}
            
          
            <PostBody Data ={BoardData}  UserInfo={UserInfo} PostModifyOnOff={PostModifyOnOff} PostDelete={PostDelete}/>
           
        </div>
    )
}

export default Home;
