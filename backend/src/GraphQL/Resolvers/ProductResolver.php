<?php

namespace App\GraphQL\Resolvers;

use App\Model\Product\StandardProduct;
use App\Model\Attribute\TextAttribute;

class ProductResolver
{
    public function resolveProduct($root, array $args)
    {
        $model = new StandardProduct();
        return $model->getById($args['id']);
    }

    public function resolveInStock($product)
    {
        return (bool) $product['in_stock'];
    }

    public function resolveGallery($product)
    {
        $model = new StandardProduct();
        return $model->getGallery($product['id']);
    }

    public function resolveAttributes($product)
    {

        $model = new TextAttribute();
        return $model->getByProduct($product['id']);
    }

    public function resolvePrices($product)
    {
        $model = new StandardProduct();
        $prices = $model->getPrices($product['id']);

        return array_map(function ($p) {
            return [
                'amount' => (float) $p['amount'],
                'currency' => [
                    'label' => $p['currency_label'],
                    'symbol' => $p['currency_symbol']
                ]
            ];
        }, $prices);
    }
}
