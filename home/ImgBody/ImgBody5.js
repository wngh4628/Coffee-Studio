
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider, useDelector,useSelector, useDispatch, connect} from 'react-redux';
import Img12 from '../../static/img/cover/12.jpg';
import Img16 from '../../static/img/cover/16.jpg';
import Img08 from '../../static/img/cover/08.jpg';
import Img14 from '../../static/img/cover/14.jpg';

function ImgBody5 (props){
    const [data, setData] = useState([]);
    useEffect(() => {
      setData(props.sendImg);
      // console.log('333333333333333333');
      // console.log(props);
      // console.log(data);
      }, []);
      return (
          <div className="dfdf">
            <div className="picture-collage" >
              <div className="picture-collage-row medium"  style={{margin:"auto"}}>
                  <div className="picture-collage-item popup-picture-trigger" style={{width:"372px", height:"372px"}}>
                    <div className="photo-preview" >
                      <figure className="photo-preview-image liquid">
                        <img src={"http://localhost:8080/image/0"+props.sendImg.imgCode+'.jpg'} alt='0' style={{objectFit: "cover"}} onClick={(e)=>{props.detailmodifyThis('0', e)}}/>
                      </figure>
                    </div>
                  </div>

                  <div className="picture-collage-item popup-picture-trigger" style={{width:"372px", height:"372px"}}>
                    <div className="photo-preview">
                      <figure className="photo-preview-image liquid">
                        <img src={"http://localhost:8080/image/1"+props.sendImg.imgCode+'.jpg'} alt='1' style={{objectFit: "cover"}} onClick={(e)=>{props.detailmodifyThis('1', e)}}/>
                      </figure>
                    </div>
                  </div>
                
              </div>

              <div className="picture-collage-row medium" style={{marginTop:"5px"}}>
                <div className="picture-collage-item popup-picture-trigger" style={{width:"247px", height:"247px"}}>
                  <div className="photo-preview">
                    <figure className="photo-preview-image liquid">
                      <img src={"http://localhost:8080/image/2"+props.sendImg.imgCode+'.jpg'} alt='2' style={{objectFit: "cover"}} onClick={(e)=>{props.detailmodifyThis('2', e)}}/>
                    </figure>
                  </div>
                </div>

                <div className="picture-collage-item popup-picture-trigger" style={{width:"247px", height:"247px"}}>
                  <div className="photo-preview">
                    <figure className="photo-preview-image liquid">
                      <img src={"http://localhost:8080/image/3"+props.sendImg.imgCode+'.jpg'} alt='3' style={{objectFit: "cover"}} onClick={(e)=>{props.detailmodifyThis('3', e)}}/>
                    </figure>
                  </div>
                </div>

                <div className="picture-collage-item" style={{width:"247px", height:"247px"}}>
                  {/* <a className="picture-collage-item-overlay" href="profile-photos.html">
                    <p className="picture-collage-item-overlay-text">+22</p>
                  </a> */}

                  <div className="photo-preview">
                    <figure className="photo-preview-image liquid">
                      <img src={"http://localhost:8080/image/4"+props.sendImg.imgCode+'.jpg'} alt='4' style={{objectFit: "cover"}} onClick={(e)=>{props.detailmodifyThis('4', e)}}/>
                    </figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )
  
}

export default ImgBody5;
