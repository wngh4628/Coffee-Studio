
import React, {useState, useEffect, useRef,Component, forwardRef,useImperativeHandle} from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import backImg from '../static/img/cover/01.jpg';
import MypageFriendItem from "../mypage/MypageFriendItem";

const MypageFriend = forwardRef((props, ref) =>{
    const [FriendData, setFriendData] = useState([]);

    useEffect(() => { 
        setFriendData(props.myFriendData);
    }, []);

    function removeFriendData(data){
        console.log(data);
        let aa = FriendData.filter(dataArr => dataArr.friendsNo !== data)
        console.log(aa);
        setFriendData(FriendData.filter(dataArr => dataArr.friendsNo !== data));
   }

    return (
    <div  style={{margin:"10px auto auto",width:"800px", marginTop:"10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
         {FriendData.map((data,i) => (
            <MypageFriendItem removeFriendData={props.removeFriendData} removeData = {removeFriendData} loginUserMyPage={props.loginUserMyPage} friendData={FriendData[i]}/>
            ))
         }
    </div>
    )
});

export default MypageFriend;
