<?php
$host = getenv('HOST');
$port = getenv('PORT');
$dbname = getenv('DBNAME');
$user = getenv('USER');
$password = getenv('PASSWORD');

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Conexión exitosa";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>