<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Schema;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Types;
use App\GraphQL\Resolvers\CategoryResolver;
use App\GraphQL\Resolvers\ProductResolver;
use App\GraphQL\Resolvers\OrderResolver;
use RuntimeException;
use Throwable;

class GraphQL
{
    static public function handle()
    {
        try {
            $queryType = self::getQueryType();
            $mutationType = self::getMutationType();

            $schema = new Schema([
                'query' => $queryType,
                'mutation' => $mutationType
            ]);

            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($schema, $query, null, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }

    private static function getQueryType()
    {
        return new ObjectType([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(Types::category()),
                    'resolve' => [new CategoryResolver(), 'resolveCategories']
                ],
                'product' => [
                    'type' => Types::product(),
                    'args' => [
                        'id' => ['type' => Type::string()]
                    ],
                    'resolve' => [new ProductResolver(), 'resolveProduct']
                ],
                'category' => [
                    'type' => Types::category(),
                    'args' => [
                        'id' => ['type' => Type::string()]
                    ],
                    'resolve' => [new CategoryResolver(), 'resolveCategory']
                ]
            ],
        ]);
    }

    private static function getMutationType()
    {
        return new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => Type::string(),
                    'args' => [
                        'items' => ['type' => Type::listOf(Types::orderInput())]
                    ],
                    'resolve' => [new OrderResolver(), 'resolveCreateOrder']
                ]
            ]
        ]);
    }
}