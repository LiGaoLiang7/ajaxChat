<?php 
	
	include 'conn.php';
	header("Content-Type:text/html; charset=utf-8");
	
	$beginID = $_REQUEST['beginId'];
	$myIP = $_REQUEST['myIP'];
	if($beginID != ""){
		$messages = echoAllDatas($beginID, $myIP);
		if($messages != ""){
			echo $messages;
		}else{
			echo "#noNewData#";
		}
	}
	/* 获取新的聊天数据 用json格式返回 */
	function echoAllDatas($ID, $IP){
		$str = "[";
		$getSql = "select * from myDream where (id > '".$ID."' and listener = 'all') or (id > '".$ID."' and listener = '".$IP."') or (id > '".$ID."' and speakerIP = '".$IP."') order by id;";
		$result = mysql_query($getSql);
		if(mysql_num_rows($result) > 0){
			while($row = mysql_fetch_array($result)){
				$str = $str."{ \"id\" : \"".$row['id']."\" , \"content\" : \"".$row['content']."\" , \"time\" : \"".$row['dateTime']."\" , \"pos\" : \"".$row['pos']."\" , \"myname\" : \"".$row['myname']."\" , \"speakerIP\" : \"".$row['speakerIP']."\" , \"listener\" : \"".$row['listener']."\"}, ";
			}
			$pos = strrpos($str, ",");
			$str[$pos] = ']';
			return $str;
		}
		else{
			return "";
		}
	}
?>