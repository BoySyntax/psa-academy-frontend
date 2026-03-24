<?php
// Database configuration for PSA Academy
// This file handles MySQL database connection

class Database {
    private $host = 'roundhouse.proxy.rlwy.net';
    private $port = '41855';
    private $db_name = 'railway';
    private $username = 'root';
    private $password = 'rPJiqGBGLnbGexGTZxMcIBWFcGuVScfP';
    private $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>
