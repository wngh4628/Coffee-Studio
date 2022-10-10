
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import backIcon from '../static/img/icon/backIcon.png';
import TDots from '../static/img/icon/ThreeDotsIcon.png';
import Swal from 'sweetalert2';

const PostBodyHeader = forwardRef((props, ref) =>{
  let wrapperRef = useRef();
 
  useEffect(()=>{
    document.addEventListener('mousedown', handleClickOutside);
    return()=>{
      document.removeEventListener('mousedown', handleClickOutside);
    }
  })
  const handleClickOutside=(event)=>{
    if (wrapperRef && !wrapperRef.current.contains(event.target)) {
      setOptionBoxDispay('none');
    }
  }

  const [optionBoxDispay, setOptionBoxDispay] = useState('none'); //옵션 박스 온오프 디스플레이 상태

  function optionBoxBtnOnOff() {
    if(optionBoxDispay==='none'){
      setOptionBoxDispay('block');
    }else if(optionBoxDispay==='block'){
      setOptionBoxDispay('none');
    }
  }
 function PostDelete() {
  setOptionBoxDispay('none');
    Swal.fire({
        title: '삭제하시겠습니까?',
        text: '삭제된 게시글은 복구할 수 없습니다.',
        icon: 'warning',

        showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
        confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
        cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
        confirmButtonText: '삭제', // confirm 버튼 텍스트 지정
        cancelButtonText: '취소', // cancel 버튼 텍스트 지정
        cancelButtonSize:'30px',
        
      }).then(result => {
        // 만약 Promise리턴을 받으면,
        if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
          
          props.PostDelete(props.Data);
            Swal.fire({
              text:'삭제가 완료되었습니다.',
              icon: 'success',
              confirmButtonText: '완료', // confirm 버튼 텍스트 지정
              confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
            });
        }
      });
  }
  
      return (
        <div className="widget-box-settings" ref={wrapperRef} style={{marginLeft:"auto",zIndex:"10"}} >
          <div className="post-settings-wrap">
              <div className="post-settings widget-box-post-settings-dropdown-trigger" id="optionBoxBtn" onClick={optionBoxBtnOnOff} style={{marginLeft:"auto"}} >
                <img className="icon" width={20} height={20} src={TDots} alt ="icon"/>
              </div> 
            <div className="simple-dropdown widget-box-post-settings-dropdown" style={{display:optionBoxDispay}}>
              <p className="simple-dropdown-link" onClick={()=>{props.PostModifyOnOff(props.Data);}} >수정하기</p>
              <p className="simple-dropdown-link" onClick={PostDelete}>삭제하기</p>
            </div>
          </div>
        </div>
      )
  
});

export default PostBodyHeader;
