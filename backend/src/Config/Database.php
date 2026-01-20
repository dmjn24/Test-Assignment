<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            self::connect();
        }
        return self::$instance;
    }

    private static function connect(): void
    {
        try {
            $host = 'sql103.infinityfree.com';
            $name = 'if0_40949008_scandiweb';
            $user = 'if0_40949008';
            $pass = '7E1Maj7jTbHjw0';

            self::$instance = new PDO("mysql:host=$host;dbname=$name;charset=utf8", $user, $pass);
            self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die("Database Connection Failed: " . $e->getMessage() . " (" . $e->getCode() . ")");
        }
    }
}
