
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useSelector, useDelector, useDispatch, connect} from 'react-redux';
import allIcon from '../static/img/icon/globe.png';
import friends from '../static/img/icon/friend.png';
import lock from '../static/img/icon/lock.png';
import cameraIcon from '../static/img/icon/Camera.png';
import axios from 'axios';
import  "../static/css/icon.css";
import  "../static/css/show_usernull_side.css";
import  "../static/css/userInfo/userLogin.css";
import '../static/css/home/ModifyWriteBody.css';
import { render } from 'react-dom'
import ImgGallery from '../ETC/imgGalleryModify'
import NewImgGallery from '../ETC/newImgGallery'

function ModifyWriteBody(props) {
    let dispatch = useDispatch();
    let jwt = useSelector(state=>state.jwt);
    let sendRef = useRef();
    let wrapperRef = useRef();
    const [getFormData, setFormData] = useState(""); //글 올린 뒤 폼데이터 저장
    const [data, setData] = useState("");
    const [getModifycontent, setModifycontent] = useState('');
    const [boxSize, setBoxSize] = useState("");
    const [gallaryTag1, setgallaryTag1] = useState("");
    const [PostComplete, setPostComplete] = useState("");
    const getUserId = useSelector(state=>state.userId);
    const [inputFile, setFile] = useState({  
      file:'',
    });
    
    useEffect(()=>{
      document.addEventListener('mousedown', handleClickOutside);
      return()=>{
        document.removeEventListener('mousedown', handleClickOutside);
      }
    })
    useEffect(()=>{
      console.log(props.DataPipe);
      setModifycontent(props.DataPipe.content);
      changeOpenState(props.DataPipe.openState);
      if(props.DataPipe.subList.length>0){
        setBoxSize("450px"); 
        setgallaryTag1(<ImgGallery getModifycontent={getModifycontent} PostModify={props.PostModify} ImgList={props.DataPipe} setPostComplete={setPostComplete} setFormData={setFormData}  sendOpenState={getOpenState.openState}  setBoxSize={setBoxSize} setData={setData} setgallaryTag ={setgallaryTag1} ref={sendRef}/>);     
      }
      console.log(getOpenState);
    },[])

    const handleClickOutside=(event)=>{
      if (wrapperRef && !wrapperRef.current.contains(event.target)) {
        console.log("!!!!!!!!!!!");
        props.PostModifyOnOff();
      }
    }

    useEffect(() => { //글 올리고 신호 전달
      if(PostComplete==='true'){
        props.setSignal(getFormData);
      }
      setPostComplete('false')
    }, [PostComplete]);

    const [inputs, setInputs] = useState({  
      displayState:'none',
      });
      
    const onChange = (e) => {
      const { value } = e.target 
      console.log(getModifycontent);
      setModifycontent(value);   
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
      console.log("getState: " +getState);
      console.log(getOpenState.openState);
        if(getState==='all'){
         nextInputs = { ...inputs,  ['openState']: 'all',['allOpenClass']: 'option-item active',['FrendsOpenClass']: 'option-item',['openOnlyMeClass']: 'option-item',['allOpenIcon']: 'iconSelected',['FrendsOpenIcon']: 'icon',['openOnlyMeIcon']: 'icon'}
        }else if(getState==='friends'){
           nextInputs = { ...inputs,  ['openState']: 'friends',['allOpenClass']: 'option-item',['FrendsOpenClass']: 'option-item active',['openOnlyMeClass']: 'option-item',['allOpenIcon']: 'icon',['FrendsOpenIcon']: 'iconSelected',['openOnlyMeIcon']: 'icon'}
        }else if(getState==='onlyMe'){
           nextInputs = { ...inputs, ['openState']: 'onlyMe',['allOpenClass']: 'option-item',['FrendsOpenClass']: 'option-item',['openOnlyMeClass']: 'option-item active',['allOpenIcon']: 'icon',['FrendsOpenIcon']: 'icon',['openOnlyMeIcon']: 'iconSelected'}
        }
				setOpenState(nextInputs); 
      }

      function letsPost() {
        if(gallaryTag1===''){
          let formData = new FormData();
          formData.append("content",getModifycontent);
          formData.append("openState",getOpenState.openState);
          fetch('/letsMainPost', {
            method: 'post',
            headers: {
              'Authorization': jwt
            },
            body : formData
          }).then(res => res.json())
            .then(resonse => {
              console.log(resonse);
              props.PostModify(resonse);
          });
        }else{
          console.log("all:" +getOpenState.openState);
          sendRef.current.sendToParent(getModifycontent,getOpenState.openState);
          props.PostModifyOnOff();
        }
        
      }
      
      const onLoadFile1 = (e) =>{
        if(gallaryTag1===''){
          console.log("gallaryTag1!!!!!!!!!!!!");
          setBoxSize("450px");  
          const file = e.target.files;
          console.log("getModifycontent: " +getModifycontent);
          setgallaryTag1(<NewImgGallery getModifycontent={getModifycontent} PostModify={props.PostModify} setDataPipe={props.setDataPipe} ImgList={props.DataPipe} sendfile={file} setPostComplete={setPostComplete}  setFormData={setFormData}  sendOpenState={getOpenState.openState} setBoxSize={setBoxSize} setData={setData} setgallaryTag ={setgallaryTag1} ref={sendRef}/>);     
          // setgallaryTag1(<ImgGallery ImgList={props.DataPipe} setPostComplete={setPostComplete} sendContent={getcontent} setFormData={setFormData} EmptyContent={setcontent} sendOpenState={getOpenState.openState}  setBoxSize={setBoxSize} setData={setData} setgallaryTag ={setgallaryTag1} ref={sendRef}/>);  
          
        }else{
          const file = e.target.files;
          sendRef.current.addImg(file);
        }
      }

      return (
          <div >
            <div id="body1" >
              <div className="grid-column" id="ModifyModal" >
                <div className="quick-post"   style={{margin: "auto"}} ref={wrapperRef} >
                  <div className="quick-post-header">
                    <div className="option-items" style={{height:"70px"}}>
                      <div className={getOpenState.allOpenClass} onClick={()=>{changeOpenState('all');}}>
                        <img className={getOpenState.allOpenIcon} width={25} height={25} src={allIcon} alt ="icon"/>
                        <p className="option-item-title" style={{fontSize:"20px"}}>전체 공개</p>
                      </div>
                      <div className={getOpenState.FrendsOpenClass} onClick={()=>{changeOpenState('friends');}}>
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
                            <textarea id="quick-post-text" onChange={onChange} name="content" placeholder={getUserId+"님, 무슨 생각을 하고 계신가요?"} style={{fontSize:"20px",height:"250px"}} value={getModifycontent}></textarea>
                            {gallaryTag1}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>


                  <div className="quick-post-footer">
                    <div className="quick-post-footer-actions">
                      <div className="quick-post-footer-action text-tooltip-tft-medium" data-title="Insert Photo">
                      <div className="xm-tooltip" style={{display:inputs.displayState,position:"absolute", top:"420px",left:"26.3%"}}>
                        <p className="xm-tooltip-text">사진 올리기</p>
                      </div>
                      <label for="file1"> 
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
                        <input type="file" id="file1" name="upload[]" onChange={onLoadFile1} accept="image/*"  style={{display: "none"}} multiple/>
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
  }

export default ModifyWriteBody;
