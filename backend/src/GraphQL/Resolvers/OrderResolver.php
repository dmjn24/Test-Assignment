<?php

namespace App\GraphQL\Resolvers;

use App\Service\OrderService;

class OrderResolver
{
    public function resolveCreateOrder($root, array $args)
    {
        $service = new OrderService();
        $orderId = $service->createOrder($args['items']);
        return "Order #$orderId created successfully";
    }
}
