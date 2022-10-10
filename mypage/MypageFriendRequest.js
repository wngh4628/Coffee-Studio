
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import backImg from '../static/img/cover/01.jpg';
import MypageFriendRequestItem from "../mypage/MypageFriendRequestItem";

function MypageFriend(props) {
    const [RequestData, setRequestData] = useState([]);

    useEffect(() => { 
       setRequestData(props.MypageFriendRequestData);
    }, []);

    function removeFriendRequest(friendsNo, WAYF,data) {//친구 요청 삭제하기
        console.log(friendsNo);
        let a1 = RequestData.filter(dataArr => dataArr.friendsNo !== friendsNo);
        console.log(a1);
        setRequestData(RequestData.filter(dataArr => dataArr.friendsNo !== friendsNo));
        if(WAYF==='add'){
            props.addFriendData(data);
        }
       
    }


    return (
    <div  style={{margin:"10px auto auto",width:"800px", marginTop:"10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
         {RequestData.map((data,i) => (
            <MypageFriendRequestItem removeFriendRequest={removeFriendRequest} friendData={RequestData[i]}/>
            ))
         }
    </div>
    )
}

export default MypageFriend;
