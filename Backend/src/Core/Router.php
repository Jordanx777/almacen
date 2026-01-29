<?php

namespace App\Core;

class Router
{
    // 1️⃣ Array donde se guardan todas las rutas
    private array $routes = [];

    // 2️⃣ Método para registrar rutas GET
    public function get(string $path, callable|array $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    // 2️⃣ Método para registrar rutas POST
    public function post(string $path, callable|array $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    // 2️⃣ Método para registrar rutas PUT
    public function put(string $path, callable|array $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    // 2️⃣ Método para registrar rutas DELETE
    public function delete(string $path, callable|array $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    private function addRoute(string $method, string $path, callable|array $handler): void
    {
        // Convierte /api/productos/{id} en una expresión regular
        // Resultado: /api/productos/(?P<id>[^/]+)
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';

        $this->routes[] = [
            'method' => $method,    // GET, POST, PUT, DELETE
            'pattern' => $pattern,  // Expresión regular
            'handler' => $handler,  // Controlador o función
        ];
    }
    // 5️⃣ Método que ejecuta la ruta correcta
    public function run(): void
    {
        // Obtiene el método HTTP (GET, POST, etc.)
        $method = $_SERVER['REQUEST_METHOD'];
        // Obtiene la URL solicitada (ej: /api/productos/5)
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // 🔍 DEBUG: Ver qué está llegando
        error_log("=== DEBUG ROUTER ===");
        error_log("Método: $method");
        error_log("URI: $uri");
        error_log("Rutas registradas: " . count($this->routes));

        foreach ($this->routes as $route) {
            // Verifica si el método y la URL coinciden
            if ($route['method'] === $method && preg_match($route['pattern'], $uri, $matches)) {
                // Extrae los parámetros de la URL (ej: id => 5)
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                // 7️⃣ Si el handler es un array [Controller, 'metodo']
                if (is_array($route['handler'])) {
                    [$controller, $method] = $route['handler'];
                    $controllerInstance = new $controller();
                    call_user_func_array([$controllerInstance, $method], [$params]);
                } else {
                    // Si es una función anónima
                    call_user_func($route['handler'], $params);
                }
                return;
            }
        }
        error_log("❌ Ruta NO encontrada");
        // 8️⃣ Si no encuentra ninguna ruta, retorna 404
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Ruta no encontrada']);
    }
}
