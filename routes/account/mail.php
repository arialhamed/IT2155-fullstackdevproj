<?php
$data = json_decode(file_get_contents('php://input'), true);

$arifmail = "morphball420@gmail.com";
$subject = "ABC Supermarket Account Registration Code"
$headers = "From: $email \r\n";
$headers .= "To: $arifmail \r\n";
$headers .= "Cc: arifhamed2002@gmail.com \r\n";
mail($arifmail,$subject,$link,$headers);
?>
