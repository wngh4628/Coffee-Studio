import React, { Component,forwardRef, useImperativeHandle } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import lock from '../static/img/icon/lock.png';
import Swal from 'sweetalert2';
// 게시글 수정 시, 기존에 있던 사진들 전부 지우고 파일 셀렉터로 이미지 다시 불러왔을 때

const getItems = count =>
  Array.from({length: count.length}, (v, k) => k).map(k => ({
    index: k,
    id: `item-${k}`,
    content: count.fileArr[k],
    src:readURL(count.fileArr[k],k),
  }));

// a little function to help us with reordering the result

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
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 ${grid}px 0 0`,
  width: 150,
  height:150,
  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver, itemsLength) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: grid,
  width: itemsLength * 160 
});



 class imgGallery extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef()
    this.getFileArr=this.props.sendfile;
    console.log("보내기: " + this.props.getModifycontent);
   console.log(this.getFileArr);
    this.state = {
      items: getItems({
        length:this.props.sendfile.length,
        fileArr:this.props.sendfile
      }),
      files:this.props.sendfile,
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
    if(this.state.items.length===1){
      this.props.setgallaryTag('');
      this.props.setBoxSize("250px");
    }else{
      let changeitem =[];
      const result = Array.from(this.state.items);
     
      for(let i=0; i<result.length; i++){
        if(i<removedIdx){
          changeitem = [...changeitem,{
            index:(i),
            id: `item-`+(i),
            content: result[i].content,
            src:1,
          }];
          let reader = new FileReader();
          reader.onload = function(e) {
            document.getElementById(i).src = e.target.result;
          };
          reader.readAsDataURL(result[i].content);
        }else if(i>removedIdx){
          console.log("포문: "+i);
          changeitem = [...changeitem,{
            index:(i-1),
            id: `item-`+(i-1),
            content: result[i].content,
            src:1,
          }];

          let reader = new FileReader();
          reader.onload = function(e) {
            document.getElementById(i-1).src = e.target.result;
          };
          reader.readAsDataURL(result[i].content);
        }
      }
      this.setState({
        items:changeitem
       });
      console.log("========");
      console.log(changeitem);
      console.log(this.state.items);
    }
  }
  addImg= (dd) => {
    let items ='';
    const result = Array.from(this.state.items);
    
    for(let i=0; i<dd.length; i++){
      console.log(Array.from(this.state.items));
      // const result = Array.from(this.state.items);
      if(i===0){
        items = [...result,{
          index: result.length,
          id: `item-`+(result.length),
          content: dd[i],
          src:1,
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
          content: dd[i],
          src:1,
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
  sendToParent = () => {
    let jwt = localStorage.getItem('Authorization')
    let formData = new FormData();
    console.log("보내기: " + this.props.getModifycontent);
    formData.append("content",this.props.getModifycontent);
    formData.append("openState",this.props.sendOpenState);
    formData.append("imgCode",this.props.ImgList.imgCode);
    formData.append("mpno",this.props.ImgList.mpno);
    for(let i = 0; i < this.state.items.length; i++) {
      formData.append("files",this.state.items[i].content);
    }
    this.props.setData(formData)

    if(formData!==''){
      for (var pair of formData.entries()) {
        console.log(pair[1]); 
      }
    
    console.log(formData);
    fetch('/letsModifyAllImg', {
      method: 'post',
      headers: {
        'Authorization': jwt
      },
      body : formData
    }).then(resonse => resonse.json())
      .then(resonse => {
        console.log(resonse);
        Swal.fire({
          text:'수정 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '완료', // confirm 버튼 텍스트 지정
          confirmButtonColor: '#426BFA', // confrim 버튼 색깔 지정
        });
        
        this.props.PostModify(resonse);
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
                  <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}
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
                    <img id = {index} style={{width:"150px",height:"150px", objectFit: "cover"}} alt=""/>
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