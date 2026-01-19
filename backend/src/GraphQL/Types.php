<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use App\GraphQL\Resolvers\CategoryResolver;
use App\GraphQL\Resolvers\ProductResolver;
use App\GraphQL\Resolvers\AttributeResolver;

class Types
{
    private static $category;
    private static $product;
    private static $attributeSet;
    private static $attribute;
    private static $price;
    private static $currency;
    private static $order;
    private static $orderInput;

    public static function string()
    {
        return Type::string();
    }
    public static function int()
    {
        return Type::int();
    }
    public static function float()
    {
        return Type::float();
    }
    public static function boolean()
    {
        return Type::boolean();
    }
    public static function id()
    {
        return Type::id();
    }

    public static function currency()
    {
        return self::$currency ?: (self::$currency = new ObjectType([
            'name' => 'Currency',
            'fields' => [
                'label' => Type::string(),
                'symbol' => Type::string(),
            ]
        ]));
    }

    public static function price()
    {
        return self::$price ?: (self::$price = new ObjectType([
            'name' => 'Price',
            'fields' => [
                'amount' => Type::float(),
                'currency' => self::currency(),
            ]
        ]));
    }

    public static function attribute()
    {
        return self::$attribute ?: (self::$attribute = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'displayValue' => Type::string(),
                'value' => Type::string(),
                'id' => Type::string(),
            ]
        ]));
    }

    public static function attributeSet()
    {
        return self::$attributeSet ?: (self::$attributeSet = new ObjectType([
            'name' => 'AttributeSet',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
                'type' => Type::string(),
                'items' => [
                    'type' => Type::listOf(self::attribute()),
                    'resolve' => [new AttributeResolver(), 'resolveItems']
                ]
            ]
        ]));
    }

    public static function product()
    {
        return self::$product ?: (self::$product = new ObjectType([
            'name' => 'Product',
            'fields' => function () {
                $resolver = new ProductResolver();
                return [
                    'id' => Type::string(),
                    'name' => Type::string(),
                    'inStock' => [
                        'type' => Type::boolean(),
                        'resolve' => [$resolver, 'resolveInStock']
                    ],
                    'gallery' => [
                        'type' => Type::listOf(Type::string()),
                        'resolve' => [$resolver, 'resolveGallery']
                    ],
                    'description' => Type::string(),
                    'category' => Type::string(),
                    'attributes' => [
                        'type' => Type::listOf(self::attributeSet()),
                        'resolve' => [$resolver, 'resolveAttributes']
                    ],
                    'prices' => [
                        'type' => Type::listOf(self::price()),
                        'resolve' => [$resolver, 'resolvePrices']
                    ],
                    'brand' => Type::string(),
                ];
            }
        ]));
    }

    public static function category()
    {
        return self::$category ?: (self::$category = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'id' => Type::string(),
                'name' => Type::string(),
                'products' => [
                    'type' => Type::listOf(self::product()),
                    'resolve' => [new CategoryResolver(), 'resolveProducts']
                ]
            ]
        ]));
    }

    public static function order()
    {
        return self::$order ?: (self::$order = new ObjectType([
            'name' => 'Order',
            'fields' => [
                'id' => Type::string(),
                'total' => Type::float(),
                'itemCount' => Type::int()
            ]
        ]));
    }

    public static function orderInput()
    {
        return self::$orderInput ?: (self::$orderInput = new InputObjectType([
            'name' => 'OrderInput',
            'fields' => [
                'productId' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int()),
                'options' => Type::string(),
            ]
        ]));
    }
}