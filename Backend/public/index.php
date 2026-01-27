<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

echo json_encode([
  "status" => "ok",
  "message" => "Backend PHP funcionando 🚀"
]);