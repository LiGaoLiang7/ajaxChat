<?php
	$isConnectedFlag;
	function connect(){
			$host = "qdm121543117.my3w.com";
			$root = 'qdm121543117';
			$pwd = "lgl544443";
			global $isConnectedFlag;
			$con = mysql_connect($host,$root,$pwd);
			if($con == false){
				// echo "链接数据库失败<br>";
				$isConnectedFlag = false;
			}
			else{
				$isConnectedFlag = true;
			}
			mysql_select_db('qdm121543117_db',$con);
			mysql_query("set character set 'utf8'"); 	
	}
	
	if($isConnectedFlag == false){
		connect();
	}
?>