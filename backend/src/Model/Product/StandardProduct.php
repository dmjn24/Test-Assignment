<?php

namespace App\Model\Product;

use App\Model\Product;

class StandardProduct extends Product
{
    public function getAttributes(string $productId): array
    {
        return [];
    }
}
