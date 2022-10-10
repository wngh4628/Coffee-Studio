var toggle = true;
var tbno = 0;
function openReply(bno){
	if(toggle){
	 	$('#replyBox'+bno).attr('style', 'display:flex; flex-direction:column');
	 	$('#commentForm'+bno).attr('style', 'display:flex; flex-direction:column');
	 	toggle = false;	
	} else{
		$('#replyBox'+bno).attr('style', 'display:none');
		$('#commentForm'+bno).attr('style', 'display:none');
		toggle = true;
	}
}
var reToggle = true;
function openRecmt(rno){
	if(reToggle){
		$('#recmtPost'+rno).attr('style', 'display:flex; flex-direction:column');
	 	$('#reCmtFormBox'+rno).attr('style', 'display:flex; flex-direction:column');
	 	reToggle = false;	
	} else{
		$('#recmtPost'+rno).attr('style', 'display:none');
		$('#reCmtFormBox'+rno).attr('style', 'display:none');
		reToggle = true;
	}
}
var count = 0;
function replyBtn(bno){
	if($('#replyContent'+bno).val()==''){
		openModal("내용을 입력해주세요.");
		return false;
	}
	var params = $('#replyFrm'+bno).serialize();
	$.ajax({
		url : '/reply',
		type : 'POST',
		cache: false,
	    data: params,
	    datatype : 'text',
		contentType:'application/x-www-form-urlencoded; charset=utf-8',
	    success: function(data) {
	    	var cloneReply = $('#ajaxAddReply'+bno).clone();
	    	if(data.profileCheck==1){
	    		cloneReply.find('#ajaxReplyProfile'+bno).replaceWith('<figure><img class="hexagon-image-30-32" id="ajaxReplyProfile" src="/user/profileId/'+data.replyWriter+'"></figure>');
	    	} else{
		    	cloneReply.find('#ajaxReplyProfile'+bno).replaceWith('<div class="hexagon-image-30-32" id="ajaxReplyProfile" data-src="../../img/user_baseProfile.png"></div>');
	    	}	    	
	    	var date = new Date(data.replyDate);
	    	var month = date.getMonth();
	    	if(month <10){
	    		month = '0' + month;
	    	}
	    	cloneReply.find('#ajaxReplyId'+bno).html(data.replyWriter);
	    	cloneReply.find('#ajaxReplyContent'+bno).html(data.replyContent);
	    	cloneReply.find('#ajaxReplyDate'+bno).html(date.getFullYear() + '-' + month + '-' + date.getDate() + ' ' + date.getHours() + '-' + date.getMinutes());
	    	cloneReply.attr('style', 'display:flex; flex-direction:column; margin-left:40px;');
	    	$('#replyContent'+bno).val("");
		    $('#replyBox'+bno).append(cloneReply);	
		    var commentBox = $('#commentPost'+bno).clone();
		    $('#replyBox'+bno).append(commentBox);
		    $('#commentPost'+bno).remove();
	    },
	    error: function(request, status, error){
   			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}
function react(no, id){
	var param = {"bno" : no, "userId" : id};
	var reactDiv = $('#react'+no);
	$.ajax({
	    url: "/react",
	    type: "POST",
	    cache: false,
	    data: JSON.stringify(param),
		contentType:'application/json; charset=utf-8',
	    success: function(data) {
	    	if(data.reactCount == 0){
	    		reactDiv.find('p').html('');
	    		$('#react-icon').attr('style','display:none');
	    		$('#reactStartDiv'+no).attr('style', 'display:none');
	    		$('#userDiv'+no).find('#user'+id).remove();
	    	} else{
	    		$('#react-icon').attr('style','display:inline');
	    		$('#reactStartDiv'+no).attr('style', 'display:flex');
	    		reactDiv.find('p').html(data.reactCount);
	    		if(data.reactType==1){
	    			$('#userDiv'+no).append('<p class="simple-dropdown-text" id="user' + id + '">' + id + '</p>');
	    		} else if(data.reactType==-1){
	    			$('#user'+id).remove();
	    		}
	    	}
		},
		error: function(request, status, error){
   			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}
var reCount = 1;
function recmtBtn(rno){
	var params = $('#recmtFrm'+rno).serialize();
	$.ajax({
		url : '/recmt',
		type : 'POST',
		cache: false,
	    data: params,
	    datatype : 'text',
		contentType:'application/x-www-form-urlencoded; charset=utf-8',
	    success: function(data) {
	    	var cloneRecmt = $('#ajaxAddRecmt'+data.rno).clone();
	    	if(data.profileCheck==1){
	    		cloneRecmt.find('#ajaxRecmtProfile'+data.rno).replaceWith('<figure><img class="hexagon-image-30-32" id="ajaxReplyProfile" src="/user/profileId/'+data.recmtWriter+'"></figure>');
	    	} else{
		    	cloneRecmt.find('#ajaxRecmtProfile'+data.rno).replaceWith('<div class="hexagon-image-30-32" id="ajaxReplyProfile" data-src="../../img/user_baseProfile.png"></div>');
	    	}	    	
	    	var date = new Date(data.recmtDate);
	    	var month = date.getMonth();
	    	if(month <10){
	    		month = '0' + month;
	    	}
	    	cloneRecmt.find('#ajaxRecmtId'+data.rno).html(data.recmtWriter);
	    	cloneRecmt.find('#ajaxRecmtContent'+data.rno).html(data.recmtContent);
	    	cloneRecmt.find('#ajaxRecmtDate'+data.rno).html(date.getFullYear() + '-' + month + '-' + date.getDate() + ' ' + date.getHours() + '-' + date.getMinutes());
	    	cloneRecmt.attr('style', 'display:block;');
	    	$('#recmtContent'+data.rno).val("");
	    	$('#recmtBox'+data.rno).append(cloneRecmt);
	    	reCount ++;
	    	
	    },
	    error: function(request, status, error){
   			alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
}