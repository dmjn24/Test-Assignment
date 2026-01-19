<?php

namespace App\Model\Attribute;

use App\Model\Attribute;

class TextAttribute extends Attribute
{
    public function getItems(int $attributeId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM attribute_items WHERE attribute_id = :aid");
        $stmt->execute([':aid' => $attributeId]);
        return $stmt->fetchAll();
    }
}
