<?php
	
	include($_SERVER["DOCUMENT_ROOT"]."/libs/misclases/master.class.php");
    include($_SERVER["DOCUMENT_ROOT"]."/libs/misclases/auth.class.php");    
	
	define("PATH","/Apps/lean/limpieza/tablet/");	
    
	@session_start();
	
    //Auth::Validar();

	$master=new Master("Ordenes de Mantenimiento");
	$master->setFont("<link href='https://fonts.googleapis.com/css?family=Shrikhand' rel='stylesheet'>");
	$master->setMyCSS(
		array(
			"public/css/style.css"
		)
	);
	$master->setBootstrap();
	$master->setJquery();
	$master->setMyJS(
		array(
			"public/js/libs/vue.js",
			"public/js/libs/moment.min.js",
			"public/js/libs/js.cookie.js",
			"public/js/components/alert.js",
			"public/js/components/table.js"
		)
	);	
	$master->setLoader();
	$master->setInclude(PATH."menu.php");
	$master->render();

?>