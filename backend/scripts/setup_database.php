<?php

namespace App\Scripts;

require_once __DIR__ . '/../vendor/autoload.php';

use PDO;
use PDOException;

class DatabaseSetup
{
    private ?PDO $pdo = null;
    private string $host = 'sql103.infinityfree.com';
    private string $user = 'if0_40949008';
    private string $pass = '7E1Maj7jTbHjw0';
    private string $dbname = 'if0_40949008_scandiweb';

    public function __construct()
    {
        $this->connect();
    }

    private function connect(): void
    {
        try {
            $this->pdo = new PDO("mysql:host={$this->host}", $this->user, $this->pass);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }

    public function run(): void
    {
        try {
            $this->createDatabase();
            $this->createTables();
            $this->seedData();
            echo "Setup completed successfully.<br>";
        } catch (PDOException $e) {
            echo "Error during setup: " . $e->getMessage() . "<br>";
        }
    }

    private function createDatabase(): void
    {
        $this->pdo->exec("USE `{$this->dbname}`");
        echo "Database '{$this->dbname}' selected.<br>";
    }

    private function createTables(): void
    {
        $commands = [
            "CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )",
            "CREATE TABLE IF NOT EXISTS products (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                in_stock BOOLEAN NOT NULL,
                description TEXT,
                category_id VARCHAR(255),
                brand VARCHAR(255),
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )",
            "CREATE TABLE IF NOT EXISTS galleries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id VARCHAR(255),
                image_url TEXT,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )",
            "CREATE TABLE IF NOT EXISTS attributes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id VARCHAR(255),
                name VARCHAR(255),
                type VARCHAR(50),
                item_id VARCHAR(255),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )",
            "CREATE TABLE IF NOT EXISTS attribute_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                attribute_id INT,
                display_value VARCHAR(255),
                value VARCHAR(255),
                item_id VARCHAR(255),
                FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
            )",
            "CREATE TABLE IF NOT EXISTS prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id VARCHAR(255),
                amount DECIMAL(10, 2),
                currency_label VARCHAR(10),
                currency_symbol VARCHAR(5),
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )",
            "CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )",
            "CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT,
                product_id VARCHAR(255),
                quantity INT,
                options TEXT,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id)
            )"
        ];

        foreach ($commands as $sql) {
            $this->pdo->exec($sql);
        }
        echo "Tables created.<br>";

    }

    private function seedData(): void
    {
        $jsonPath = __DIR__ . '/../data.json';
        if (!file_exists($jsonPath)) {
            die("data.json not found at $jsonPath<br>");
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        if (!$data) {
            die("Failed to decode data.json<br>");
        }

        $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        $this->pdo->exec("TRUNCATE TABLE order_items");
        $this->pdo->exec("TRUNCATE TABLE orders");
        $this->pdo->exec("TRUNCATE TABLE prices");
        $this->pdo->exec("TRUNCATE TABLE attribute_items");
        $this->pdo->exec("TRUNCATE TABLE attributes");
        $this->pdo->exec("TRUNCATE TABLE galleries");
        $this->pdo->exec("TRUNCATE TABLE products");
        $this->pdo->exec("TRUNCATE TABLE categories");
        $this->pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

        $stmtCat = $this->pdo->prepare("INSERT INTO categories (id, name) VALUES (:id, :name)");
        foreach ($data['data']['categories'] as $cat) {
            $stmtCat->execute([':id' => $cat['name'], ':name' => $cat['name']]);
        }
        echo "Categories inserted.<br>";

        $stmtProd = $this->pdo->prepare("INSERT INTO products (id, name, in_stock, description, category_id, brand) VALUES (:id, :name, :in_stock, :description, :category_id, :brand)");
        $stmtGallery = $this->pdo->prepare("INSERT INTO galleries (product_id, image_url) VALUES (:product_id, :image_url)");
        $stmtAttr = $this->pdo->prepare("INSERT INTO attributes (product_id, name, type, item_id) VALUES (:product_id, :name, :type, :item_id)");
        $stmtAttrItem = $this->pdo->prepare("INSERT INTO attribute_items (attribute_id, display_value, value, item_id) VALUES (:attribute_id, :display_value, :value, :item_id)");
        $stmtPrice = $this->pdo->prepare("INSERT INTO prices (product_id, amount, currency_label, currency_symbol) VALUES (:product_id, :amount, :currency_label, :currency_symbol)");

        foreach ($data['data']['products'] as $prod) {
            $stmtProd->execute([
                ':id' => $prod['id'],
                ':name' => $prod['name'],
                ':in_stock' => $prod['inStock'] ? 1 : 0,
                ':description' => $prod['description'],
                ':category_id' => $prod['category'],
                ':brand' => $prod['brand']
            ]);

            foreach ($prod['gallery'] as $img) {
                $stmtGallery->execute([':product_id' => $prod['id'], ':image_url' => $img]);
            }

            foreach ($prod['attributes'] as $attr) {
                $stmtAttr->execute([
                    ':product_id' => $prod['id'],
                    ':name' => $attr['name'],
                    ':type' => $attr['type'],
                    ':item_id' => $attr['id']
                ]);
                $attrId = $this->pdo->lastInsertId();

                foreach ($attr['items'] as $item) {
                    $stmtAttrItem->execute([
                        ':attribute_id' => $attrId,
                        ':display_value' => $item['displayValue'],
                        ':value' => $item['value'],
                        ':item_id' => $item['id']
                    ]);
                }
            }

            foreach ($prod['prices'] as $price) {
                $stmtPrice->execute([
                    ':product_id' => $prod['id'],
                    ':amount' => $price['amount'],
                    ':currency_label' => $price['currency']['label'],
                    ':currency_symbol' => $price['currency']['symbol']
                ]);
            }
        }
        echo "Products seed data inserted.<br>";
    }
}

// Instantiate and run the setup
(new DatabaseSetup())->run();
