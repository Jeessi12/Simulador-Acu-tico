<?php

session_start();
session_destroy();

header("Location: /Simulador-Acu-tico-main/views/index.php");
exit;
?>