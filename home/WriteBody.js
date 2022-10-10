
import React, {useState, useEffect, useRef,Component,forwardRef, useImperativeHandle  } from 'react';
import {Provider, useSelector, useDelector, useDispatch, connect} from 'react-redux';
import allIcon from '../static/img/icon/globe.png';
import friends from '../static/img/icon/friend.png';
import lock from '../static/img/icon/lock.png';
import cameraIcon from '../static/img/icon/Camera.png';
import axios from 'axios';
import  "../static/css/icon.css";
import  "../static/css/show_usernull_side.css";
import  "../static/css/userInfo/userLogin.css";
import { useLocation } from "react-router-dom"
import { render } from 'react-dom'
import ImgGallery from '../ETC/imgGallery'
import { useMediaQuery } from 'react-responsive'
import Swal from 'sweetalert2';

const WriteBody = forwardRef((props, ref) =>{
  
    let jwt = useSelector(state=>state.jwt);
    let helpRef = useRef();

    const getUserId = useSelector(state=>state.userId);
    let nowLocation = useLocation().pathname;
    const [getFormData, setFormData] = useState(""); //글 올린 뒤 폼데이터 저장
    const [data, setData] = useState("");
    const [boxSize, setBoxSize] = useState("250px");
    const [TopSize, setTopSize] = useState("");
    const [LeftSize, setLeftSize] = useState("");
    const [gallaryTag, setgallaryTag] = useState("");
    const [PostComplete, setPostComplete] = useState("");
    const [getcontent, setcontent] = useState('');
    const [headSpace, setheadSpace] = useState(''); // marginTop 길이
    const [SwalOn, setSwalOn] = useState(false); //알림 모달창 유무
    let wrapperRef = useRef();
    let dispatch = useDispatch();
    
    useImperativeHandle(ref, () => ({
      handleResize
    }));
    
    useEffect(()=>{
      document.addEventListener('mousedown', handleClickOutside);
      return()=>{
        document.removeEventListener('mousedown', handleClickOutside);
      }
    })
    const handleClickOutside=(event)=>{
      if (SwalOn===false && wrapperRef && !wrapperRef.current.contains(event.target)) {
        props.setisWriteBodyClicked(false);
        dispatch({type:'setBodyBack', getBody:'body'});
      }
    }
    function handleResize(){
      if(window.innerWidth<768){
        setLeftSize('3%');
      }else{
        setLeftSize('30%');
      }
    }
    

    useEffect(() => { //글 올리고 신호 전달
      if(PostComplete==='true'){
        props.PostWrite(getFormData);
      }
      setPostComplete('false')
    }, [PostComplete]);

    useEffect(() => { 
      if(nowLocation==='/home'){
        setheadSpace('100px');
      }else{
        setheadSpace('10px');
      }
      if(window.innerWidth<768){
        setLeftSize('3%');
      }else{
        setLeftSize('35%');
      }
      window.addEventListener('resize', handleResize);
      return () => { // cleanup 
        window.removeEventListener('resize', handleResize);
      }
    }, []);
    
    const [inputs, setInputs] = useState({  
      displayState:'none',
    });
      
    const onChange = (e) => {
      const { value } = e.target  
      setcontent(value);   
    }

    const [getOpenState, setOpenState] = useState({  
      openState: 'all',
      allOpenClass: 'option-item active',
      FrendsOpenClass: 'option-item',
      openOnlyMeClass:'option-item',
      allOpenIcon: 'iconSelected',
      FrendsOpenIcon: 'icon',
      openOnlyMeIcon:'icon',
    });
    
    function changeOpenState(getState) { //전체 공개 or 친구 공개 or 나만보기 클릭 시, 상태 바꿔주는 코드
      let nextInputs = null;
        if(getState==='all'){
         nextInputs = { ...inputs,  ['openState']: 'all',['allOpenClass']: 'option-item active',['FrendsOpenClass']: 'option-item',['openOnlyMeClass']: 'option-item',['allOpenIcon']: 'iconSelected',['FrendsOpenIcon']: 'icon',['openOnlyMeIcon']: 'icon'}
        }else if(getState==='frends'){
           nextInputs = { ...inputs,  ['openState']: 'Frends',['allOpenClass']: 'option-item',['FrendsOpenClass']: 'option-item active',['openOnlyMeClass']: 'option-item',['allOpenIcon']: 'icon',['FrendsOpenIcon']: 'iconSelected',['openOnlyMeIcon']: 'icon'}
        }else if(getState==='onlyMe'){
           nextInputs = { ...inputs,  ['openState']: 'OnlyMe',['allOpenClass']: 'option-item',['FrendsOpenClass']: 'option-item',['openOnlyMeClass']: 'option-item active',['allOpenIcon']: 'icon',['FrendsOpenIcon']: 'icon',['openOnlyMeIcon']: 'iconSelected'}
        }
				setOpenState(nextInputs); 
      }

      function letsPost() {
        setcontent('');
       
        if(gallaryTag===''){
          // let formData = new FormData();
          // formData.append("content",getcontent);
          // formData.append("openState",getOpenState.openState);
          // fetch('/letsMainPost', {
          //   method: 'post',
          //   headers: {
          //     'Authorization': jwt
          //   },
          //   body : formData
          // }).then(res => res.json())
          //   .then(resonse => {
          //     console.log(resonse.userId);
          // });
          Swal.fire({
              text:'사진은 1장 이상 있어야 합니다.',
              icon: 'warning',
              confirmButtonText: '완료', // confirm 버튼 텍스트 지정
              confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
					  });
        }else{
          helpRef.current.sendToParent(getcontent);
        }
        
      }
      
      const onLoadFile = (e) =>{
        if(gallaryTag===''){
          setBoxSize("450px");  
          const file = e.target.files;
          setgallaryTag(<ImgGallery sendfile={file} setPostComplete={setPostComplete} getcontent={getcontent} setFormData={setFormData} EmptyContent={setcontent} sendOpenState={getOpenState.openState} setBoxSize={setBoxSize} setData={setData} setgallaryTag ={setgallaryTag} ref={helpRef}/>);     
        }else{
          const file = e.target.files;
          helpRef.current.addImg(file);
        }
      }


      return (
          <div style={{ position:"absolute", zIndex :"100"}} ref={wrapperRef}>
              <div id={useSelector(state=>state.setBodyBack)} style={{marginTop: headSpace}}>
                  <div className="grid-column" style={{width:"470px", margin: "auto"}}>
                  <div className="quick-post"  style={{margin: "auto"}} >
                    <div className="quick-post-header">
                      <div className="option-items" style={{height:"70px"}}>
                        <div className={getOpenState.allOpenClass} onClick={()=>{changeOpenState('all');}}>
                          <img className={getOpenState.allOpenIcon} width={25} height={25} src={allIcon} alt ="icon"/>
                          <p className="option-item-title" style={{fontSize:"20px"}}>전체 공개</p>
                        </div>
                        <div className={getOpenState.FrendsOpenClass} onClick={()=>{changeOpenState('frends');}}>
                          <img className={getOpenState.FrendsOpenIcon} width={25} height={25} src={friends}  alt ="icon"/>
                          <p className="option-item-title" style={{fontSize:"20px"}}>친구 공개</p>
                        </div>
                        <div className={getOpenState.openOnlyMeClass} onClick={()=>{changeOpenState('onlyMe');}}>
                          <img className={getOpenState.openOnlyMeIcon} width={25} height={25} src={lock} alt ="icon"/>
                          <p className="option-item-title" style={{fontSize:"20px"}} >나만 보기</p>
                        </div>
                      </div>
                    </div>

                    <div className="quick-post-body" style={{height:boxSize}}>
                      <form className="form">
                        <div className="form-row">
                          <div className="form-item">
                            <div className="form-textarea" style={{height:"250px"}}>
                              <textarea id="quick-post-text" onChange={onChange} name="content" placeholder={"무슨 생각을 하고 계신가요?"} style={{fontSize:"20px",height:"250px"}} value={getcontent}></textarea>
                              {gallaryTag}
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>


                    <div className="quick-post-footer">
                      <div className="quick-post-footer-actions">
                        <div className="quick-post-footer-action text-tooltip-tft-medium" data-title="Insert Photo">
                        <div className="xm-tooltip" style={{display:inputs.displayState,position:"absolute", top:"330px",left:"0%"}}>
                          <p className="xm-tooltip-text">사진 올리기</p>
                        </div>
                         <label for="file"> 
                          <img className="iconSelected" 
                            onMouseOver={(event) =>{ 
                              const nextInputs = { ...inputs,  ["displayState"]: "flex",} 
                              setInputs(nextInputs); 
                            }}
                            onMouseOut={(event) =>{ 
                              const nextInputs = { ...inputs,  ["displayState"]: "none",} 
                              setInputs(nextInputs); 
                            }}
                            width={25} height={25} src={cameraIcon} style={{marginRight:"10px"}} alt ="icon"/>
                          </label>
                          <input type="file" id="file" name="upload[]" onChange={onLoadFile}  accept=".jpg, .jpeg, .png" style={{display: "none"}} multiple/>
                        </div>
                      
                      </div>

                      <div className="quick-post-footer-actions" onClick={letsPost}>
                        <p className="button small secondary">개시</p>
                      </div>
                    </div>
                  </div>
                 
                </div>
              </div>
          </div>
      )
  });

export default WriteBody;
