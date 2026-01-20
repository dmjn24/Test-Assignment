<?php

namespace App\Model\Product;

use App\Model\Product;

class StandardProduct extends Product
{
    public function getAttributes(string $productId): array
    {
        $stmt = $this->db->prepare("SELECT item_id as id, name, type, id as db_id FROM attributes WHERE product_id = :pid");
        $stmt->execute([':pid' => $productId]);
        $attributes = $stmt->fetchAll();

        foreach ($attributes as &$attr) {
            $stmt = $this->db->prepare("SELECT item_id as id, display_value as displayValue, value FROM attribute_items WHERE attribute_id = :aid");
            $stmt->execute([':aid' => $attr['db_id']]);
            $attr['items'] = $stmt->fetchAll();
            unset($attr['db_id']);
        }

        return $attributes;
    }
}
