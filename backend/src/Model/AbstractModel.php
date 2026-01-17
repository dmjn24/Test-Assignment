<?php

namespace App\Model;

use App\Config\Database;
use PDO;

abstract class AbstractModel
{
    protected PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }
}
