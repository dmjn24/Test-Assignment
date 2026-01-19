<?php

namespace App\GraphQL\Resolvers;

use App\Model\Category;
use App\Model\Product\StandardProduct;

class CategoryResolver
{
    public function resolveCategories()
    {
        $model = new Category();
        return $model->getAll();
    }

    public function resolveCategory($root, array $args)
    {
        $model = new Category();
        $id = $args['id'] ?? 'all';
        return $model->getById($id);
    }

    public function resolveProducts($root)
    {
        $model = new StandardProduct();
        return $model->getByCategory($root['id']);
    }
}
