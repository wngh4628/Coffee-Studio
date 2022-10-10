
import React, {useState, useEffect, useRef,Component, forwardRef,useImperativeHandle} from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import backImg from '../static/img/cover/01.jpg';
import MypageSendReqestItem from "../mypage/MypageSendReqestItem";

const MypageFriend = forwardRef((props, ref) =>{
    const [SendReqestData, setSendReqestData] = useState([]);

    useEffect(() => { 
        setSendReqestData(props.SendReqestData);
    }, []);

    function removeFriendData(data){
        console.log(data);
        let aa = SendReqestData.filter(dataArr => dataArr.friendsNo !== data)
        console.log(aa);
        setSendReqestData(SendReqestData.filter(dataArr => dataArr.friendsNo !== data));
    }


    return (
    <div  style={{margin:"10px auto auto",width:"800px", marginTop:"10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
         {SendReqestData.map((data,i) => (
            <MypageSendReqestItem removeSendData={props.removeSendData} removeData = {removeFriendData} loginUserMyPage={props.loginUserMyPage} SendReqestData={SendReqestData[i]}/>
            ))
         }
    </div>
    )
});

export default MypageFriend;
