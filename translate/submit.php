<?php

header('Location:/minecraft/tellraw?translated=true');

if (@$_GET['string'] != "") {
	$data = file_get_contents('/home/ezfe/web-assets/translation-submits.json');
	if ($data == "null") {
		$data = "[]";
	}
	$jobject = json_decode($data,true);
	$newobject = array('language' => @$_GET['lang'], 'string' => @$_GET['string'], 'translate' => @$_GET['translate'], 'ip' => $_SERVER['REMOTE_ADDR']);
	array_push($jobject,$newobject);
	$send = json_encode($jobject);
	file_put_contents('/home/ezfe/web-assets/translation-submits.json',$send);	
}

echo '<a href="/minecraft/tellraw?translated=true">Click here</a>';
?>