
import React, {useState, useEffect, useRef,Component } from 'react';
import {Provider,useSelector, useDelector, useDispatch, connect} from 'react-redux';
import userImage from '../UserInfo/userImg/user_baseProfile.png';
import cover from '../UserInfo/userImg/cover.png';
import Swal from 'sweetalert2';

function App() {
  let jwt =  localStorage.getItem('Authorization');
  const [BtnDisable, setBtnDisable] = useState(true);
  const [profileImg, setprofileImg] = useState('');
  const [coverImg, setcoverImg] = useState('');
  const [coverImgFile, setcoverImgFile] = useState('');
  const [profileImgFile, setprofileImgFile] = useState('');
  let passwordForm = document.querySelector('#userPw'); //아이디 중복 확인 버튼
	let rePassForm = document.querySelector('#re_pw');
  let getCoverImg = useSelector(state=>state.userCoverImg);
  let getProfileImg = useSelector(state=>state.userProfileImg);

  const [inputs, setInputs] = useState({  
        userPw:'',
        re_pw:'',
    });

    const onChange = (e) => {
      const { name, value } = e.target  
      const nextInputs = { ...inputs,  [name]: value,}
      setInputs(nextInputs);   
    }

    useEffect(() => {
      if(profileImgFile!==''){
        console.log('!!!!!!!!!!!!!');
        setBtnDisable(false);
      }
      if(coverImgFile!==''){
        console.log('!!!!!!!!!!!!!');
        setBtnDisable(false);
      }
      if(inputs.userPw!=='' && inputs.re_pw!==''){
        console.log('!!!!!!!!!!!!!');
        setBtnDisable(false);
      }
      
    }, [profileImgFile,coverImgFile,inputs]);

    function letsModify() {
      if(inputs.userPw!==''){
        if(inputs.re_pw===""){
          alert("비밀번호 중복 확인을 입력해주세요!");
          rePassForm.focus();
          return;
        }
        else if(CheckPass(inputs.userPw) === false){
          alert("비밀번호는 영문+숫자 6자를 조합하여 입력해주세요 !");
          console.log(inputs.userPw);
          passwordForm.focus();
          return;
        }
      }
      if(inputs.re_pw!==''){
        if(inputs.userPw===""){
          alert("비밀번호를 입력해주세요!");
          rePassForm.focus();
          return;
        }else if(inputs.re_pw !==inputs.userPw){
          alert("비밀번호가 동일하지 않습니다!");
          rePassForm.focus();
          return;
        }
      }
      let formData = new FormData();
      
      if(coverImgFile!==''){
        formData.append("coverImgFile",coverImgFile);
      }
      if(profileImgFile!==''){
        formData.append("profileImgFile",profileImgFile);
      }
      if(inputs.userPw!==''){
        formData.append("userPw",inputs.userPw);
      }
  
      fetch("/letsUserInfoModify", {
        method: 'post',
        headers: {
          'Authorization': jwt,
        },
        body : formData
      })
        .then(resonse => {
          Swal.fire({
            text:'변경이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '완료', // confirm 버튼 텍스트 지정
            confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
          }).then(result => {
            window.location.reload();
          });
          
        });
    }

    useEffect(() => {
      if(getCoverImg==='default'){
        setcoverImg(cover);
      }else{
        setcoverImg("http://localhost:8080/coverImg/"+getCoverImg);
      }

      if(getProfileImg==='default'){
        setprofileImg(userImage);
      }else{
        setprofileImg("http://localhost:8080/profile/"+getProfileImg);
      }
      
      
    }, []);

    function CheckPass(str){
      let reg1 =  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
      return(reg1.test(str));
     };

    
    const onProfileImg = (e) =>{
      const file = e.target.files[0];
      setprofileImgFile(file);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => {
          setprofileImg(reader.result);
          resolve();
        };
      });
    };
    const onCoverImg = (e) =>{
      const file = e.target.files[0];
      setcoverImgFile(file);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => {
          setcoverImg(reader.result);
          resolve();
        };
      });
    };

  return (
    <div id="body" style={{margin:"auto",width:"800px"}}>
      <div className="content-grid" style={{margin:"auto"}}>
        <div className="account-hub-content">
          <div className="section-header">
            <div className="section-header-info">
              <p className="section-pretitle">My Profile</p>
              <h2 className="section-title">Profile Info</h2>
            </div>
          </div>

          <div className="grid-column">
            <div className="grid grid-3-3-3 centered"  style={{margin:"10px auto auto",width:"800px", marginTop:"10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}>
              <div className="user-preview small fixed-height" style={{width:"258px"}}>
                <figure className="user-preview-cover liquid">
                  <img src={coverImg} alt="" style={{objectFit: "cover",borderRadius: "12px 12px 0px 0px",height:"80px"}}/>
                </figure>
                <div class="profile-header-info" >
                  <div class="user-short-description big">
                    <a class="user-short-description-avatar user-avatar big" style={{width:"88px", height:"88px",borderRadius: "120px",backgroundColor:"white", marginLeft:"-40px",marginTop:"70px"}}>
                      <img src={profileImg} alt =""  width='80' height='80' style={{marginTop:"4px",borderRadius: "80px",objectFit: "cover",marginBottom:"20px",}}/>
                    </a>
                  </div>
                </div>
              </div>

              <label for="profileImg"> 
                <div className="upload-box"  style={{width:"258px"}} >
                  <svg className="upload-box-icon icon-members">
                    <use href="#svg-members"></use>
                  </svg>
                  <p id="filesP1" className="upload-box-title">프로필 이미지 변경</p>
                  <p id="filesP2" className="upload-box-text">최소 110x110px</p>
                  <input type="file" id="profileImg" name="files" accept=".jpg, .jpeg, .png" onChange={onProfileImg} style={{display:"none"}}/> 
                </div>
              </label>
              <label for="coverImg"> 
                <div className="upload-box"  style={{width:"258px"}} for="file">
                  <svg className="upload-box-icon icon-photos">
                    <use href="#svg-photos"></use>
                  </svg>
                  <p id="backP1"className="upload-box-title">배경 이미지 변경</p>
                  <p id="backP2" className="upload-box-text">최소 1184x300px</p>
                  <input  type="file" id="coverImg" name="backFiles" onChange={onCoverImg} accept=".jpg, .jpeg, .png" style={{display:"none"}}/>
                </div>
              </label>
          </div>

          <div className="widget-box" style={{marginTop:"10px"}}>
            <p className="widget-box-title">비밀번호 변경</p>
            <div className="widget-box-content">
              <div className="form-row split">
                <div className="form-item">
                  <div className="form-input small">
                    <input type="password" id="userPw" name="userPw" onChange={onChange} placeholder="비밀번호를 변경하시려면 입력해주세요."/>
                  </div>
                </div>
                <div className="form-item">
                  <div className="form-input small">
                    <input type="password" id="re_pw" name="re_pw" onChange={onChange} placeholder="비밀번호 중복을 입력해주세요."/>
                  </div>
                </div>
              </div>
            </div>
            {BtnDisable===true ?
            <button  id="ModifyBtn" style={{margin:"25px 0px", backgroundColor:"rgb(212 214 217)"}} className="dropdown-navigation-button button small secondary" disabled={BtnDisable} onClick={letsModify} >수정하기</button>
            :
            <button  id="ModifyBtn" style={{margin:"25px 0px"}} className="dropdown-navigation-button button small secondary" disabled={BtnDisable} onClick={letsModify} >수정하기</button>
            }
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
