
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
      console.log('333333333333333333');
      console.log(props);
      console.log(data);
      }, []);
      return (
          <div className="dfdf">
            <div className="picture-collage" >
              <div className="picture-collage-row medium"  style={{margin:"auto"}}>
                  <div className="picture-collage-item popup-picture-trigger" style={{width:"744px", height:"744px"}}>
                    <div className="photo-preview" >
                      <figure className="photo-preview-image liquid">
                        <img src={"http://localhost:8080/image/"+data[0]} alt="" style={{objectFit: "cover"}}/>
                      </figure>
                    </div>
                  </div>
              </div>

              
            </div>
          </div>
      )
  
}

export default ImgBody5;
