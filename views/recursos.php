<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recursos | BlueEcoSim</title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/recursos.css">
</head>
<body class="recursos-page">
    <div id="navbar-container">
        <?php include(__DIR__ . "/fragments/navbar.php"); ?>
    </div>

    <canvas id="particles"></canvas>

    <main class="resources-shell">
        
        <!-- ═══════════ HERO ═══════════ -->
        <section class="resources-hero">
            <canvas id="particlesHero"></canvas>
            <div class="hero-overlay">
                <span class="hero-badge">
                    <i class="fa-solid fa-water"></i> Centro de investigación marina
                </span>
                <h1>Los Cóbanos</h1>
                <p class="hero-subtitle">
                    Explora la historia, biodiversidad y conservación de uno de los 
                    arrecifes más importantes del Pacífico centroamericano
                </p>
            </div>
            <div class="hero-scroll-indicator">
                <span></span>
            </div>
        </section>

        <!-- ═══════════ LÍNEA DEL TIEMPO ═══════════ -->
        <section class="content-section" id="timeline">
            <div class="section-header-center">
                <h2>Línea del Tiempo</h2>
                <div class="section-line"></div>
                <p>Descubre los acontecimientos más importantes en la historia de conservación de Los Cóbanos</p>
            </div>

            <div class="timeline-fluid">
                <div class="timeline-node active" data-year="2008" data-title="Reconocimiento ambiental" data-description="Los Cóbanos empieza a consolidarse como un punto clave para la educación marina, el turismo local y la protección del arrecife rocoso coralino.">
                    <div class="timeline-node-content">
                        <div class="timeline-node-icon"><i class="fa-solid fa-seedling"></i></div>
                        <div class="timeline-dot"></div>
                        <span class="timeline-year">2008</span>
                        <span class="timeline-label">Protección del arrecife</span>
                    </div>
                </div>
                <div class="timeline-node" data-year="2009" data-title="Área Natural Protegida" data-description="Se fortalece la gestión del área marina costera y se promueve la conservación de playas, arrecifes y especies asociadas.">
                    <div class="timeline-node-content">
                        <div class="timeline-node-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                        <div class="timeline-dot"></div>
                        <span class="timeline-year">2009</span>
                        <span class="timeline-label">Gestión territorial</span>
                    </div>
                </div>
                <div class="timeline-node" data-year="2013" data-title="Monitoreo de biodiversidad" data-description="Investigadores y comunidades impulsan registros de peces, invertebrados, tortugas y ecosistemas marinos.">
                    <div class="timeline-node-content">
                        <div class="timeline-node-icon"><i class="fa-solid fa-fish-fins"></i></div>
                        <div class="timeline-dot"></div>
                        <span class="timeline-year">2013</span>
                        <span class="timeline-label">Inventarios biológicos</span>
                    </div>
                </div>
                <div class="timeline-node" data-year="2018" data-title="Turismo responsable" data-description="Se amplían las acciones de sensibilización para visitantes, pescadores y guías, destacando prácticas de bajo impacto.">
                    <div class="timeline-node-content">
                        <div class="timeline-node-icon"><i class="fa-solid fa-umbrella-beach"></i></div>
                        <div class="timeline-dot"></div>
                        <span class="timeline-year">2018</span>
                        <span class="timeline-label">Educación costera</span>
                    </div>
                </div>
                <div class="timeline-node" data-year="Actualidad" data-title="Conservación participativa" data-description="Los Cóbanos se mantiene como laboratorio natural para aprender sobre arrecifes, tortugas marinas y áreas protegidas.">
                    <div class="timeline-node-content">
                        <div class="timeline-node-icon"><i class="fa-solid fa-hands-holding-circle"></i></div>
                        <div class="timeline-dot"></div>
                        <span class="timeline-year">Actualidad</span>
                        <span class="timeline-label">Investigación</span>
                    </div>
                </div>
            </div>

            <div class="timeline-detail-float" id="timelineDetail">
                <span class="detail-year-badge">2008</span>
                <h3>Reconocimiento ambiental</h3>
                <p>Los Cóbanos empieza a consolidarse como un punto clave para la educación marina, el turismo local y la protección del arrecife rocoso coralino.</p>
            </div>
        </section>

        <!-- ═══════════ GRÁFICAS DE ESPECIES ═══════════ -->
        <section class="content-section" id="species">
            <div class="section-header-left">
                <h2>Biodiversidad marina</h2>
                <p>Datos actualizados sobre las especies registradas en el ecosistema de Los Cóbanos</p>
            </div>

            <div class="species-charts">
                <article class="species-chart-card">
                    <div class="chart-icon-circle fish">
                        <i class="fa-solid fa-fish"></i>
                    </div>
                    <div class="chart-total">112</div>
                    <div class="chart-label">Especies de peces</div>
                    <div class="chart-bars">
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                    </div>
                </article>
                <article class="species-chart-card">
                    <div class="chart-icon-circle invertebrates">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="chart-total">31</div>
                    <div class="chart-label">Invertebrados marinos</div>
                    <div class="chart-bars">
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                    </div>
                </article>
                <article class="species-chart-card">
                    <div class="chart-icon-circle turtles">
                        <i class="fa-solid fa-turtle"></i>
                    </div>
                    <div class="chart-total">4</div>
                    <div class="chart-label">Tortugas marinas</div>
                    <div class="chart-bars">
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                    </div>
                </article>
                <article class="species-chart-card">
                    <div class="chart-icon-circle crustaceans">
                        <i class="fa-solid fa-shrimp"></i>
                    </div>
                    <div class="chart-total">28</div>
                    <div class="chart-label">Crustáceos costeros</div>
                    <div class="chart-bars">
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                        <div class="chart-bar"></div><div class="chart-bar"></div><div class="chart-bar"></div>
                    </div>
                </article>
            </div>
        </section>

        <!-- ═══════════ MAPA INTERACTIVO ═══════════ -->
        <section class="content-section" id="map">
            <div class="section-header-center">
                <h2>Mapa interactivo</h2>
                <div class="section-line"></div>
                <p>Activa las capas para explorar la geografía marina de Los Cóbanos</p>
            </div>

            <div class="map-panel-wrapper">
                <div class="map-sidebar-vertical" id="mapPills" role="group" aria-label="Capas del mapa">
                    <button class="map-pill active" type="button" data-layer="location">
                        <i class="fa-solid fa-location-dot"></i> Ubicación
                    </button>
                    <button class="map-pill active" type="button" data-layer="reef">
                        <i class="fa-solid fa-water"></i> Arrecifes
                    </button>
                    <button class="map-pill active" type="button" data-layer="ecosystem">
                        <i class="fa-solid fa-leaf"></i> Ecosistemas
                    </button>
                    <button class="map-pill active" type="button" data-layer="turtles">
                        <i class="fa-solid fa-fish-fins"></i> Tortugas
                    </button>
                    <button class="map-pill active" type="button" data-layer="protected">
                        <i class="fa-solid fa-shield-halved"></i> Protegidas
                    </button>
                </div>

                <div class="illustrated-map" aria-label="Mapa ilustrado de Los Cóbanos">
                    <svg viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#ceeef8"/>
                                <stop offset="100%" stop-color="#9dd8ef"/>
                            </linearGradient>
                            <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#d4edbc"/>
                                <stop offset="100%" stop-color="#b8dda0"/>
                            </linearGradient>
                            <linearGradient id="beachGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#eedca8"/>
                                <stop offset="100%" stop-color="#e0cc8a"/>
                            </linearGradient>
                        </defs>

                        <rect width="800" height="360" fill="url(#seaGrad)"/>
                        <rect x="0" y="240" width="800" height="120" fill="#8ecde7" opacity="0.25"/>
                        <rect x="0" y="310" width="800" height="50" fill="#7abfde" opacity="0.25"/>

                        <path d="M0 200 Q200 192 400 200 Q600 208 800 200" stroke="#b2dff0" stroke-width="1" fill="none" opacity="0.6"/>
                        <path d="M0 230 Q200 222 400 232 Q600 240 800 230" stroke="#b2dff0" stroke-width="1" fill="none" opacity="0.45"/>
                        <path d="M0 260 Q200 252 400 262 Q600 270 800 260" stroke="#b2dff0" stroke-width="0.8" fill="none" opacity="0.3"/>

                        <path d="M0 0 L800 0 L800 72 C740 68 700 70 650 78 C600 86 560 90 500 92 C440 94 380 90 320 94 C260 98 210 106 160 114 C110 122 60 134 0 154 Z" fill="url(#landGrad)"/>
                        <path d="M0 0 L800 0 L800 50 C740 46 690 48 640 55 C590 62 540 64 490 67 C430 70 370 67 310 71 C250 75 200 82 150 90 C100 98 50 110 0 128 Z" fill="#a8d08a" opacity="0.5"/>

                        <path d="M0 154 C60 134 110 122 160 114 C210 106 260 98 320 94 C380 90 440 94 500 92 C560 90 600 86 650 78 C700 70 740 68 800 72 L800 96 C740 92 700 95 650 103 C600 111 560 115 500 117 C440 119 380 115 320 119 C260 123 210 131 160 139 C110 147 60 159 0 179 Z" fill="url(#beachGrad)"/>
                        <path d="M0 154 C60 134 110 122 160 114 C210 106 260 98 320 94 C380 90 440 94 500 92 C560 90 600 86 650 78 C700 70 740 68 800 72" stroke="#c8b870" stroke-width="1.5" fill="none" opacity="0.5"/>

                        <circle cx="660" cy="62" r="4" fill="#8a7040" opacity="0.6"/>
                        <text x="670" y="66" font-size="9" fill="#6a5030" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.75">Sonsonate</text>

                        <ellipse cx="298" cy="162" rx="10" ry="4.5" fill="#c0de98" opacity="0.85"/>

                        <g class="map-svg-layer" id="svg-lyr-protected">
                            <ellipse cx="298" cy="200" rx="105" ry="68" fill="#56a86a" fill-opacity="0.1" stroke="#56a86a" stroke-width="2" stroke-dasharray="6 4"/>
                            <text x="298" y="144" text-anchor="middle" font-size="8.5" fill="#2e7a46" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.8">Área protegida</text>
                        </g>

                        <g class="map-svg-layer" id="svg-lyr-reef">
                            <rect x="238" y="218" width="78" height="15" rx="7" fill="#e07e6a" fill-opacity="0.7"/>
                            <rect x="335" y="228" width="55" height="12" rx="6" fill="#e07e6a" fill-opacity="0.55"/>
                            <rect x="188" y="234" width="40" height="10" rx="5" fill="#e07e6a" fill-opacity="0.45"/>
                            <text x="280" y="248" text-anchor="middle" font-size="8.5" fill="#a04030" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.85">Zona arrecifal</text>
                        </g>

                        <g class="map-svg-layer" id="svg-lyr-ecosystem">
                            <ellipse cx="178" cy="272" rx="88" ry="44" fill="#3aac97" fill-opacity="0.1" stroke="#3aac97" stroke-width="1.6" stroke-dasharray="5 3"/>
                            <text x="178" y="328" text-anchor="middle" font-size="8.5" fill="#1e7a66" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.8">Ecosistema marino</text>
                        </g>

                        <g class="map-svg-layer" id="svg-lyr-turtles">
                            <path d="M520 342 Q440 282 358 252 Q300 230 270 200" stroke="#5b8fd4" stroke-width="2.2" fill="none" stroke-dasharray="8 5" stroke-linecap="round"/>
                            <polygon points="262,196 279,208 271,215" fill="#5b8fd4" opacity="0.8"/>
                            <circle cx="388" cy="264" r="4.5" fill="#fff" stroke="#5b8fd4" stroke-width="1.5"/>
                            <circle cx="458" cy="308" r="3.5" fill="#fff" stroke="#5b8fd4" stroke-width="1.5"/>
                            <text x="512" y="348" text-anchor="middle" font-size="8.5" fill="#2a5fa0" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.85">Ruta migratoria</text>
                        </g>

                        <g class="map-svg-layer" id="svg-lyr-location">
                            <circle class="pin-ripple" cx="298" cy="172" r="10" fill="#2f7fc2" fill-opacity="0.2" stroke="none"/>
                            <circle cx="298" cy="172" r="8" fill="#2f7fc2"/>
                            <circle cx="298" cy="172" r="4" fill="#fff"/>
                            <rect x="218" y="182" width="120" height="24" rx="7" fill="white" fill-opacity="0.93" stroke="#cde8f5" stroke-width="1"/>
                            <text x="278" y="199" text-anchor="middle" font-size="9.5" fill="#1a4a72" font-family="'Poppins',sans-serif" font-weight="700">Los Cóbanos, SV</text>
                        </g>
                    </svg>

                    <div class="map-compass" aria-hidden="true">N ↑</div>
                    <div class="map-scale" aria-hidden="true">━━ 5 km</div>
                </div>
            </div>
        </section>

        <!-- ═══════════ BIBLIOTECA ═══════════ -->
        <section class="content-section" id="docs">
            <div class="section-header-left">
                <h2>Biblioteca de documentos</h2>
                <p>Descarga recursos científicos, guías y materiales educativos en PDF</p>
            </div>

            <div class="docs-grid-fluid">
                <article class="doc-card-fluid">
                    <div class="doc-cover-bar blue"></div>
                    <div class="doc-body-fluid">
                        <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                        <h3>Plan de Manejo del Área Natural Protegida Los Cóbanos</h3>
                        <p>Lineamientos de conservación, zonificación y uso responsable del área marina costera.</p>
                        <div class="doc-actions-fluid">
                            <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                            <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                        </div>
                    </div>
                </article>

                <article class="doc-card-fluid">
                    <div class="doc-cover-bar teal"></div>
                    <div class="doc-body-fluid">
                        <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                        <h3>Biodiversidad Marina de Los Cóbanos</h3>
                        <p>Resumen de especies registradas, hábitats principales y prioridades de monitoreo.</p>
                        <div class="doc-actions-fluid">
                            <a href="../public/pdfs/biodiversidad-cobanos.pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                            <a href="../public/pdfs/biodiversidad-cobanos.pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                        </div>
                    </div>
                </article>

                <article class="doc-card-fluid">
                    <div class="doc-cover-bar green"></div>
                    <div class="doc-body-fluid">
                        <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                        <h3>Monitoreo de Tortugas Marinas en Los Cóbanos</h3>
                        <p>Ficha educativa sobre rutas, anidación, amenazas y acciones comunitarias.</p>
                        <div class="doc-actions-fluid">
                            <a href="../public/pdfs/monitoreo-tortugas.pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                            <a href="../public/pdfs/monitoreo-tortugas.pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                        </div>
                    </div>
                </article>

                <article class="doc-card-fluid">
                    <div class="doc-cover-bar coral"></div>
                    <div class="doc-body-fluid">
                        <span class="doc-type pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>
                        <h3>Guía de Buenas Prácticas para el Turismo Marino</h3>
                        <p>Recomendaciones para visitas, buceo, navegación y observación de vida marina.</p>
                        <div class="doc-actions-fluid">
                            <a href="../public/pdfs/guia-turismo-marino.pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                            <a href="../public/pdfs/guia-turismo-marino.pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                        </div>
                    </div>
                </article>
            </div>
        </section>

    </main>

    <div id="footer-container"><?php include(__DIR__ . "/fragments/footer.php"); ?></div>
    <script src="../public/js/burbujas.js" defer></script>
    <script src="../public/js/recursos.js" defer></script>
    <script src="../public/js/session.js" defer></script>
</body>
</html>