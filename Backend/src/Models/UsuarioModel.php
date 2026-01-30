<?php
namespace App\Models;

use App\Config\Database;
use PDO;


class UsuarioModel {
    
    private PDO $db;
    
    public function __construct() {
        error_log("UsuarioModel: Intentando conectar a la base de datos...");
        try {
            $this->db = Database::connect();
            error_log("UsuarioModel: Conexión exitosa");
        } catch (\Exception $e) {
            error_log("❌ UsuarioModel: Error al conectar: " . $e->getMessage());
            throw $e;
        }
    }
    
    // Crear usuario
    public function create(array $data): ?int {
        try {
            error_log("UsuarioModel::create - Iniciando creación de usuario");
            error_log("Datos a insertar: " . json_encode($data));
            
            $sql = "INSERT INTO usuario (nombre, apellido, correo, contrasena, telefono, id_rol, activo,fecha_creacion) 
                    VALUES (:nombre, :apellido, :correo, :contrasena, :telefono, :id_rol, :activo, CURRENT_TIMESTAMP) 
                    RETURNING id_usuario";
            
            error_log("SQL: $sql");
            
            $stmt = $this->db->prepare($sql);
            
            $params = [
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'correo' => $data['correo'],
                'contrasena' => $data['contrasena'],
                'telefono' => $data['telefono'],
                'id_rol' => $data['id_rol'],
                'activo' => $data['activo'] ?? true
            ];
            
            error_log("Parámetros: " . json_encode($params));
            
            $stmt->execute($params);
            
            error_log("INSERT ejecutado, obteniendo ID...");
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            error_log("Resultado: " . json_encode($result));
            
            $userId = $result['id_usuario'] ?? null;
            
            error_log("Usuario creado con ID: $userId");
            
            return $userId;
            
        } catch (\PDOException $e) {
            error_log("❌ PDOException en create: " . $e->getMessage());
            error_log("Código de error: " . $e->getCode());
            error_log("SQL State: " . $e->errorInfo[0] ?? 'N/A');
            throw new \Exception("Error al crear usuario: " . $e->getMessage());
        }
    }
    
    // Obtener por ID
    public function getById(int $id): ?array {
        try {
            $stmt = $this->db->prepare("
                SELECT u.*, r.nombre as rol_nombre 
                FROM usuario u
                LEFT JOIN rol r ON u.id_rol = r.id_rol
                WHERE u.id_usuario = :id
            ");
            $stmt->execute(['id' => $id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result ?: null;
            
        } catch (\PDOException $e) {
            throw new \Exception("Error al obtener usuario: " . $e->getMessage());
        }
    }
    
    // Obtener por email
    public function getByEmail(string $email): ?array {
        try {
            $stmt = $this->db->prepare("
                SELECT u.*, r.nombre as rol_nombre 
                FROM usuario u
                LEFT JOIN rol r ON u.id_rol = r.id_rol
                WHERE u.correo = :email
            ");
            $stmt->execute(['email' => $email]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result ?: null;
            
        } catch (\PDOException $e) {
            throw new \Exception("Error al obtener usuario: " . $e->getMessage());
        }
    }
    
    // Verificar si existe por email
    public function existsByEmail(string $email): bool {
        try {
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM usuario WHERE correo = :email");
            $stmt->execute(['email' => $email]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $result['count'] > 0;
            
        } catch (\PDOException $e) {
            throw new \Exception("Error al verificar email: " . $e->getMessage());
        }
    }
    
    // Actualizar último acceso
    public function updateLastAccess(int $id): bool {
        try {
            $stmt = $this->db->prepare("UPDATE usuario SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = :id");
            return $stmt->execute(['id' => $id]);
            
        } catch (\PDOException $e) {
            throw new \Exception("Error al actualizar último acceso: " . $e->getMessage());
        }
    }
}