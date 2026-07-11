<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$pageTitle = "Recursos - Los Cóbanos";
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link rel="icon" href="../public/media/Web/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="../public/css/navbar-footer.css">
    <link rel="stylesheet" href="../public/css/recursos.css">
</head>
<body class="recursos-page">

<canvas id="particles" aria-hidden="true"></canvas>

<div id="navbar-container">
    <?php include(__DIR__ . '/fragments/navbar.php'); ?>
</div>

<main id="main-content">

    <!-- SECCIÓN HERO -->
    <section class="resources-hero">
        <div class="resources-hero-image" aria-hidden="true"></div>
        <canvas id="particlesHero"></canvas>
        <div class="hero-overlay"></div>
        <div class="hero-content">
            <span class="hero-badge">
                <i class="fa-solid fa-water"></i> Centro de investigación marina
            </span>
            <h1>Los Cóbanos</h1>
            <p class="hero-subtitle">Explora la historia, biodiversidad y conservación de uno de los arrecifes más importantes del Pacífico centroamericano.</p>
            <div class="hero-metrics" aria-label="Resumen de recursos">
                <span><strong>183+</strong> registros</span>
                <span><strong>5</strong> hitos</span>
                <span><strong>4</strong> capas</span>
            </div>
        </div>
        <div class="hero-scroll-indicator"><span></span></div>
    </section>

    <!-- SECCIÓN LÍNEA DE TIEMPO -->
    <section class="content-section" id="timeline-section">
        <div class="section-header-center">
            <h2>Línea del Tiempo</h2>
            <div class="section-line"></div>
            <p>Descubre los acontecimientos más importantes en la historia de conservación de Los Cóbanos.</p>
        </div>

        <div class="timeline-container" id="timelineContainer">
            <!-- Trazo SVG Curvo -->
            <svg class="timeline-svg" viewBox="0 0 1200 350" preserveAspectRatio="none">
                <path id="timelinePathBg" d="M 0,175 C 300,50 600,300 900,100 S 1200,175 1200,175" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="8"/>
                <path id="timelinePathActive" d="M 0,175 C 300,50 600,300 900,100 S 1200,175 1200,175" fill="none" stroke="url(#gradientPath)" stroke-width="8" stroke-dasharray="1600" stroke-dashoffset="1600"/>
                <defs>
                    <linearGradient id="gradientPath" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#FFD700" />
                        <stop offset="100%" stop-color="#35c5a6" />
                    </linearGradient>
                </defs>
            </svg>

            <div class="timeline-items-wrapper">
                <!-- Ítem 1 -->
                <div class="timeline-item" data-year="2008">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <div class="card-icon"><i class="fa-solid fa-mountain"></i></div>
                        <span class="card-year">2008</span>
                        <h4>Creación del Área Natural</h4>
                        <p>Declaración oficial de Los Cóbanos como área protegida de El Salvador.</p>
                    </div>
                </div>
                <!-- Ítem 2 -->
                <div class="timeline-item" data-year="2009">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <div class="card-icon"><i class="fa-solid fa-clipboard-check"></i></div>
                        <span class="card-year">2009</span>
                        <h4>Gestión territorial</h4>
                        <p>Se fortalece la gestión del área marina costera y se promueve la conservación de playas, arrecifes y especies asociadas.</p>
                    </div>
                </div>
                <!-- Ítem 3 -->
                <div class="timeline-item" data-year="2013">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <div class="card-icon"><i class="fa-solid fa-fish"></i></div>
                        <span class="card-year">2013</span>
                        <h4>Monitoreo de Arrecifes</h4>
                        <p>Inicio de los programas de monitoreo comunitario de corales y peces.</p>
                    </div>
                </div>
                <!-- Ítem 4 -->
                <div class="timeline-item" data-year="2018">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <div class="card-icon"><i class="fa-solid fa-turtle"></i></div>
                        <span class="card-year">2018</span>
                        <h4>Protección de Tortugas</h4>
                        <p>Implementación de viveros y patrullajes para proteger las tortugas marinas.</p>
                    </div>
                </div>
                <!-- Ítem 4 (Actualidad) -->
                <div class="timeline-item active" data-year="2026">
                    <div class="timeline-dot pulse"></div>
                    <div class="timeline-card highlight">
                        <div class="card-icon"><i class="fa-solid fa-leaf"></i></div>
                        <span class="card-year">Actualidad</span>
                        <h4>Conservación participativa</h4>
                        <p>Los Cóbanos se mantiene como laboratorio natural para aprender sobre arrecifes y ecosistemas.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECCIÓN CARRUSEL DE BIODIVERSIDAD -->
    <section class="content-section" id="biodiversity-section">
        <div class="section-header-center">
            <h2>Biodiversidad marina</h2>
            <div class="section-line"></div>
            <p>Una vista general de los grupos, hábitats y funciones ecológicas que sostienen la vida en Los Cóbanos.</p>
        </div>

        <div class="biodiversity-carousel-wrapper">
            <button class="bio-nav prev" id="bioPrev" aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
            
            <div class="biodiversity-track" id="bioTrack">
                <!-- Tarjeta 1 -->
                <article class="bio-card">
                    <div class="bio-image">
                        <img src="../public/media/Species/Pez-Angel-Real.png" alt="Pez Ángel Real" loading="lazy">
                    </div>
                    <div class="bio-content">
                        <span class="bio-tag">Especies clave</span>
                        <h3>Peces de Arrecife</h3>
                        <p>Especies como el pez ángel y el cirujano forman parte fundamental del ecosistema.</p>
                        <div class="bio-footer">
                            <span class="bio-count"><i class="fa-regular fa-circle-check"></i> 24 especies</span>
                        </div>
                    </div>
                </article>

                <!-- Tarjeta 2 (Centro) -->
                <article class="bio-card active">
                    <div class="bio-image">
                        <img src="../public/media/Species/estrella-de-mar.png" alt="Estrella de Mar" loading="lazy">
                    </div>
                    <div class="bio-content">
                        <span class="bio-tag">31 Registros</span>
                        <h3>Invertebrados</h3>
                        <p>Estrellas, moluscos, nudibranquios y organismos de fondo reciclan nutrientes.</p>
                        <div class="bio-footer">
                             <span class="bio-count"><i class="fa-regular fa-circle-check"></i> 31 especies</span>
                        </div>
                    </div>
                </article>

                <!-- Tarjeta 3 -->
                <article class="bio-card">
                    <div class="bio-image">
                        <img src="../public/media/Species/Tortuga-Carey.png" alt="Tortuga Carey" loading="lazy">
                    </div>
                    <div class="bio-content">
                        <span class="bio-tag">Protección</span>
                        <h3>Tortugas Marinas</h3>
                        <p>Especies como la tortuga carey y verde encuentran refugio en sus aguas tranquilas.</p>
                        <div class="bio-footer">
                            <span class="bio-count"><i class="fa-regular fa-circle-check"></i> 4 especies</span>
                        </div>
                    </div>
                </article>

                <!-- Tarjeta 4 -->
                <article class="bio-card">
                    <div class="bio-image">
                        <img src="../public/media/Species/caballito-de-mar.png" alt="Caballito de Mar" loading="lazy">
                    </div>
                    <div class="bio-content">
                        <span class="bio-tag">Hábitats</span>
                        <h3>Pastos Marinos</h3>
                        <p>Zonas de alimentación vitales para el crecimiento de juveniles y mantenimiento del ecosistema.</p>
                        <div class="bio-footer">
                            <span class="bio-count"><i class="fa-regular fa-circle-check"></i> 3 biomas</span>
                        </div>
                    </div>
                </article>
            </div>

            <button class="bio-nav next" id="bioNext" aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>
        </div>

        <!-- Indicadores Inferiores -->
        <div class="bio-indicators" id="bioIndicators">
            <span class="bio-dot" data-index="0"></span>
            <span class="bio-dot active" data-index="1"></span>
            <span class="bio-dot" data-index="2"></span>
            <span class="bio-dot" data-index="3"></span>
        </div>
        <div class="bio-current-label">02 Invertebrados</div>
    </section>

    <!-- SECCIÓN MAPA INTERACTIVO -->
        <section class="content-section" id="map">
            <div class="section-header-center map-hero-heading">
                <div class="map-hero-eyebrow"><i class="fa-regular fa-compass"></i> Explora Los Cóbanos <span aria-hidden="true">•••</span></div>
                <h2>Mapa <span>Interactivo</span> Marino</h2>
                <div class="map-hero-divider" aria-hidden="true"><span></span><i class="fa-solid fa-location-dot"></i><span></span></div>
            </div>

            <div class="map-layout">
         <aside class="map-info-card" aria-label="Información sobre Los Cóbanos">
    <span class="map-info-kicker"><i class="fa-solid fa-leaf"></i> Área marina protegida</span>
    <h3>Los Cóbanos,<br><em>un refugio vivo.</em></h3>
    <p>Un paisaje marino costero de Sonsonate donde arrecifes rocosos, tortugas y comunidades conviven para proteger la biodiversidad del Pacífico salvadoreño.</p>
    <div class="map-info-stats">
        <span>Área<br><b>~4 km²</b></span>
        <span>Especies<br><b>183+</b></span>
        <span>Desde<br><b>2008</b></span>
    </div>
