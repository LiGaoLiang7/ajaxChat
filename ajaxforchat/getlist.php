<?php 
	include 'conn.php';
	header("Content-Type:text/html; charset=utf-8");
	$nowTime = $_REQUEST['nowTime'];
	$getSql = "SELECT * FROM myDreamList";
	$result = mysql_query($getSql);

	/* 不管发没发言更新我的状态 表示我现在在线 这只是偷偷的更新了 */
	$option = $_REQUEST['option'];
	if($option == 'getList'){
		$userIp = $_REQUEST['ip'];
		$userName = $_REQUEST['userName'];
		$isInput = $_REQUEST['isInput'];
		/* 查找是否存在IP记录 */
		$ipsql = "SELECT * FROM myDreamList WHERE ip = '".$userIp."' AND userName = '".$userName."';";
		$queryResult = mysql_query($ipsql);
	
		if(mysql_num_rows($queryResult) > 0){ 
			$updateUserNameSql = "UPDATE myDreamList set lastTime = '".$nowTime."', isInput = '".$isInput."' WHERE userName = '".$userName."' AND ip = '".$userIp."';";
			if(mysql_query($updateUserNameSql)){
				//do nothing
			}
		}
	}

	if(mysql_num_rows($result) > 0){
		/* 删除5天以上的用户的用户 */
		removeTimeoutUsers($nowTime);
		$str = "[";
		while($row = mysql_fetch_array($result)){
				$str = $str."{ \"userName\" : \"".$row['userName']."\", \"ip\" : \"".$row['ip']."\",  \"pos\" : \"".$row['pos']."\", \"lastTime\" : \"".$row['lastTime']."\",\"setStatus\" : \"".$row['setStatus']."\",\"isInput\" : \"".$row['isInput']."\"},";
			}
			$pos = strrpos($str, ",");
			$str[$pos] = ']';
			echo $str;
	}else{
		echo "[{\"user\" : \"none\"}]";
	}

	function removeTimeoutUsers($nowTime){
		/* 从list中获取每个用户的IP和用户名 
		   用IP和用户名查找对话中的最后时间 
		   并和当前的时间比较 如果是删除5天以上的用户的记录就删掉list中这个用户 */
		$getUserSql = "SELECT userName,ip,lastTime FROM myDreamList;";
		$list = mysql_query($getUserSql);
		if(mysql_num_rows($list) > 0){
			while($user = mysql_fetch_array($list)){
				//$getMaxTimeSql = "SELECT max(UTCtime) from myDream WHERE speakerIP = '".$user['ip']."' and myname = '".$user['userName']."';";
				//$theResult = mysql_query($getMaxTimeSql);
				/*	if(mysql_num_rows($theResult) > 0){
						$maxTime = mysql_fetch_array($theResult);
						compareTimeAndRemoveUser($nowTime,$user['userName'], $user['ip'], $maxTime['max(UTCtime)']);
					}else{
						return;
					}
				*/
				compareTimeAndRemoveUser($nowTime,$user['userName'], $user['ip'], $user['lastTime']);
			}
		}
		return;    
	}
	function compareTimeAndRemoveUser($time, $username, $userIP, $lastTime){
		/* 删除5天以上的用户 毫秒数 24 * 3600 * 5 * 1000 */
		$time_spec = 432000000;
		if($time - $lastTime > $time_spec){
			$removeSql = "DELETE FROM myDreamList WHERE userName = '".$username."' AND ip = '".$userIP."';";
			if(mysql_query($removeSql)){
				return;/* 该用户已经删除 */
			}
		}
		return;
	}



	

	



?>