
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import nextIcon from '../static/img/icon/nextIcon.png';

const PostBody = forwardRef((props, ref) =>{
     

      useEffect(() => {
        
      }, []);

    
      
 
      return (
        <div>
          {props.lastIdx-1 ===props.ImgIdx ? "" :
            <div id="modalRightBtn" style={{display:props.displayState,}} onClick={props.GoNext}>
              <img src={nextIcon} width={20} height={20} style={{marginTop: "2px",marginLeft: "3px"}} alt="backBtn"/>
            </div>
          }
        </div>
      )
  
});

export default PostBody;