</aside>
                <div class="map-panel-wrapper">
                <div class="map-sidebar-vertical" id="mapPills" role="group" aria-label="Capas del mapa" data-active-count="〰 5 CAPAS ACTIVAS 〰">
                    <button class="map-pill active" type="button" data-layer="location">
                        <i class="fa-solid fa-location-dot"></i><span><b>Ubicación</b><small>13.5333° N, 89.8000° O · Los Cóbanos</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="reef">
                        <i class="fa-solid fa-water"></i><span><b>Arrecifes</b><small>Zonas rocosas y coralinas de alta biodiversidad.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="ecosystem">
                        <i class="fa-solid fa-leaf"></i><span><b>Ecosistemas</b><small>Arrecifes, fondo arenoso y praderas marinas.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="turtles">
                        <i class="fa-solid fa-fish-fins"></i><span><b>Tortugas</b><small>Rutas y zonas de anidación protegidas.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="protected">
                        <i class="fa-solid fa-shield-halved"></i><span><b>Protegidas</b><small>Límites de conservación y uso sostenible.</small></span><em class="fa-solid fa-check"></em>
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
                            <linearGradient id="deepSeaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#80d7f4" stop-opacity="0"/><stop offset="100%" stop-color="#157fbd" stop-opacity="0.46"/></linearGradient>
                            <filter id="softGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                        </defs>

                        <rect width="800" height="360" fill="url(#seaGrad)"/>
                        <rect x="0" y="240" width="800" height="120" fill="#8ecde7" opacity="0.25"/>
                        <rect x="0" y="310" width="800" height="50" fill="#7abfde" opacity="0.25"/>
                        <path d="M0 205 Q105 150 210 196 T420 191 T620 183 T800 196 V360 H0Z" fill="url(#deepSeaGrad)"/>
                        <path d="M0 250 Q118 204 220 258 T442 250 T650 244 T800 259" stroke="#d6f7ff" stroke-width="16" opacity="0.16" fill="none"/>
                        <path d="M0 292 Q120 240 240 300 T485 288 T800 298" stroke="#d6f7ff" stroke-width="20" opacity="0.12" fill="none"/>

                        <path d="M0 200 Q200 192 400 200 Q600 208 800 200" stroke="#b2dff0" stroke-width="1" fill="none" opacity="0.6"/>
                        <path d="M0 230 Q200 222 400 232 Q600 240 800 230" stroke="#b2dff0" stroke-width="1" fill="none" opacity="0.45"/>
                        <path d="M0 260 Q200 252 400 262 Q600 270 800 260" stroke="#b2dff0" stroke-width="0.8" fill="none" opacity="0.3"/>

                        <path d="M0 0 L800 0 L800 72 C740 68 700 70 650 78 C600 86 560 90 500 92 C440 94 380 90 320 94 C260 98 210 106 160 114 C110 122 60 134 0 154 Z" fill="url(#landGrad)"/>
                        <path d="M0 0 L800 0 L800 50 C740 46 690 48 640 55 C590 62 540 64 490 67 C430 70 370 67 310 71 C250 75 200 82 150 90 C100 98 50 110 0 128 Z" fill="#a8d08a" opacity="0.5"/>

                        <path d="M0 154 C60 134 110 122 160 114 C210 106 260 98 320 94 C380 90 440 94 500 92 C560 90 600 86 650 78 C700 70 740 68 800 72 L800 96 C740 92 700 95 650 103 C600 111 560 115 500 117 C440 119 380 115 320 119 C260 123 210 131 160 139 C110 147 60 159 0 179 Z" fill="url(#beachGrad)"/>
                        <path d="M0 154 C60 134 110 122 160 114 C210 106 260 98 320 94 C380 90 440 94 500 92 C560 90 600 86 650 78 C700 70 740 68 800 72" stroke="#c8b870" stroke-width="1.5" fill="none" opacity="0.5"/>

                        <circle cx="660" cy="62" r="4" fill="#8a7040" opacity="0.6"/>
                        <text x="670" y="66" font-size="9" fill="#6a5030" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.75">Sonsonate</text>

                        <!-- Vegetación costera en la franja terrestre -->
                        <g class="coastal-palms" opacity="0.88">
                            <g transform="translate(612 68)">
                                <path d="M0 42 C4 27 7 15 9 0" fill="none" stroke="#3d8265" stroke-width="5" stroke-linecap="round"/>
                                <path d="M8 5 C-10 -8 -25 -4 -32 4 C-15 5 -4 11 8 12 M8 5 C22 -8 38 -4 44 7 C28 6 17 11 8 13 M8 6 C-2 -17 -13 -21 -22 -18 C-13 -6 -8 2 1 12 M9 6 C17 -14 28 -17 37 -13 C28 -3 21 4 15 13" fill="#2e9d79"/>
                            </g>
                            <g transform="translate(724 55) scale(.72)">
                                <path d="M0 52 C4 33 8 15 10 0" fill="none" stroke="#427e58" stroke-width="6" stroke-linecap="round"/>
                                <path d="M10 6 C-13 -7 -29 -4 -38 6 C-20 8 -5 13 9 14 M10 6 C28 -9 45 -4 52 8 C34 8 20 13 10 15 M10 6 C-2 -20 -15 -25 -25 -20 C-15 -6 -8 4 3 14 M11 6 C23 -18 37 -20 48 -13 C36 -3 26 5 17 15" fill="#3baf88"/>
                            </g>
                            <g transform="translate(115 95) scale(.55)">
                                <path d="M0 48 C3 30 7 15 9 0" fill="none" stroke="#4a8157" stroke-width="6" stroke-linecap="round"/>
                                <path d="M8 5 C-13 -7 -29 -3 -37 7 C-20 8 -5 13 9 14 M8 5 C27 -9 43 -3 51 9 C33 8 19 13 9 15 M8 5 C-4 -18 -16 -22 -25 -17 C-15 -5 -7 4 3 14" fill="#31946f"/>
                            </g>
                        </g>
                        <g class="coastal-foliage" opacity="0.68">
                            <!-- Copas de mangle y arbustos de costa -->
                            <g fill="#5eae72"><ellipse cx="42" cy="92" rx="31" ry="15"/><ellipse cx="67" cy="87" rx="25" ry="17"/><ellipse cx="93" cy="96" rx="34" ry="14"/><ellipse cx="524" cy="74" rx="29" ry="14"/><ellipse cx="551" cy="66" rx="25" ry="18"/><ellipse cx="577" cy="76" rx="31" ry="14"/><ellipse cx="772" cy="89" rx="36" ry="18"/><ellipse cx="748" cy="77" rx="27" ry="18"/></g>
                            <g fill="#3f9870" opacity="0.76"><path d="M166 113q12-32 25 0q13-38 26 0q13-26 25 0Z"/><path d="M470 103q11-28 23 0q12-34 25 0q13-25 24 0Z"/><path d="M678 89q13-31 26 0q13-37 27 0q13-27 26 0Z"/></g>
                            <!-- Hojas de primer plano -->
                            <g fill="#2e8d73"><path d="M34 140c3-26 18-42 42-47c-9 23-24 38-42 47Z"/><path d="M47 141c14-25 34-32 57-28c-18 18-37 27-57 28Z"/><path d="M760 118c-3-27-19-43-43-48c9 24 24 39 43 48Z"/><path d="M748 119c-14-25-34-33-57-29c18 19 37 28 57 29Z"/></g>
                            <!-- Destellos de vegetación y flores costeras -->
                            <g fill="#b8df87"><circle cx="140" cy="104" r="3"/><circle cx="151" cy="98" r="2"/><circle cx="453" cy="85" r="3"/><circle cx="463" cy="91" r="2"/><circle cx="589" cy="96" r="3"/><circle cx="604" cy="88" r="2"/><circle cx="713" cy="103" r="3"/></g>
                        </g>

                        <ellipse cx="298" cy="162" rx="10" ry="4.5" fill="#c0de98" opacity="0.85"/>
                        <!-- Detalle ambiental permanente -->
                        <g opacity="0.55" fill="#e8fbff"><ellipse cx="92" cy="212" rx="7" ry="3"/><ellipse cx="128" cy="246" rx="4" ry="2"/><ellipse cx="586" cy="174" rx="9" ry="4"/><ellipse cx="702" cy="238" rx="5" ry="2.5"/><circle cx="84" cy="279" r="3"/><circle cx="520" cy="291" r="3"/></g>
                        <g fill="#398fcb" opacity="0.7"><path d="M92 242c9-8 18-7 26 0-8 7-17 8-26 0Zm24 0 7-6v12z"/><path d="M125 226c7-6 14-5 20 0-6 6-13 6-20 0Zm18 0 5-4v8z"/><path d="M526 260c9-8 18-7 25 0-7 7-16 7-25 0Zm23 0 7-5v10z"/></g>
                        <g fill="#4aa88a" opacity="0.55"><path d="M52 360v-56c12 13 10 28 0 40 14-10 23-23 17-40 21 18 14 39-9 56Z"/><path d="M735 360v-48c11 11 9 25 0 34 13-8 21-19 15-34 20 16 13 34-8 48Z"/></g>

                        <g class="map-svg-layer" id="svg-lyr-protected">
                            <ellipse cx="298" cy="200" rx="105" ry="68" fill="#56a86a" fill-opacity="0.1" stroke="#56a86a" stroke-width="2" stroke-dasharray="6 4"/>
                            <rect x="254" y="132" width="88" height="20" rx="10" fill="#3a9d63" filter="url(#softGlow)"/><text x="298" y="146" text-anchor="middle" font-size="8.5" fill="#ffffff" font-family="'Poppins',sans-serif" font-weight="700">Área protegida</text>
                        </g>

                        <g class="map-svg-layer" id="svg-lyr-reef">
                            <rect x="238" y="218" width="78" height="15" rx="7" fill="#e07e6a" fill-opacity="0.7"/>
                            <rect x="335" y="228" width="55" height="12" rx="6" fill="#e07e6a" fill-opacity="0.55"/>
                            <rect x="188" y="234" width="40" height="10" rx="5" fill="#e07e6a" fill-opacity="0.45"/>
                            <text x="280" y="248" text-anchor="middle" font-size="8.5" fill="#a04030" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.85">Zona arrecifal</text>
                            <g stroke-linecap="round"><path d="M260 220v-28m0 14-10-9m10 2 10-12m20 33v-34m0 17-12-11m12 5 11-10m26 31v-22m0 10-8-8m8 3 8-9" stroke="#ef806c" stroke-width="4"/><path d="M244 222v-17m0 8-7-6m42 11v-19m0 9 7-7" stroke="#3577bd" stroke-width="4"/></g>
                        </g>

                        <g class="map-svg-layer" id="svg-lyr-ecosystem">
                            <ellipse cx="178" cy="272" rx="88" ry="44" fill="#3aac97" fill-opacity="0.1" stroke="#3aac97" stroke-width="1.6" stroke-dasharray="5 3"/>
                            <text x="178" y="328" text-anchor="middle" font-size="8.5" fill="#1e7a66" font-family="'Poppins',sans-serif" font-weight="600" opacity="0.8">Ecosistema marino</text>
                            <g fill="#35a99c" opacity="0.75"><path d="M128 301v-38c11 10 9 20 0 29 13-9 19-17 14-29 19 15 12 31-7 38Z"/><path d="M174 310v-34c10 9 8 19 0 26 11-8 17-16 13-26 17 14 11 28-6 34Z"/><path d="M208 297v-26c8 8 7 15 0 21 9-7 15-13 11-21 15 12 10 23-5 26Z"/></g>
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
                            <path d="M298 206 L395 290" stroke="#2f7fc2" stroke-width="3" stroke-dasharray="8 6" opacity="0.8"/>
                        </g>
                    </svg>

                    <div class="map-compass" aria-hidden="true">N ↑</div>
                    <div class="map-scale" aria-hidden="true">━━ 5 km</div>
                </div>

                <div class="map-layer-summary" aria-live="polite">
                    <span id="mapActiveCount">5 capas activas</span>
                    <strong id="mapActiveList">Ubicación, Arrecifes, Ecosistemas, Tortugas y Protegidas</strong>
                </div>
            </div>
            </div>
        </section>

    <!-- SECCIÓN BIBLIOTECA DE DOCUMENTOS -->
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
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
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
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
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
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" target="_blank" rel="noopener" class="doc-btn-action view" aria-label="Ver PDF"><i class="fa-solid fa-eye"></i> Ver</a>
                        <a href="../public/pdfs/LISTA DE ESPECIES AMENAZADAS Y EN PELIGRO DE EXTINCIÓN. 18-10-2023. (1) (1) (1) (1).pdf" download class="doc-btn-action download" aria-label="Descargar PDF"><i class="fa-solid fa-download"></i></a>
                    </div>
                </div>
            </article>
        </div>
    </section>

</main>

<div id="footer-container">
    <?php include(__DIR__ . "/fragments/footer.php"); ?>
</div>

<!-- SCRIPTS DE TU PROYECTO ORIGINAL -->
<script src="../public/js/burbujas.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
<script src="../public/js/recursos.js" defer></script>
<script src="../public/js/session.js" defer></script>

</body>
</html>
