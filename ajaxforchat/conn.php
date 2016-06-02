<?php
	$isConnectedFlag;
	function connect(){
			$host = "host";
			$root = 'root';
			$pwd = "pwd";
			global $isConnectedFlag;
			$con = mysql_connect($host,$root,$pwd);
			if($con == false){
				// echo "链接数据库失败<br>";
				$isConnectedFlag = false;
			}
			else{
				$isConnectedFlag = true;
			}
			mysql_select_db('db',$con);
			mysql_query("set character set 'utf8'"); 	
	}
	
	if($isConnectedFlag == false){
		connect();
	}
?>
