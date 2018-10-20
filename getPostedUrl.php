<?php
	//Este es un sencillo ejemplo de recibir un enlace por POST para hacerle un GET,
	//así usamos el PHP como proxy para hacer el GET, muy útil si la API no soporta CORS

	$post = file_get_contents('php://input'); //Recibimos por POST un enlace en JSON
	$enlace = json_decode($post, TRUE)['enlace']; //Sacamos el enlace del JSON como string de PHP
	echo file_get_contents($enlace);//Hacemos un get al enlace y devolvemos el contenido del get
?>
