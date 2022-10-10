
import React, {useState, useEffect, useRef,Component } from 'react';
import imgA from '../static/img/mainLogo.png';
import FriendsIcon from '../static/img/icon/FriendsIcon.png';
import ProfileIcon from '../static/img/icon/ProfileIcon.png';
import requestIcon from '../static/img/icon/GroupsIcon.png';
import sendIcon from '../static/img/icon/SendMessageIcon.png';
import PostIcon from '../static/img/icon/PostIcon.png';

function MypageSelect(props) {
  useEffect(() => { 
    console.log("33333333333333333333333");
    console.log(props.loginUserMyPage);
  },[])
  
  const [selectClass, setselectClass] = useState({  
    post: 'section-menu-item active',
    friend: 'section-menu-item',
    friendRequest: 'section-menu-item',
    sendRequest: 'section-menu-item',
  });
  const [getOpenState, setOpenState] = useState({  
    openState: 'all',
    allOpenClass: 'option-item active',
    FrendsOpenClass: 'option-item',
    openOnlyMeClass:'option-item',
    allOpenIcon: 'iconSelected',
    FrendsOpenIcon: 'icon',
    openOnlyMeIcon:'icon',
  });
  function changeComponent(WAYF) {
    if(WAYF==='post'){
      props.setoptionSelect(WAYF);
      setselectClass({...selectClass,['post']:'section-menu-item active',['friend']:'section-menu-item',['friendRequest']:'section-menu-item',['sendRequest']:'section-menu-item'});
    }else if(WAYF==='friend'){
      setselectClass({...selectClass,['post']:'section-menu-item',['friend']:'section-menu-item active',['friendRequest']:'section-menu-item',['sendRequest']:'section-menu-item'});
      props.setoptionSelect(WAYF);
    }else if(WAYF==='friendRequest'){
      setselectClass({...selectClass,['post']:'section-menu-item',['friend']:'section-menu-item',['friendRequest']:'section-menu-item active',['sendRequest']:'section-menu-item'});
      props.setoptionSelect(WAYF);
    }else if(WAYF==='sendRequest'){
      setselectClass({...selectClass,['post']:'section-menu-item',['friend']:'section-menu-item',['friendRequest']:'section-menu-item',['sendRequest']:'section-menu-item active'});
      props.setoptionSelect(WAYF);
    }
    
  }
  return (
    <nav class="section-navigation" style={{width:"800px", margin: "auto", marginTop: "10px"}}>
      <div id="section-navigation-slider" class="section-menu">
        <a class={selectClass.post} onClick={(e)=>{changeComponent('post', e)}} style={{cursor:"Pointer"}}>
          <div class="section-menu-item-icon icon-profile">
            <img className={getOpenState.allOpenIcon} width={20} height={20} src={PostIcon} alt ="icon"/>
          </div>
          <p class="section-menu-item-text">마이페이지</p>
        </a>

        <a class={selectClass.friend} onClick={(e)=>{changeComponent('friend', e)}} style={{cursor:"Pointer"}}>
          <div class="section-menu-item-icon icon-profile">
            <img className={getOpenState.allOpenIcon} width={20} height={20} src={FriendsIcon} alt ="icon"/>
          </div>
          <p class="section-menu-item-text">친구</p>
        </a>

        {props.loginUserMyPage.current ==='Y' ?
          <a class={selectClass.friendRequest} onClick={(e)=>{changeComponent('friendRequest', e)}} style={{cursor:"Pointer"}}>
            <div class="section-menu-item-icon icon-profile">
              <img className={getOpenState.allOpenIcon} width={20} height={20} src={requestIcon} alt ="icon"/>
            </div>
            <p class="section-menu-item-text">친구 요청</p>
          </a>
        : ""
        }
        {props.loginUserMyPage.current ==='Y' ?
          <a class={selectClass.sendRequest} onClick={(e)=>{changeComponent('sendRequest', e)}} style={{cursor:"Pointer"}}>
            <div class="section-menu-item-icon icon-profile">
              <img className={getOpenState.allOpenIcon} width={20} height={20} src={sendIcon} alt ="icon"/>
            </div>
            <p class="section-menu-item-text">보낸 요청</p>
          </a>
        : ""
        }

      </div>
  
      <div id="section-navigation-slider-controls" class="slider-controls">
        <div class="slider-control left">
          <svg class="slider-control-icon icon-small-arrow">
            <use href="#svg-small-arrow"></use>
          </svg>
        </div>
  
        <div class="slider-control right">
          <svg class="slider-control-icon icon-small-arrow">
            <use href="#svg-small-arrow"></use>
          </svg>
        </div>
      </div>
    </nav>
  )
  
}

export default MypageSelect;
