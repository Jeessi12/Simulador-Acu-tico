    <!-- SECCIÓN MAPA INTERACTIVO -->
        <section class="content-section map-explorer-section" id="map">
            <div class="map-layout">
                <div class="map-panel-wrapper">
                <div class="map-sidebar-vertical" id="mapPills" role="group" aria-label="Capas del mapa" data-active-count="〰 5 CAPAS ACTIVAS 〰">
                    <button class="map-pill active" type="button" data-layer="location" aria-pressed="true">
                        <i class="fa-solid fa-location-dot"></i><span><b>Ubicación</b><small>13.5333° N, 89.8000° O · Los Cóbanos</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="reef" aria-pressed="true">
                        <i class="fa-solid fa-water"></i><span><b>Arrecifes</b><small>Zonas rocosas y coralinas de alta biodiversidad.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="ecosystem" aria-pressed="true">
                        <i class="fa-solid fa-leaf"></i><span><b>Ecosistemas</b><small>Arrecifes, fondo arenoso y praderas marinas.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="turtles" aria-pressed="true">
                        <i class="fa-solid fa-fish-fins"></i><span><b>Tortugas</b><small>Rutas y zonas de anidación protegidas.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                    <button class="map-pill active" type="button" data-layer="protected" aria-pressed="true">
                        <i class="fa-solid fa-shield-halved"></i><span><b>Protegidas</b><small>Límites de conservación y uso sostenible.</small></span><em class="fa-solid fa-check"></em>
                    </button>
                </div>

                <div class="illustrated-map" aria-label="Mapa ilustrado de Los Cóbanos">
                    <svg viewBox="0 0 1200 620" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="map-svg-title map-svg-desc">
                        <title id="map-svg-title">Paisaje marino ilustrado de Los Cóbanos</title>
                        <desc id="map-svg-desc">Mapa interactivo con ubicación, arrecifes, ecosistemas, ruta de tortugas y área protegida.</desc>
                        <defs>
                            <linearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stop-color="#9de4fb"/>
                                <stop offset=".7" stop-color="#dff7ff"/>
                                <stop offset="1" stop-color="#f9fdff"/>
                            </linearGradient>
                            <linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stop-color="#bceffa"/>
                                <stop offset=".34" stop-color="#85daf1"/>
                                <stop offset=".72" stop-color="#4cb8e3"/>
                                <stop offset="1" stop-color="#248fd1"/>
                            </linearGradient>
                            <linearGradient id="mapIsland" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stop-color="#b9e98d"/>
                                <stop offset="1" stop-color="#42ac88"/>
                            </linearGradient>
                            <linearGradient id="mapSand" x1="0" y1="0" x2="1" y2=".25">
                                <stop offset="0" stop-color="#fff4c9"/>
                                <stop offset=".55" stop-color="#ffe69f"/>
                                <stop offset="1" stop-color="#fff8dc"/>
                            </linearGradient>
                            <radialGradient id="mapSunGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0" stop-color="#ffffff" stop-opacity=".9"/>
                                <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
                            </radialGradient>
                            <linearGradient id="mapRay" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stop-color="#ffffff" stop-opacity=".45"/>
                                <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
                            </linearGradient>
                            <filter id="mapSoftShadow" x="-30%" y="-30%" width="160%" height="180%">
                                <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#075f9e" flood-opacity=".18"/>
                            </filter>
                            <filter id="mapSoftGlow" x="-40%" y="-60%" width="180%" height="220%">
                                <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#1579b8" flood-opacity=".2"/>
                            </filter>
                            <filter id="mapTexture" x="-10%" y="-10%" width="120%" height="120%">
                                <feTurbulence type="fractalNoise" baseFrequency=".012 .026" numOctaves="2" seed="8" result="noise"/>
                                <feColorMatrix in="noise" type="saturate" values="0" result="mono"/>
                                <feComponentTransfer in="mono"><feFuncA type="table" tableValues="0 .08"/></feComponentTransfer>
                            </filter>
                            <symbol id="mapFish" viewBox="0 0 44 24">
                                <path d="M4 12C13 2 27 2 36 12C27 22 13 22 4 12Z"/>
                                <path d="M34 12L44 4V20Z"/>
                                <circle cx="14" cy="9" r="1.4" fill="#eafaff"/>
                            </symbol>
                            <symbol id="mapPalm" viewBox="-46 -30 92 112">
                                <path d="M2 80C8 47 10 22 6 0" fill="none" stroke="#397c66" stroke-width="7" stroke-linecap="round"/>
                                <path d="M7 4C-14-15-35-14-45-2C-26-3-9 3 7 12C-6-23-23-31-34-25C-20-13-10-3 2 12C18-20 35-23 45-13C29-5 18 4 9 15C31-8 46 0 48 12C30 10 19 14 8 19Z" fill="#2e9d7d"/>
                                <path d="M4 10C-1-16 7-27 18-29C17-12 13 1 7 15Z" fill="#4bb68d"/>
                            </symbol>
                        </defs>

                        <!-- Cielo luminoso -->
                        <rect width="1200" height="230" fill="url(#mapSky)"/>
                        <ellipse cx="890" cy="34" rx="250" ry="170" fill="url(#mapSunGlow)"/>
                        <path d="M410 0H630L410 260H235Z" fill="url(#mapRay)" opacity=".48"/>
                        <path d="M650 0H820L620 250H520Z" fill="url(#mapRay)" opacity=".26"/>
                        <g fill="#ffffff" opacity=".92">
                            <g transform="translate(300 74)"><ellipse cx="0" cy="10" rx="36" ry="11"/><circle cx="-15" cy="3" r="12"/><circle cx="5" cy="-3" r="17"/><circle cx="24" cy="5" r="12"/></g>
                            <g transform="translate(748 44) scale(.78)"><ellipse cx="0" cy="10" rx="40" ry="12"/><circle cx="-18" cy="2" r="13"/><circle cx="5" cy="-6" r="18"/><circle cx="26" cy="4" r="13"/></g>
                            <g transform="translate(1080 32) scale(.66)"><ellipse cx="0" cy="10" rx="42" ry="12"/><circle cx="-20" cy="1" r="14"/><circle cx="4" cy="-7" r="19"/><circle cx="29" cy="3" r="13"/></g>
                        </g>
                        <g fill="none" stroke="#4eb5e7" stroke-width="4" stroke-linecap="round" opacity=".72">
                            <path d="M242 59q12-12 24 0q12-12 24 0"/><path d="M360 40q13-14 26 0q13-14 26 0"/><path d="M104 95q9-9 18 0q9-9 18 0"/>
                        </g>

                        <!-- Isla, playa y vegetación costera -->
                        <path d="M0 184C110 166 194 173 284 171C398 169 507 161 611 145C730 127 838 106 950 112C1051 117 1125 137 1200 152V229H0Z" fill="#58ba9a" opacity=".82"/>
                        <path d="M0 193C77 158 141 157 205 179C276 139 339 146 398 169C493 144 581 142 660 154C739 112 805 102 878 130C955 86 1028 92 1095 129C1142 109 1176 121 1200 136V225H0Z" fill="url(#mapIsland)"/>
                        <g fill="#2b997f" opacity=".82">
                            <ellipse cx="70" cy="185" rx="61" ry="28"/><ellipse cx="155" cy="172" rx="70" ry="32"/><ellipse cx="255" cy="174" rx="76" ry="27"/><ellipse cx="665" cy="151" rx="79" ry="30"/><ellipse cx="765" cy="130" rx="84" ry="34"/><ellipse cx="868" cy="126" rx="76" ry="31"/><ellipse cx="990" cy="122" rx="88" ry="35"/><ellipse cx="1112" cy="148" rx="96" ry="39"/>
                        </g>
                        <g fill="#74ce91" opacity=".9">
                            <circle cx="122" cy="154" r="28"/><circle cx="203" cy="151" r="23"/><circle cx="620" cy="141" r="24"/><circle cx="704" cy="123" r="25"/><circle cx="824" cy="109" r="28"/><circle cx="937" cy="105" r="24"/><circle cx="1048" cy="120" r="29"/>
                        </g>
                        <use href="#mapPalm" x="780" y="55" width="74" height="108"/>
                        <use href="#mapPalm" x="884" y="40" width="84" height="122"/>
                        <use href="#mapPalm" x="1035" y="57" width="70" height="102"/>
                        <use href="#mapPalm" x="126" y="96" width="58" height="88" opacity=".82"/>
                        <path d="M0 202C118 239 219 221 320 202C463 174 566 170 681 180C817 192 931 165 1035 174C1094 179 1145 190 1200 202V239C1119 221 1048 221 969 217C842 210 736 236 608 222C463 206 357 218 247 244C155 265 78 258 0 234Z" fill="url(#mapSand)"/>
                        <path d="M0 228C106 266 210 246 315 219C425 191 557 188 680 202C807 217 910 189 1025 193C1091 196 1144 207 1200 221" fill="none" stroke="#ffffff" stroke-width="15" stroke-linecap="round" opacity=".92"/>

                        <!-- Agua y textura acuarelada -->
                        <path d="M0 226C108 262 210 247 315 220C430 191 552 191 676 204C803 218 914 190 1028 194C1090 196 1146 208 1200 221V620H0Z" fill="url(#mapSea)"/>
                        <path d="M0 226C108 262 210 247 315 220C430 191 552 191 676 204C803 218 914 190 1028 194C1090 196 1146 208 1200 221" fill="none" stroke="#f9ffff" stroke-width="7" opacity=".7"/>
                        <rect y="220" width="1200" height="400" filter="url(#mapTexture)" opacity=".58"/>
                        <path d="M0 349C114 308 228 373 348 338S579 316 699 352S932 374 1200 319V620H0Z" fill="#66c7e8" opacity=".25"/>
                        <path d="M0 448C132 392 258 469 394 427S656 394 804 442S1044 476 1200 414V620H0Z" fill="#309fd6" opacity=".2"/>
                        <path d="M0 531C125 480 244 555 376 519S627 484 786 530S1031 554 1200 503V620H0Z" fill="#167fc6" opacity=".16"/>
                        <g fill="none" stroke="#dff8ff" stroke-linecap="round" opacity=".18">
                            <path d="M35 318Q150 274 270 318T505 313T744 319" stroke-width="18"/>
                            <path d="M260 412Q400 366 536 414T810 410T1090 404" stroke-width="24"/>
                            <path d="M8 548Q142 497 274 544T540 543T818 532" stroke-width="28"/>
                        </g>
                        <g stroke="#d9f8ff" fill="none" opacity=".68">
                            <circle cx="82" cy="454" r="6" stroke-width="2"/><circle cx="91" cy="437" r="3"/><circle cx="286" cy="291" r="5"/><circle cx="296" cy="271" r="3"/><circle cx="667" cy="319" r="5"/><circle cx="676" cy="299" r="3"/><circle cx="1018" cy="488" r="6"/><circle cx="1028" cy="465" r="3"/><circle cx="1130" cy="323" r="4"/>
                        </g>

                        <!-- Fauna ambiental -->
                        <g fill="#278fcf" opacity=".63">
                            <use href="#mapFish" x="48" y="295" width="46" height="25"/><use href="#mapFish" x="98" y="335" width="42" height="23"/><use href="#mapFish" x="145" y="367" width="38" height="21"/><use href="#mapFish" x="206" y="471" width="34" height="19"/>
                            <use href="#mapFish" x="630" y="279" width="38" height="21"/><use href="#mapFish" x="683" y="301" width="42" height="23"/><use href="#mapFish" x="724" y="327" width="36" height="20"/>
                            <use href="#mapFish" x="532" y="512" width="42" height="23"/><use href="#mapFish" x="610" y="546" width="35" height="19"/>
                        </g>
                        <g fill="#256cb8" opacity=".72">
                            <use href="#mapFish" x="106" y="390" width="43" height="24"/><use href="#mapFish" x="158" y="420" width="48" height="26"/><use href="#mapFish" x="249" y="501" width="42" height="23"/>
                        </g>

                        <!-- Vegetación decorativa de primer plano -->
                        <g opacity=".88">
                            <path d="M0 620V474C28 500 29 538 8 561C43 530 69 533 72 557C50 566 31 588 23 620Z" fill="#31a68b"/>
                            <path d="M0 620V526C21 539 31 559 19 579C48 554 74 559 78 583C55 588 38 603 31 620Z" fill="#80cf70"/>
                            <path d="M1120 620V544C1135 553 1144 568 1134 584C1158 560 1182 565 1200 587V620Z" fill="#4bb48c"/>
                            <path d="M1030 620v-55c14 13 15 29 3 41c20-16 39-12 44 7c-19 1-32 4-40 7Z" fill="#2d82c5"/>
                            <g fill="#1e79c2"><path d="M80 620v-38c8 5 13 14 11 25c8-12 17-19 29-18c-5 14-13 24-24 31Z"/><path d="M970 620v-42c10 6 15 17 12 29c10-14 21-20 33-18c-7 15-17 25-29 31Z"/></g>
                        </g>

                        <!-- Capa: área protegida -->
                        <g class="map-svg-layer" id="svg-lyr-protected">
                            <ellipse cx="465" cy="388" rx="194" ry="132" fill="#54c48b" fill-opacity=".07" stroke="#36b77a" stroke-width="3" stroke-dasharray="14 10"/>
                            <g filter="url(#mapSoftGlow)"><rect x="385" y="243" width="160" height="42" rx="21" fill="#4fc28b"/><text x="465" y="270" text-anchor="middle" font-size="17" fill="#fff" font-family="'Poppins',sans-serif" font-weight="700">Área protegida</text></g>
                        </g>

                        <!-- Capa: arrecife -->
                        <g class="map-svg-layer" id="svg-lyr-reef">
                            <ellipse cx="460" cy="465" rx="118" ry="19" fill="#187aba" opacity=".2"/>
                            <g stroke-linecap="round" stroke-linejoin="round">
                                <path d="M386 463v-54m0 27l-18-17m18 4l19-29m-2 70v-34m0 14l14-13" fill="none" stroke="#3779c5" stroke-width="12"/>
                                <path d="M446 463v-63m0 31l-24-18m24 4l23-31m-4 77v-35m0 15l18-17" fill="none" stroke="#ffd24f" stroke-width="13"/>
                                <path d="M501 464v-47m0 22l-17-14m17 1l16-22m-3 59v-28m0 11l15-12" fill="none" stroke="#f18b73" stroke-width="10"/>
                                <path d="M349 465v-37m0 18l-14-12m14 3l12-19" fill="none" stroke="#4b91d3" stroke-width="10"/>
                            </g>
                            <path d="M525 452c12-17 32-18 43-3c-10 16-31 19-43 3Zm41-3l14-10v21Z" fill="#2a70bb"/>
                            <text x="461" y="503" text-anchor="middle" font-size="17" fill="#145993" font-family="'Poppins',sans-serif" font-weight="700">Zona arrecifal</text>
                        </g>

                        <!-- Capa: ecosistema marino -->
                        <g class="map-svg-layer" id="svg-lyr-ecosystem">
                            <ellipse cx="218" cy="485" rx="166" ry="92" fill="#31bca4" fill-opacity=".06" stroke="#2bbca2" stroke-width="3" stroke-dasharray="13 10"/>
                            <g fill="none" stroke-linecap="round">
                                <path d="M139 550q-30-76 8-117M157 553q7-84 43-123M181 554q-15-77 4-116M208 554q35-75 17-121M232 554q50-62 42-104M257 554q5-68 34-94" stroke="#2aa99a" stroke-width="12"/>
                                <path d="M123 554q10-57-13-89M194 554q-41-65-31-105M246 554q-22-62-8-101" stroke="#4ec3a9" stroke-width="10"/>
                            </g>
                            <ellipse cx="208" cy="554" rx="100" ry="13" fill="#187fbd" opacity=".22"/>
                            <text x="220" y="596" text-anchor="middle" font-size="17" fill="#188a73" font-family="'Poppins',sans-serif" font-weight="700">Ecosistema marino</text>
                        </g>

                        <!-- Capa: ruta de tortugas -->
                        <g class="map-svg-layer" id="svg-lyr-turtles">
                            <path d="M790 607C745 531 665 497 589 456C541 430 497 408 449 380" stroke="#356bd1" stroke-width="5" fill="none" stroke-dasharray="14 11" stroke-linecap="round"/>
                            <g fill="#fff" stroke="#356bd1" stroke-width="4"><circle cx="739" cy="551" r="9"/><circle cx="657" cy="493" r="9"/><circle cx="584" cy="453" r="9"/></g>
                            <g transform="translate(520 410) rotate(-28)" fill="#4c9b65"><ellipse rx="16" ry="12"/><circle cx="20" cy="0" r="5"/><path d="M-7-9l-12-10l3 15M-7 9l-12 10l3-15M8-9l10-9l-2 14M8 9l10 9l-2-14"/></g>
                            <text x="780" y="602" text-anchor="middle" font-size="17" fill="#215fb8" font-family="'Poppins',sans-serif" font-weight="700">Ruta migratoria</text>
                        </g>

                        <!-- Capa: ubicación -->
                        <g class="map-svg-layer" id="svg-lyr-location" filter="url(#mapSoftShadow)">
                            <circle class="pin-ripple" cx="465" cy="340" r="28" fill="#1e92ea" fill-opacity=".18"/>
                            <path d="M465 305c-22 0-39 17-39 39c0 29 39 68 39 68s39-39 39-68c0-22-17-39-39-39Z" fill="#208fe7" stroke="#fff" stroke-width="5"/>
                            <circle cx="465" cy="344" r="13" fill="#fff"/>
                            <rect x="352" y="410" width="226" height="52" rx="15" fill="#fff" stroke="#c8eaf7" stroke-width="2"/>
                            <text x="465" y="443" text-anchor="middle" font-size="19" fill="#124f87" font-family="'Poppins',sans-serif" font-weight="800">Los Cóbanos, SV</text>
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

                <aside class="map-story-panel" aria-labelledby="map-story-title">
                    <div class="map-story-orbit" aria-hidden="true"><i class="fa-solid fa-location-dot"></i></div>
                    <span class="map-story-kicker"><i class="fa-regular fa-compass"></i> Explorador marino</span>
                    <h2 id="map-story-title">Mapa interactivo de <span>Los Cóbanos</span></h2>
                    <div class="map-story-wave" aria-hidden="true"><i class="fa-solid fa-water"></i></div>
                    <p class="map-story-lead">Recorre un paisaje costero donde arrecifes, rutas de tortugas y zonas de conservación forman un mismo ecosistema vivo.</p>
                    <div class="map-story-guide">
                        <span class="map-story-guide-icon"><i class="fa-solid fa-layer-group"></i></span>
                        <div>
                            <strong>Construye tu propia lectura</strong>
                            <p>Activa o desactiva las capas del mapa para observar la ubicación, los hábitats y las áreas protegidas por separado.</p>
                        </div>
                    </div>
                    <dl class="map-story-facts" aria-label="Datos destacados de Los Cóbanos">
                        <div><dt>Área</dt><dd>~4 km²</dd></div>
                        <div><dt>Registros</dt><dd>183+</dd></div>
                        <div><dt>Protegida</dt><dd>Desde 2008</dd></div>
                    </dl>
                    <div class="map-story-source"><i class="fa-solid fa-shield-halved"></i> Área Natural Protegida de El Salvador</div>
                </aside>
            </div>
        </section>
