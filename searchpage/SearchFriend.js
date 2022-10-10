
import React, {useState, useEffect, useRef,Component, forwardRef,useImperativeHandle} from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import backImg from '../static/img/cover/01.jpg';
import SearchFriendItem from "../searchpage/SearchFriendItem";

const MypageFriend = forwardRef((props, ref) =>{
    const [FriendData, setFriendData] = useState([]);

    useEffect(() => { 
        setFriendData(props.myFriendData);
    }, []);

    

    return (
    <div  style={{margin:"10px auto auto",width:"800px", marginTop:"10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
         {FriendData.map((data,i) => (
            <SearchFriendItem friendData={FriendData[i]}/>
            ))
         }
    </div>
    )
});

export default MypageFriend;
