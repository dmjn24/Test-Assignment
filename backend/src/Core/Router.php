<?php

namespace App\Core;

use FastRoute;
use FastRoute\Dispatcher;
use App\Controller\GraphQL;

class Router
{
    public static function dispatch()
    {
        $dispatcher = FastRoute\simpleDispatcher(function (FastRoute\RouteCollector $r) {
            $r->post('/graphql', [GraphQL::class, 'handle']);
        });

        $uri = self::getUri();
        $method = $_SERVER['REQUEST_METHOD'];

        $routeInfo = $dispatcher->dispatch($method, $uri);

        self::handleRoute($routeInfo);
    }

    private static function getUri()
    {
        $uri = $_SERVER['REQUEST_URI'];
        if (false !== $pos = strpos($uri, '?')) {
            $uri = substr($uri, 0, $pos);
        }
        return rawurldecode($uri);
    }

    private static function handleRoute($routeInfo)
    {
        switch ($routeInfo[0]) {
            case Dispatcher::NOT_FOUND:
                self::sendNotFound();
                break;
            case Dispatcher::METHOD_NOT_ALLOWED:
                self::sendMethodNotAllowed();
                break;
            case Dispatcher::FOUND:
                $handler = $routeInfo[1];
                $vars = $routeInfo[2];
                call_user_func($handler, $vars);
                break;
        }
    }

    private static function sendNotFound()
    {
        header("HTTP/1.0 404 Not Found");
        echo "404 Not Found";
    }

    private static function sendMethodNotAllowed()
    {
        header("HTTP/1.0 405 Method Not Allowed");
        echo "405 Method Not Allowed";
    }
}
