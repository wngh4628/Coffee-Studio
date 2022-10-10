
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import PostBodyHeader from "../home/PostBodyHeader";
import CommentIcon from '../static/img/icon/CommentIcon.png';
import ThumbsUpIcon from '../static/img/icon/ThumbsUpIcon.png';
import TDots from '../static/img/icon/ThreeDotsIcon.png';
import ProfileIcon from '../static/img/icon/ProfileIcon.png';
import reply from '../static/img/icon/reply.png';
import heart from '../static/img/icon/heart.png';
import MessagesIcon from '../static/img/icon/MessagesIcon.png';
import XIcon from '../static/img/icon/XIcon.png';

import PostGallery from "./PostGallery";
const PostBody = forwardRef((props, ref) =>{
  const [showBtn, setshowBtn] = useState('none');
  const [Idx, setIdx] = useState();
  const IpAdress = useSelector(state=>state.IpAdress);

  function transDate(getDate) {
		let result = '';
        let dt = new Date(getDate+" UTC").toLocaleString();
		let nowDate = new Date();
		let getNowDate = nowDate.getFullYear()+" "+Number(nowDate.getMonth()+1)+" "+nowDate.getDate();
		
		let year = dt.split(".")[0];
        let Month = dt.split(".")[1];
        let day = dt.split(".")[2];
        let AmPm = dt.split(" ")[3]
        let hour = dt.split(" ")[4].split(":")[0];
        let minutes = dt.split(" ")[4].split(":")[1];

	
		if(getNowDate === year+Month+day){
			result = AmPm+" "+hour+":"+minutes;
		}else{
			result = Month+"월"+day+"일 "+AmPm+" "+hour+":"+minutes;
		}
        return result;
      }

      return (
          <div className="dfdf" style={{marginTop: "80px"}}>
            {props.Data.map((data11,i) => (
                <div  style={{marginTop: "20px",marginBottom: "20px", }}>
                  <div className="grid-column" style={{width:"470px", margin: "auto"}}>
                    <div className="widget-box no-padding" style={{margin: "auto",border:"1px solid #DBDBDB"}}  >
                    {props.Data[i].userNo===props.UserInfo.userNo ? <PostBodyHeader Data={props.Data[i]} PostDelete={props.PostDelete} PostModifyOnOff={props.PostModifyOnOff}/>:
                    ""}
  
                      <div className="widget-box-status" style={{ paddingTop:"10px"}}>
                        <div className="" >

                          <div className="user-status" style={{display:"flex", marginBottom:"10px"}}>
                            <p className="user-status-avatar" style={{marginLeft:"8px"}}>
                              <img src={IpAdress+"/profile/"+props.Data[i].userProfileImg+".jpg"} alt ="face"  width='45' height='45' style={{borderRadius: "80px",objectFit: "cover", cursor:"Pointer",}}/>
                            </p>
                            <p className="user-status-title medium"  style={{marginTop:"10px", marginLeft:"8px"}}>
                                <p className="bold"style={{textAlign:"left", cursor:"Pointer"}}>{props.Data[i].userId}</p> 
                            </p>
                          </div>
                          
                          <PostGallery Data={props.Data[i]}/>
                          
                          <div style={{marginLeft:"12px",marginRight:"12px",marginTop:"8px",marginBottom:"8px"}}>
                            <div style={{display:"flex", marginBottom:"12px"}}>
                              <div>
                                <img  src={heart} alt ="face"  style={{cursor:"Pointer"}} width='25' height='25'/>
                                <img  src={reply} alt ="face"  style={{marginLeft:"10px",cursor:"Pointer"}} width='25' height='25'/>
                              </div>
                            </div>
                            <div style={{display:"flex",marginBottom:"12px"}}>
                              <p style={{textAlign:"left", fontWeight:"bold"}} >좋아요</p>
                            </div>
                            <div style={{display:"flex",marginBottom:"12px"}}>
                              <span  style={{textAlign:"left",}}>{props.Data[i].userId+": "+props.Data[i].content}</span>
                            </div>
                            {props.Data[i].replyCnt >0 ? 
                              <div style={{display:"flex",marginBottom:"12px"}}>
                                  <span  style={{textAlign:"left", color:"#8e8e8e",cursor:"Pointer"}}>댓글 더 보기</span>
                              </div>: 
                              ""
                            }
                           
                            <div style={{display:"flex",marginBottom:"12px"}}>
                              <span  style={{textAlign:"left", color:"#8e8e8e", fontSize:"10px"}}>{props.Data[i].writeDate}</span>
                            </div>
                          </div>
                          
                      
                        </div>
                      </div>
                      <div className="post-options" style={{backgroundColor:"white"}}>
                        <div className="" >
                          <input style={{width:"380px"}}placeholder='댓글 달기...'></input>
                        </div>
  
                        <div className="">
                          <p className="post-option-text" style={{color:"#0095f6", cursor:"Pointer"}}>게시</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            
            ))
          }
          </div>
      )
  
});

export default PostBody;
