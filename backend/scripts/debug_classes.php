<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\GraphQL;

try {
    echo "Testing GraphQL Controller loading...\n";
    if (class_exists(GraphQL::class)) {
        echo "Class found.\n";
    } else {
        echo "Class NOT found.\n";
    }

    $_SERVER['REQUEST_METHOD'] = 'POST';
    $_SERVER['REQUEST_URI'] = '/graphql';

    echo "Dependencies check:\n";
    echo "Types class exists: " . (class_exists('App\GraphQL\Types') ? 'Yes' : 'No') . "\n";
    echo "Category class exists: " . (class_exists('App\Model\Category') ? 'Yes' : 'No') . "\n";

} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
