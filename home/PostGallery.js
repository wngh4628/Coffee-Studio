
import React, {useState, useEffect,useRef,Component, useCallback,forwardRef, useImperativeHandle } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import backIcon from '../static/img/icon/backIcon.png';
import LeftBtn from "./PostGalleryLeftBtn";
import RightBtn from "./PostGalleryRightBtn";
import reply from '../static/img/icon/reply.png';
import heart from '../static/img/icon/heart.png';
const PostBody = forwardRef((props, ref) =>{
      const childRef = useRef();
      const [ImgIdx, setImgIdx] = useState(0);
      const IpAdress = useSelector(state=>state.IpAdress);
      useEffect(() => {

      }, []);

      function GoBack(){
        setImgIdx(Number(ImgIdx)-1);
        console.log(ImgIdx);
      }
      function GoNext(){
        setImgIdx(Number(ImgIdx)+1);
        console.log(ImgIdx);
      }
 
      return (
        <div>
            {props.Data.subList.length !== 1 ?
             <LeftBtn ImgIdx={ImgIdx} GoBack={GoBack}/>
            
            :""  
            }
              <figure className="popup-picture-image" style={{width:"468px",height:"470px",}}>
                {/* <img src={"http://localhost:8080/image/"+props.Data.subList[ImgIdx]} alt="cover-04" id="imgSize" style={{objectFit: "cover"}}/> */}
              <img src={IpAdress+"/image/"+props.Data.subList[ImgIdx]} alt="cover-04" id="imgSize" style={{objectFit: "cover"}}/>
              </figure>
            {props.Data.subList.length !== 1?
              <RightBtn ImgIdx={ImgIdx} GoNext={GoNext} lastIdx={props.Data.subList.length}/>
            :""  
             }
         
            <div id="Indicatorbox" style={{display:"flex", position:"absolute", }}>
              {props.Data.subList.length !== 1?
              <div style={{display:"flex", justifyContent:"center",marginRight:"auto",marginTop:"8px"}}>
                  {props.Data.subList.map((data11,i) => (
                    <div>
                      {i === ImgIdx ?
                        <div id="IndicatorSelect">
                        </div>:
                        <div id="Indicator">
                        </div>
                      }
                    </div>
                  ))}
              </div>
              :
              ""}
            </div>

      </div>
      )
  
});

export default PostBody;
