<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: "GET, PUT, POST, DELETE,PATCH, HEAD, OPTIONS"');
require 'vendor/autoload.php';

$configuration = [
    'settings' => [
        'displayErrorDetails' => true
    ]
];

$c = new \Slim\Container($configuration);
$app = new \Slim\App($c);

$container = $app->getContainer();
$container['pdo'] = function ($c) {
    $dsn = 'mysql:host=127.0.0.1;dbname=roadmap;charset=utf8'; // replace Localhost with your mysql host ip and replace dbName with your database name
    $usr = 'roadmap_api_access'; //replace dbUSERNAME with your database username
    $pwd = 'password'; //replace dbUSERNAME with your database password
    $pdo = new \Slim\PDO\Database($dsn, $usr, $pwd);
    return $pdo;
};

//$app = new Slim\App();

$routeFiles = (array) glob('routes/*.php');
foreach($routeFiles as $routeFile) {
    require_once $routeFile;
}

$app->run();

?>

