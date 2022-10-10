
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import backIcon from '../static/img/icon/backIcon.png';

const PostBody = forwardRef((props, ref) =>{
      const childRef = useRef();
      const [data, setData] = useState([]);
      
      useEffect(() => {
      }, []);

  
 
      return (
       <div>
        {props.ImgIdx === 0 ? 
           ""
           :
           <div id="modalLeftBtn" style={{display:props.displayState,}} onClick={props.GoBack}>
            <img src={backIcon} width={20} height={20} style={{marginTop: "2px",marginRight: "3px"}} alt="backBtn"/>
           </div>
          }
       </div>
       
      )
  
});

export default PostBody;
