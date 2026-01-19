<?php

namespace App\Model;

class Order extends AbstractModel
{
    public function create(): string
    {
        $stmt = $this->db->prepare("INSERT INTO orders () VALUES ()");
        $stmt->execute();
        return $this->db->lastInsertId();
    }

    public function addItems(string $orderId, array $items): void
    {
        $stmt = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity, options) VALUES (?, ?, ?, ?)");

        foreach ($items as $item) {
            $stmt->execute([
                $orderId,
                $item['productId'],
                $item['quantity'],
                $item['options'] ?? '{}'
            ]);
        }
    }
}
