
import React, {useState, useEffect,forwardRef,useImperativeHandle, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import { useNavigate } from "react-router-dom";


const NotfoundFriend = forwardRef((props, ref) =>{
      return (
        <div  style={{marginTop: "20px",marginBottom: "20px"}}>
              <div className="widget-box no-padding" style={{margin: "auto", width:"800px",height:"220px"}}  >
                <div className="widget-box-status">
                  <div className="user-status" style={{}}>
                    <div className="widget-box-status-content">
                      <p className="widget-box-status-text" style={{textAlign:'left', fontSize:"30px"}}>{"'"+props.keyword+"'님에 대한 검색결과가 없습니다."}</p>
                      <p className="widget-box-status-text" style={{textAlign:'left',marginTop:"0px"}} >단어의 철자가 정확한지 확인해 보세요.</p>
                      <p className="widget-box-status-text" style={{textAlign:'left',marginTop:"0px"}} >한글을 영어로 혹은 영어를 한글로 입력했는지 확인해 보세요.</p>
                      <p className="widget-box-status-text" style={{textAlign:'left',marginTop:"0px"}} >검색 옵션을 변경해서 다시 검색해 보세요.</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      )
  
});

export default NotfoundFriend;
