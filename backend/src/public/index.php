<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Origin");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\Router;

try {
    Router::dispatch();
} catch (Throwable $e) {
    header("HTTP/1.0 500 Internal Server Error");
    echo json_encode(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
}
