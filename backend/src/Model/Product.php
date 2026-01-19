<?php

namespace App\Model;

abstract class Product extends AbstractModel
{
    abstract public function getAttributes(string $productId): array;

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM products");
        return $stmt->fetchAll();
    }

    public function getById(string $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    public function getByCategory(string $category): array
    {
        if ($category === 'all') {
            return $this->getAll();
        }
        $stmt = $this->db->prepare("SELECT * FROM products WHERE category_id = :cat");
        $stmt->execute([':cat' => $category]);
        return $stmt->fetchAll();
    }

    public function getGallery(string $productId): array
    {
        $stmt = $this->db->prepare("SELECT image_url FROM galleries WHERE product_id = :pid");
        $stmt->execute([':pid' => $productId]);
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }

    public function getPrices(string $productId): array
    {
        $stmt = $this->db->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = :pid");
        $stmt->execute([':pid' => $productId]);
        return $stmt->fetchAll();
    }
}
