<?php

namespace App\Service;

use App\Model\Order;
use App\Config\Database;
use Exception;

class OrderService
{
    public function createOrder(array $items): string
    {
        $db = Database::getConnection();
        $db->beginTransaction();

        try {
            $orderModel = new Order();
            $orderId = $orderModel->create();
            $orderModel->addItems($orderId, $items);

            $db->commit();
            return $orderId;
        } catch (Exception $e) {
            $db->rollBack();
            throw new Exception("Order creation failed: " . $e->getMessage());
        }
    }
}
