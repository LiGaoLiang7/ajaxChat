<?php 
	header("Content-Type:text/html; charset=utf-8");
	global $userName = $_REQUEST['username'];
	if($username != ""){
		echo $userName."正在输入中...";
	}
?>