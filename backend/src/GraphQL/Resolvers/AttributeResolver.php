<?php

namespace App\GraphQL\Resolvers;

use App\Model\Attribute\TextAttribute;
use App\Model\Attribute\SwatchAttribute;

class AttributeResolver
{
    public function resolveItems($root)
    {
        if (isset($root['items'])) {
            return $root['items'];
        }

        if ($root['type'] === 'text') {
            $model = new TextAttribute();
        } else {
            $model = new SwatchAttribute();
        }

        return [];
    }
}
