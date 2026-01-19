<?php

namespace App\Model;

abstract class Attribute extends AbstractModel
{
    abstract public function getItems(int $attributeId): array;

    public function getByProduct(string $productId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM attributes WHERE product_id = :pid");
        $stmt->execute([':pid' => $productId]);
        return $stmt->fetchAll();
    }
}
