<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder preflight CORS inmediatamente
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../app/models/Conexion.php';
require_once __DIR__ . '/../app/support/SpeciesModelResolver.php';

class EspeciesAPI {
    private $conn;
    private SpeciesModelResolver $modelResolver;

    public function __construct() {
        $database = new Conexion();
        $this->conn = $database->getSpeciesConnection();
        $this->modelResolver = new SpeciesModelResolver(
            __DIR__ . '/../public/media/3D_Models',
            '../public/media/3D_Models'
        );
    }

    public function getAllSpecies() {
        $query = "SELECT * FROM especies ORDER BY id";
        $result = $this->conn->query($query);

        if (!$result) {
            return ['error' => 'Error en la consulta: ' . $this->conn->error];
        }

        $species = [];
        while ($row = $result->fetch_assoc()) {
            $species[] = $this->formatSpeciesData($row);
        }

        return $species;
    }

    public function getSpeciesById($id) {
        // Prepared statement para evitar SQL injection
        $stmt = $this->conn->prepare("SELECT * FROM especies WHERE id = ?");
        if (!$stmt) {
            return null;
        }
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return null;
        }

        $row = $result->fetch_assoc();
        $stmt->close();
        return $this->formatSpeciesData($row);
    }

    private function formatSpeciesData($row) {
        $model = $this->modelResolver->resolve(
            $row['nombre'],
            $row['nombre_cientifico'],
            $row['categoria'],
            $row['model_path'] ?? null
        );

        return [
            'id'              => (int)$row['id'],
            'name'            => $row['nombre'],
            'scientificName'  => $row['nombre_cientifico'],
            'category'        => $row['categoria'],
            'habitat'         => $row['habitat'],
            'desc'            => $row['descripcion'],
            'dieta'           => $row['dieta'],
            'longevidad'      => $row['longevidad'],
            'peligro'         => $row['peligro'],
            'tamaño'          => $row['tamanio'],
            'peso'            => $row['peso'],
            'reproduccion'    => $row['reproduccion'],
            'huevos'          => $row['huevos'],
            'depredadores'    => $row['depredadores'],
            'temperatura'     => $row['temperatura'],
            'salinidad'       => $row['salinidad'],
            'zona_luz'        => $row['zona_luz'],
            'profundidad_min' => (int)$row['profundidad_min'],   // corregido: cast a int
            'profundidad_max' => (int)$row['profundidad_max'],   // corregido: cast a int
            'zona_geografica' => $row['zona_geografica'],
            'map_x'           => (int)$row['map_x'],
            'map_y'           => (int)$row['map_y'],
            'modelPath'       => $model['path'],
            'modelView'       => $model['view'],
            'modelSource'     => $model['source'],
            'scale'           => (float)$row['scale_3d'],
            'posY'            => (float)$row['pos_y'],
            'rotY'            => (float)$row['rot_y'],
            'camDistance'     => (float)$row['cam_distance'],
            'camHeight'       => (float)$row['cam_height'],
            'curiosidades'    => $this->getCuriosidades((int)$row['id']),
            'amenazas'        => $this->getAmenazas((int)$row['id'])
        ];
    }

    private function getCuriosidades($especieId) {
        $stmt = $this->conn->prepare(
            "SELECT icono, titulo, texto FROM curiosidades WHERE especie_id = ? ORDER BY orden"
        );
        if (!$stmt) return [];

        $stmt->bind_param("i", $especieId);
        $stmt->execute();
        $result = $stmt->get_result();

        $curiosidades = [];
        while ($row = $result->fetch_assoc()) {
            $curiosidades[] = [
                'icon'  => $row['icono'],
                'title' => $row['titulo'],
                'text'  => $row['texto']
            ];
        }
        $stmt->close();
        return $curiosidades;
    }

    private function getAmenazas($especieId) {
        $stmt = $this->conn->prepare(
            "SELECT label, nivel FROM amenazas WHERE especie_id = ? ORDER BY orden"
        );
        if (!$stmt) return [];

        $stmt->bind_param("i", $especieId);
        $stmt->execute();
        $result = $stmt->get_result();

        $amenazas = [];
        while ($row = $result->fetch_assoc()) {
            $amenazas[] = [
                'label' => $row['label'],
                'level' => $row['nivel']
            ];
        }
        $stmt->close();
        return $amenazas;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            if (isset($_GET['id'])) {
                $id      = (int)$_GET['id'];
                $species = $this->getSpeciesById($id);

                if ($species === null) {
                    http_response_code(404);
                    echo json_encode(
                        ['error' => 'Especie no encontrada'],
                        JSON_UNESCAPED_UNICODE
                    );
                    return;
                }

                echo json_encode($species, JSON_UNESCAPED_UNICODE);
            } else {
                $species = $this->getAllSpecies();
                echo json_encode($species, JSON_UNESCAPED_UNICODE);
            }
        } else {
            http_response_code(405);
            echo json_encode(
                ['error' => 'Método no permitido'],
                JSON_UNESCAPED_UNICODE
            );
        }
    }
}

$api = new EspeciesAPI();
$api->handleRequest();
