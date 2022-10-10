import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider,useSelector, useDelector, useDispatch, connect} from 'react-redux';
import {createStore} from 'redux';
import  "../static/css/vendor/bootstrap.min.css";
import  "../static/css/styles.min.css";
import  "../static/css/vendor/simplebar.css";
import  "../static/css/show_widget_font.css";
import  "../static/css/dogbox.css";
import  "../static/css/show_usernull_side.css";
import  "../static/css/userInfo/userLogin.css";
import Header from "../fragment/header";
import Body from "../mypage/userInfoModifyBody";

function reducer(currentState, action) {
    let data = '';
    let jwt = localStorage.getItem('Authorization');
  
    
    if(currentState=== undefined){
        return {
            jwt:jwt,
            userId:'',
            getApiData:data,
            formdata:'',
            addPost:'false',
            setBodyBack:'body',
            userProfileImg:'',
            userCoverImg:''
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
        newState.setBodyBack =action.getBody;
    }
    return newState;   
}
const store = createStore(reducer);

const userInfoModify = forwardRef((props, ref) =>{
    const [loginUserNo, setloginUserNo] = useState('');
    const [BodyTag, setBodyTag] = useState('');
    useEffect(() => {
        if(loginUserNo!==''){
            setBodyTag(<Body/>);
        }
    }, [loginUserNo]);

      return (
          <div>
            <Provider store={store} >
              <Header setloginUserNo={setloginUserNo}/>
              {BodyTag}
            </Provider>
          </div>
      )
});

export default userInfoModify;
