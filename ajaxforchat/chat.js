	$(function(){
	   var currentMsgId = 0;
	   var mySettedName = "起不起名字";
	   var posId = 0;
	   var myIP = "192.168.0.1";
	   var listenerIP = "all";
	   var cookietime = 0;
	   var time;
	   var testTime;
	   var myStatus = "online";
	   var CtrlKey = false;
	   var isInput = 0;

		function getDateTime(){
		   	var now = new Date();
		   	var str = now.getUTCFullYear() +'-'+ (parseInt(now.getMonth(), 10)+1) + '-' + now.getDate() +" " + now.getHours() + ':'+ now.getMinutes() + ':'+ now.getSeconds(); 
		   	return str;
	   	}
	   	function getUTCTime(){
	   		var miniSec = new Date();
	   		return miniSec.getTime();
	   	}
	   	/* cookie操作 读取 写入 删除 Begin */
	 var cookieUtil = {
	 	get:function(name){
	 		var cookieName = encodeURIComponent(name) + '=',
	 		cookieStart = document.cookie.indexOf(cookieName),
	 		cookieValue = null;
	 		if(cookieStart > -1){
	 			var cookieEnd = document.cookie.indexOf(';', cookieStart);
	 			if(cookieEnd == -1){
	 				cookieEnd = document.cookie.length;
	 			}
	 			cookieValue = encodeURIComponent(document.cookie.substring(cookieStart+cookieName.length, cookieEnd));
	 		}
	 		return cookieValue;
	 	},
	 	set:function(name, value, expires, path, domain, secure){
	 		var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
	 		if(expires instanceof Date){
	 			cookieText += ";expires=" + expires.toGMTString();
	 		}
	 		if(path){
	 			cookieText += "; path=" + path;
	 		}
	 		if(domain){
	 			cookieText += "; domain=" + domain;
	 		}
	 		if(secure){
	 			cookieText += "; secure=" + secure;
	 		}
	 		document.cookie = cookieText;
	 	},
	 	unset:function(name, path, domain, secure){
	 		this.set(name, "", new Date(0), path, domain, secure);
	 	}
	 }
	  /* cookie操作 读取 写入 删除 Ends */
	  function getUserList(){
	  	$.post("getlist.php", { 
				option : 'getList',
				nowTime : getUTCTime(),
				ip : myIP,
				userName : mySettedName,
				isInput : isInput,
			}, function (data, textStatus){
                if(textStatus == "success"){
                	if(data  == "status update"){
                		
                	}else{
                		$("#userList li").remove();
                		if(data[0].userName !== undefined){
                			praseListDateAndAdded(data);
               			}
                	}
                }
			},"json");
	  }
	  /* 解析列表信息 添加到页面 */
	  function praseListDateAndAdded(data){
	  	// 先清除原始列表
	  	$("#userList>li").remove();
	  	if(data !== null){
	  		var onlineNameList = new Array();
	  		var chatWithClass = "class = ''";
	  		$.each(data, function(index, val) {
	  			var theTime = parseInt(data[index].lastTime);
	  			var userIP = data[index].ip;
	  			var now = getUTCTime();
	  			var statusHtml = "",inputHtml = "";
	  			var theStoredStatus = data[index].setStatus;
	  			var isinputingStatus = parseInt(data[index].isInput);

	  			if(data[index].ip ===  listenerIP){
	  				chatWithClass = "class = 'chatWith'"; 
	  			}else{
	  				chatWithClass = "class = ''";
	  			}
	  			statusHtml = "<i class='online status'></i><em class='explaination'>online</em>";

	  			if(theStoredStatus !== '' && theStoredStatus !== 'online'){
	  				if(theStoredStatus === 'busy'){
	  					statusHtml = "<i class='status " + theStoredStatus + "'></i><em class='explaination'>"+ "do not bother"+"</em>";
	  				}else if(theStoredStatus === 'offline'){
	  					var satausStr = timeFromNow(theTime);
	  					statusHtml = "<i class='status " + theStoredStatus + "'></i><em class='explaination'>"+ satausStr +"</em>";
	  				}else{
	  					statusHtml = "<i class='status " + theStoredStatus + "'></i><em class='explaination'>"+ "back soon" +"</em>";
	  				}
	  			}
	  			if(isinputingStatus === 1){
	  				inputHtml = "<i class='inputStatus'> is typing...</i>";
	  			}
	  			var htmlStr = "<li ip-data='"+userIP+"' "+ chatWithClass +"><div class='faceIcon' style='background-position:0 -" + data[index].pos + "px'></div><span>"+ data[index].userName +"</span>"+ statusHtml + 
	  			inputHtml +"</li>";
  				$("#userList").append(htmlStr);
	  		});

	  		/* 加入群聊列表 */
	  		var qunstr = "<li ip-data='all'><div class='faceIcon' style='background-position:0 -350px'></div><span>七年三班交流群</span><i class='online status'></i><em class='explaination'>online</em></li>";
  			$("#userList").prepend(qunstr);
  			if(listenerIP === "all"){
  				$(".commitStatus").text("Chat with "+ onlineNameList.toString() +".");
  				$("#userList>li").eq(0).addClass('chatWith');
	  		}
	  		/* 点击列表的li 出现聊天的对话框 */
  			$("#userList>li").click(function(event) {
				listenerIP = $(this).attr('ip-data');
				if(listenerIP === 'all'){
					$(".commitStatus").text("Chat with "+ onlineNameList.toString() +".");
					newID = "resText";
				}else{
					$(".commitStatus").text("Chat with "+ $(this).children('span').text() +".");
					/* 动态生成聊天框 */
					var thisIp = $(this).attr('ip-data');
					var newID =  thisIp.replace(new RegExp( '\\.', 'g' ),'-');
					if($("#"+newID).length === 0){
						$(".textBox").append("<div id='"+newID+"' class='resText'></div>");
					}
				}
				$(".textBox").children('.resText').css('display', 'none');
				$("#"+newID).css('display', 'block');
				$(this).siblings('li').removeClass('chatWith');
				$(this).addClass('chatWith');
			});
	  		
	  		/* 5秒之后删除掉显示输入状态的节点 */
	  		setTimeout(function(){
	  			$(".inputStatus").remove();
	  		}, 6000);
	  	}
	  }
	  /* 自己的IP */
	   function getMyIPAddress(){
   		$.post("sql.php", { 
				option : 'getIP'
			}, function (data, textStatus){
                if(textStatus == "success"){
                	if(typeof(data) == 'string')
                		myIP = data;
                }
			});
	   }
	   /* 获取消息 */
	   function getMegFromSever(){
	   		$.post("get.php", { 
						beginId :  currentMsgId,
						myIP : myIP
					}, function (data, textStatus){
						if(textStatus === "success"){
							if(data === "#noNewData#"){
							 	return;
							}
							phraseDataAddHtml(data);
						}
					},"json");
	   }
	  /* 解析josn 并将数据追加到html中 */
	  function phraseDataAddHtml(data){
	  	if(data !== null){
	  		var ids = new Array();
		  	$.each(data, function(index, val) {
		  		/* 区分消息是自己发出去的还是别人发的 */
		  		var listenerIP = data[index].listener;
		  		var speakerIP = data[index].speakerIP;
		  		var speakerName = data[index].myname;
		  		var identify = "others";
		  		var boxID = "#resText";
		  		if(myIP === speakerIP && speakerName === mySettedName){
		  			identify = "myself";
		  		}
		  		//替换出消息中的表情
		  		var contentText = praseEmotions(data[index].content);
		  		var htmlStr = "<div class='"+identify+"'><b class='headIcon' style='background-position: 0 -"+ data[index].pos +"px;'></b><p><i></i>"+ contentText +"<em class='userName' title='"+data[index].myname+"'>"+data[index].myname+"</em><span>"+data[index].time+"</span>"+"</p></div>";
		  		// 判断要将消息添加到那个对话框中
		  		if(listenerIP === "all"){
		  			// 群聊消息
		  			boxID = "#resText";
		  		}else if(listenerIP === myIP){
		  			// 别人发给我的消息 添加到ip的对话框中
		  			boxID = "#" + speakerIP.replace(new RegExp( '\\.', 'g' ),'-');

		  		}else{
		  			// 判断是给谁说了 说话的人是我
		  			boxID = "#" + listenerIP.replace(new RegExp( '\\.', 'g' ),'-');
		  		}
		  		if($(boxID).length === 1){
		  			$(boxID).append(htmlStr);
		  			scrollToBottom(boxID); /* 如果有滚动条，将这个滚动条拉到最底部 */
		  		}else{
		  			alert(boxID + "ERROR: Dosen't exist");
		  		}
		  		ids.push(parseInt(data[index].id, 10));
		  	});
		  	setMaxId(ids);
	  	}
	  }
	  // [#emo54#]  => <img src="emo/emo54.jpg" alt="emo">
	function praseEmotions(text){
	  	var pos1 = text.indexOf('[#emo');
	  	if(pos1 === -1) return text; //如果不存在图片直接返回文本
	  	var pos2 = parseInt(text.indexOf('#]'), 10);
	  	var FrontWords = text.substring(0, pos1);
	  	var EndWords = text.substring(pos2+2, text.length);
	  	var imgName = text.substring(pos1+2, pos2);
	  	if(imgName.indexOf('g') !== -1){
	  		imgName = "emo/" + imgName + ".gif";
	  	}else{
	  		imgName = "emo/" + imgName + ".jpg";
	  	}
	  	/* 霸道递归 多个图片解决 */
	  	return FrontWords + "<img src='" + imgName + "' alt='"+ 'emo' +"'/>" + arguments.callee(EndWords);
	  }
	  /* str转成json格式 */
	  function strToJson(str){ 
		return JSON.parse(str); 
		}
	  function setMaxId(idArray){
		idArray.sort(compare);
		if(parseInt(idArray[0])  > currentMsgId){
			currentMsgId = idArray[0];
			}
		}
	  
	  function compare(value1,value2){
	  	if(value1 < value2){//降序
	  		return 1;
	  	}
	  	else if(value1 > value2){
	  		return -1;
	  	}else{
	  		return 0;
	  	}
	  }
	  function timeFromNow(oldtime){
	  	var now = new Date();
	  	var seconds = (Date.parse(now) - oldtime) / 1000; 
	  	var minutes = parseInt(seconds / 60);
	  	var hours = parseInt(Number(minutes / 60));
	  	var days = parseInt(hours / 24);
	  	var months = parseInt(days / 30);
	  	if(months > 0){
	  		return "left " + months + " months ago";
	  	}
	  	if(days > 0){
	  		return "left " + days + " days ago";
	  	}
	  	if(hours > 0){
	  		return "left " + hours + " hours ago";
	  	}
	  	if(minutes > 1){
	  		return "left " + minutes + " minutes ago";
	  	}
	  	return "left whithin one minute";
	  }

	  /* 发送消息 */
	  function doPostMessage(){
  		if($("#content").val() == "")return;
		$.post("sql.php", { 
					time :  getDateTime(), 
					content :  isRightLineChange($("#content").val()),
					myname : mySettedName,
					pos : posId*35,
					UTCTime : getUTCTime(),
					listenerIP : listenerIP,
					option : 'postMsg'
				}, function (data, textStatus){
                    if(textStatus == "success"){
                    	$("#content").val('');
                    }
				});
	  }
	  /* 如果这个消息中间有换行符，则转化成<br> 如果换行符是在结尾，则删掉这个换行符 */
	  function isRightLineChange(text){
	  		if(text[text.length - 1] === '\n'){
	  			text = text.substring(0, text.length - 1);
	  		}
	  		return text.replace(new RegExp( '\\n', 'g' ),'<br>');
	  }

	   /* 尝试从cookie中获取用户名 */
	   function getCookieName(){
	   		var usedName = decodeURIComponent(cookieUtil.get("name"));
	   		usedName = decodeURIComponent(usedName);
	   		if(usedName != "null"){
	   			clearInterval(cookietime);
	   			if(confirm("你好像用过昵称：" + usedName + " 还想继续用吗？")){
	   				mySettedName = usedName;
	   				conformMyName();
	   			}
	   		}else{
	   			var myname = prompt("请设置个昵称，好么？", "我的昵称");
	   			if(myname !== null){
	   				mySettedName = myname;
	   				conformMyName();
	   				/* cookie 设置失效时间在一个礼拜之后 */
	   				cookieUtil.set("name", mySettedName, new Date(new Date().valueOf() + 604800000), "/ext/dream/" ,"lefeier.net");
	   			}else{
	   				alert("不设置昵称聊毛线,滚(#‵′)粗凸");
	   				$("#myname").focus();
	   			}
	   				clearInterval(cookietime);
	   		}
	   }

	  /* 将滚动条在最底部 */
	  function scrollToBottom(chatBoxID){
	  	$(chatBoxID).scrollTop($(chatBoxID)[0].scrollHeight);
	  }
	  /* 确定我的昵称 */
	  function conformMyName(){
	  	$("span.myname").text(mySettedName);
	  	$("#myname").hide();
	  	/* 发送一条用户存在的信息 */
	  	addMyselfIntoList(); 
	  }
	  /* 向列表中添加本用户的数据 */
	  function addMyselfIntoList(){
	  		if(myIP !=="192.168.0.1" && mySettedName !== "起不起名字"){
	  			$.post("sql.php", { 
					userName : mySettedName,
					lastTime : getUTCTime(),
					ip : myIP,
					pos : posId*35,
					status : myStatus,
					option : 'addList',
					isInput : isInput,
				}, function (data, textStatus){
                    if(textStatus == "success"){
                    	/* 更新列表中的显示 获得最新三条消息的id */
                    	if(currentMsgId < data){/* 避免设置头像之后最后三句话重复显示 */
                    		currentMsgId = data;
                    		// console.log('currentMsgId = ' + currentMsgId);
                    	}
                    }
				});
	  		}
	  }

	  /* 设置我的名字和cookie */
	  function setMynameCookie(){
	  	if($("#myname").val() == ""){
	  		alert("昵称不能是空白……");
	  		$("#myname").focus();
	  		return;
	  	  }
	  		mySettedName = $("#myname").val();
	  		conformMyName();
	  		/* cookie 设置失效时间在一个礼拜之后 */
	  		cookieUtil.set("name", mySettedName, new Date(new Date().valueOf() + 604800000), "/ext/dream/" ,"lefeier.net");
	  }
	 
	   $("#send").click(function(){
	   		doPostMessage();
	   })
	   /* 获取IP */
	   getMyIPAddress();
	   //从cookie中尝试获取name
	   cookietime = setInterval(getCookieName, 1000);
	   
	   /* 更新现在的用户列表 6秒一次 */
	   setInterval(getUserList, 6000);

	   /* 获取到IP后开始拉下来消息 */
	   testTime = setInterval(function(){
	   		if(myIP != '192.168.0.1' && currentMsgId != 0){
	   			clearInterval(testTime);
	   			time = setInterval(getMegFromSever, 1000);
	   		}
	   }, 1000);
	  /* 事件  */
	  $(document).bind('keydown', function(event) {
	  	if(event.which === 17){
	  		CtrlKey = true;
	  	}
	  });
	   $(document).bind('keyup', function(event) {
	  	if(event.which === 17){
	  		CtrlKey = false;
	  	}
	  	
	  });

	  $("#select").change(function(event) {
	  	posId = $(this).val();
	  	/* 如果是最初始的状态就不需要设置nameCookie */
	  	if($("span.myname").html() == ""){
	  		setMynameCookie();
	  	}
	  	addMyselfIntoList();//更新数据库中的头像和name
	  });
	  /* 选择设置状态 */
	  $("#mystatus").change(function(event) {
		var value = $(this).val();
	  	switch (value) {
	  		case '1':
	  			myStatus = 'online';
	  			break;
	  		case '2':
	  			myStatus = 'away';
	  			break;
	  		case '3':
	  			myStatus = 'busy';
	  			break;
	  		default:
	  			myStatus = 'online';
	  			break;
	  	}
	  	addMyselfIntoList();//更新数据库中的头像和name
	  });
	  

	  /* 按enter键设置现在的名字 */
	  $("#myname").bind('keyup', function(event) {
	  	if(event.which === 13){
	  		event.preventDefault();
	  		setMynameCookie();
	  	}
	  });
	  /* 用keypress获取在打字中的状态 */
	  $("#content").bind('keyup', function(event) {
	  });
	   /* 按enter键发送消息 */
	   $("#content").bind('keyup', function(event) {
	   		isInput = 1;//按键的状态
	   		if(event.which == 13){
	   			if(CtrlKey){
	   				 $("#content").val($("#content").val() +  '\n');
	   			}else{
	   				event.preventDefault();
	   				doPostMessage();
	   			}
	   		}
	   });
	   /* 每六秒钟清除一次在输入的状态 */
	   setInterval(function(){
	   	 isInput = 0;
	   }, 6000);

	   /* 手机上隐藏出现列表 */
	   $("#toggleList").click(function(event) {
	   	var $list =   $(".rightListArea");
	   	if($list.hasClass('slideInRight')){
	   		$list.removeClass('slideInRight').addClass('slideOutRight')
	   	}else{
	   		$list.removeClass('slideOutRight').addClass('slideInRight');
	   	}
	   });
	  	/* 点击选择表情 */
	   $(".icon").click(function(event) {
			var $emo = $('.emos');
			if($emo.hasClass('hide')){
				$(this).addClass('clicked');
				$emo.removeClass('hide');
			}else{
				$emo.addClass('hide');
				$(this).removeClass('clicked');
			}
		});
	    /* 将表情输入到框中 */
		$("#emotions>ul>li").click(function(event) {
			var thisEmo= $(this).children('img').attr('alt');
			var text = $("#content").val();
			text += '[' + thisEmo + ']';
			$("#content").val(text);
			setTimeout(function(){
				$('.emos').addClass('hide');
			}, 500);
		});
	   /* 事件 */
	   	$(window).on('beforeunload', function(e) {
	   		/* 滚的时候重置该人的状态，离线，并且不再输入状态 */
	   		myStatus = "offline";
	   		isInput = 0;
	   		addMyselfIntoList();
			return '下线吗？';
		});
	})
