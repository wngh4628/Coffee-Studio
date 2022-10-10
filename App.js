import './App.css';
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useSelector, useDelector, useDispatch, connect} from 'react-redux';
import {createStore} from 'redux';
import Home from './home/Home';
import Mypage from './mypage/MypageHome';
import UserInfoModify from './mypage/userInfoModify';
import UserLogin from './UserInfo/userLogin';
import UserJoin from './UserInfo/userJoin';
import SearchHome from './searchpage/SearchHome';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function reducer(currentState, action) {
  let data = '';
  let jwt = localStorage.getItem('Authorization');
  
  if(currentState=== undefined){
      return {
          jwt:jwt,
          userId:'',
          IpAdress:"http://43.200.128.40:8080",
          setBodyBack:'body',
      }
  }

  const newState = {...currentState}
  if(action.type==='setBodyBack'){
    newState.setBodyBack =action.getBody;
  }
  return newState;   
}
const store = createStore(reducer);

function App() {
  return (
    <div className="App">
  <Provider store={store} >
      <BrowserRouter>
          <Routes>
              <Route path={"/user/home"} element={<Home />}></Route>
              <Route path={"/mypage"} element={<Mypage />}></Route>
              <Route path={"/userInfoModify"} element={<UserInfoModify />}></Route>
              <Route path={"/loginForm"} element={<UserLogin />}></Route>
              <Route path={"/join"} element={<UserJoin />}></Route>
              <Route path={"/searchpage"} element={<SearchHome />}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
