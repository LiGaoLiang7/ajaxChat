<?php 
	include 'conn.php';
	$ip = "";
	$option = $_REQUEST['option'];

	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
	    	$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
		    $ip = $_SERVER['REMOTE_ADDR'];
		}

	if($option == "getIP"){
		echo $ip;
		return;
	}

	if($option == "postMsg"){
		$time = $_REQUEST['time'];
		$content = $_REQUEST['content'];
		$pos =  $_REQUEST['pos'];
		$myname = $_REQUEST['myname'];
		$UTCTime = $_REQUEST['UTCTime'];
		$listenerIP = $_REQUEST['listenerIP'];
		
		if($time != "" && $content != ""){
			$sql = "INSERT INTO myDream (content, dateTime, pos, myname, speakerIP, listener, UTCTime) VALUES ('".$content."','".$time."','".$pos."','".$myname."'
				,'".$ip."','".$listenerIP."','".$UTCTime."');";
			if(mysql_query($sql)){
				$maxMasgId = getMaxMsgId();
				echo $maxMasgId;
			}else{
				echo $sql;
			}
		}
	}
	
	function getMaxMsgId(){
		$MsgIdSql = "select max(id) from myDream";
		$maxIds =  mysql_query($MsgIdSql);
		$maxId = mysql_fetch_array($maxIds);
		return $maxId[0];
	}

	if($option == "addList"){
		$userName = $_REQUEST['userName'];
		$lastTime = $_REQUEST['lastTime'];
		$posss = $_REQUEST['pos'];
		$userIp = $_REQUEST['ip'];
		$status = $_REQUEST['status']; 
		$isInput = $_REQUEST['isInput'];
		ifNoIpDataInsert($userName, $lastTime, $posss, $userIp, $status, $isInput);

	}

	function ifNoIpDataInsert($userName, $lastTime, $posss, $userIp, $status, $isInput){
		$querySql = "INSERT INTO myDreamList (userName, lastTime, ip, pos, setStatus, isInput) VALUES ('".$userName."','".$lastTime."','".$userIp."','".$posss."','".$status."','".$isInput."');";
		/* 查找是否存在IP记录 */
		$ipsql = "SELECT * FROM myDreamList WHERE ip = '".$userIp."';";
		$queryResult = mysql_query($ipsql);
	
		if(mysql_num_rows($queryResult) > 0){/* 存在IP则更新这位的昵称 */
			$updateUserNameSql = "UPDATE myDreamList set userName = '".$userName."',pos = '".$posss."',setStatus = '".$status."',isInput = '".$isInput."' WHERE ip = '".$userIp."';";
			if(mysql_query($updateUserNameSql)){
				echo getMaxMsgId()-1; /* getMessage只能获取最后一句话 */
			}
		}else{/* 不存在IP则插入这条记录 */
			if(mysql_query($querySql)){
				echo getMaxMsgId()-1;
			}
		}
		return;
	}

	
//header("Content-Type:text/html; charset=utf-8");mysql_close($con);
?>