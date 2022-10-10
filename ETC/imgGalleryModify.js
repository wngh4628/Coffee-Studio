import React, { Component,forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import lock from '../static/img/icon/lock.png';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
// fake data generator

const getItems = count =>
  Array.from({length: count.length}, (v, k) => k).map(k => ({
    index: k,
    id: `item-${k}`,
    ImgUrl: count.fileArr[k],
    content: '',
  }));


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const readURL = (getFileArr, index) => {
  console.log(index);
  let reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById(index).src = e.target.result;
    };
    reader.readAsDataURL(getFileArr);
};

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  margin: `0 ${grid}px 0 0`,
  width: 150,
  height:150,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
});

const getListStyle = (isDraggingOver, itemsLength) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  width: itemsLength * 160 ,
});


 class imgGallery extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef()
    this.getFileArr=this.props.ImgList.subList;
    console.log("보내기: " + this.props.getModifycontent);
    this.state = {
      items: getItems({
        length:this.props.ImgList.subList.length,
        fileArr:this.props.ImgList.subList
      }),
      deleteList:{
      }
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    
    this.setState({
      items
    });
  }
 
 
  checkImg(removedIdx){
    console.log(removedIdx);
   
    const result = Array.from(this.state.items);
    const deleteArr = Array.from(this.state.deleteList);

    console.log(result[removedIdx].content==='');

    if(result[removedIdx].content===''){
      console.log(result[removedIdx].ImgUrl,);
      let deleteitem =[];
      deleteitem = [...deleteArr, result[removedIdx].ImgUrl];
      console.log(deleteitem);

      this.setState({
        deleteList:deleteitem
       });
    }

    if(this.state.items.length===1){
      this.props.setgallaryTag('');
      this.props.setBoxSize("250px");
    }else{
      let changeitem =[];
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
      console.log(result);
      console.log(result.length);
      console.log(removedIdx);

      for(let i=0; i<result.length; i++){
        if(i<removedIdx){
          console.log('그냥: ' + (i));
          changeitem = [...changeitem,{
            index:(i),
            id: `item-`+(i),
            content: result[i].content,
            ImgUrl:result[i].ImgUrl
          }];
          if(result[i].content!==''){
            let reader = new FileReader();
            reader.onload = function(e) {
              document.getElementById(i).src = e.target.result;
            };
            reader.readAsDataURL(result[i].content);
          }
        }else if(i>removedIdx){
          console.log('마이너스: ' + (i-1));
          changeitem = [...changeitem,{
            index:(i-1),
            id: `item-`+(i-1),
            content: result[i].content,
            ImgUrl:result[i].ImgUrl
          }];
          if(result[i].content!==''){
            let reader = new FileReader();
            reader.onload = function(e) {
              document.getElementById(i-1).src = e.target.result;
            };
            reader.readAsDataURL(result[i].content);
          }
        }
      }
      this.setState({
        items:changeitem
       });
    }
  }
  addImg= (dd) => {
    let items ='';
    const result = Array.from(this.state.items);
    console.log(dd);
    for(let i=0; i<dd.length; i++){
      console.log(Array.from(this.state.items));
      if(i===0){
        items = [...result,{
          index: result.length,
          id: `item-`+(result.length),
          ImgUrl: dd[i].name,
          content: dd[i],
        }];
        this.setState({
          items
        });
        let reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById(result.length+i).src = e.target.result;
        };
        reader.readAsDataURL(dd[i]);
      }else{
        items = [...items,{
          index: items.length,
          id: `item-`+(items.length),
          ImgUrl: dd[i].name,
          content: dd[i],
        }];
        this.setState({
          items
        });
        let reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById(result.length+i).src = e.target.result;
        };
        reader.readAsDataURL(dd[i]);
      }
     
    }
    console.log('===========');
    console.log(Array.from(this.state.items));
  }
  sendToParent = (getModifycontent, openState) => {
    let jwt = localStorage.getItem('Authorization')
    let formData = new FormData();
   
    formData.append("content", getModifycontent);
    formData.append("imgCode",this.props.ImgList.imgCode);
    formData.append("mpno",this.props.ImgList.mpno);
    formData.append("openState",openState);
    formData.append("size",this.state.items.length);
    for(let i = 0; i < this.state.items.length; i++) {
     // formData.append("files",this.state.items[i].content);
     if(this.state.items[i].content===''){
      formData.append("ImgName"+i,this.state.items[i].ImgUrl);
     }else{
      console.log(this.state.items[i].content);
      formData.append("ImgName"+i,this.state.items[i].ImgUrl);
      formData.append("files", this.state.items[i].content);
     }
    }
    formData.append("deleteListSize",this.state.deleteList.length);
    for(let i = 0; i < this.state.deleteList.length; i++) {//삭제할 아이템 추가
      formData.append("deleteList"+i,this.state.deleteList[i]);
    }
    for (var pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }
    this.props.setData(formData)

    if(formData!==''){
    console.log(formData);
    fetch('/letsModifyPost', {
      method: 'post',
      headers: {
        'Authorization': jwt
      },
      body : formData
    }).then(res => res.json())
      .then(res => {
        console.log(res);
        Swal.fire({
          text:'수정 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
        });
        //this.props.setModifyedDate(res);
        this.props.PostModify(res);
    });
    }
  }

  
  render() {
    
    return (
      <div style={{overflow: "scroll", height: 190}}>
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver, this.state.items.length)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index} >
                  {(provided, snapshot) => (
                  <div  ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)}
                  >
                    <div style={{width:"20px",height:"20px", }} 
                    onClick={() => {this.setState({items:this.state.items.filter((index)=>{
                      return index.id !==item.id;
                    })});
                    this.checkImg(index);       
                    }
                  }
                    >X</div>
                    <img id = {index} src={"http://43.200.128.40:8080/image/"+item.ImgUrl} style={{width:"150px",height:"150px", objectFit: "cover"}} alt=""/>
                  </div>
                  )}
                 
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      </div>
    );
  }
}
export default imgGallery;