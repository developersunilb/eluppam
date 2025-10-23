Malayalam Mahjong 3D Game – Expanded Scope of Works
🔹 Game Concept

A 3D Mahjong-inspired game rendered in a Roblox-style environment with Malayalam characters instead of Chinese characters. The game blends traditional Mahjong rules with an educational Malayalam twist in a Kerala-inspired setting.

Players match tiles; when matched:

The tile pronounces the Malayalam letter.

The tiles animate (fly off) to a side panel for matched-tile display.

Background music and effects enrich the atmosphere.

🔹 Scope of Works
1. Game Environment (Kerala + Roblox style)

Kerala-inspired Roblox-like environment: nalukettu-style houses, coconut trees, backwaters, and tiled platforms.

Bright but minimalistic art style with soft lighting.

Light ambient animations: moving clouds, swaying trees, water ripple.

2. 3D Tiles with Malayalam Characters

Mahjong-style 3D blocks.

Top face: Malayalam character texture.

Other faces: ivory with subtle shine.

Characters dynamically drawn on canvas textures (so you can easily add all 51+ Malayalam letters).

3. Gameplay Mechanics

Mahjong rules (stacking, blocking, matching).

Tile interaction via raycasting (click/tap detection).

Only free tiles can be selected.

Matching pair logic:

Play Malayalam pronunciation audio.

Animate matched tiles (bounce + fly off to side panel).

Add to scoreboard and matched-tile display.

4. Audio System (Background & Effects)

Background Music:

Light instrumental loop (flute, veena, or calm temple ambiance).

Toggle button in UI (On/Off).

Default: ON at low volume.

Sound Effects:

Tile click: soft “tap” sound.

Tile fly-off: whoosh or swish sound.

Tile match confirmed: subtle chime + pronunciation audio.

Background ambient sounds (optional layering): birds, bells, water trickle.

Malayalam Pronunciations:

Pre-record each Malayalam letter in a clear native voice.

Play immediately on tile click and again on match.

5. UI / UX

Side Panel:

Displays matched tiles in order.

Small glowing highlight when a new pair arrives.

Top HUD:

Score counter.

Timer.

Buttons: Restart, Shuffle, Music Toggle, Tutorial.

Responsive controls:

Orbit, zoom, and reset camera.

Works on both desktop and mobile browsers.

6. Animations & Visual Effects

Tile selection: glow/scale-up effect.

Matched tiles: bounce + fly-off to side panel.

Small confetti burst or particle sparkle when matches occur.

Environment animations: day–night transition (stretch goal).

7. Multiplatform Deployment

Web-first (Next.js + react-three-fiber).

Optimized for desktop & mobile WebGL.

PWA-ready (offline play + home-screen install).

8. Stretch Goals (Future)

Word mode: match tiles to form valid Malayalam words.

Multiplayer competitive mode.

Festival themes: Onam, Vishu, Pooram.

Leaderboards & achievements.

🔹 Deliverables

Full 3D Kerala-inspired Roblox-style game environment.

3D Mahjong tile system with Malayalam characters.

Mahjong gameplay mechanics with stacking & matching rules.

Audio system: background music (toggleable), sound effects (click, fly-off, match), Malayalam pronunciation audio.

UI: side panel, score, timer, shuffle, restart, tutorial, music toggle.

Smooth animations for tiles & environment.

Optimized browser game (Next.js + three.js with R3F).

⚡ Suggested Prompt (AI/freelancer brief):

"Build a 3D Malayalam Mahjong game using Next.js + Three.js (react-three-fiber) with Malayalam letters instead of Chinese characters. Include Mahjong gameplay mechanics (stacking, blocking, matching). When tiles are matched, play Malayalam pronunciation audio, animate the tiles flying off to a side panel, and update the score. Add a Roblox-style Kerala-inspired environment (houses, coconut trees, backwaters) with simple but beautiful rendering. Include background music that can be toggled on/off, and sound effects for tile clicks, flying off, and successful matches. Provide a clean UI with score, timer, restart, shuffle, tutorial, and matched-tile display. The code should be modular, optimized for browser, and PWA-ready."


'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useProgress } from '@/context/ProgressContext';
import { useRouter } from 'next/navigation';

const Mahjong3DGame: React.FC = () => {
    const { updateModuleProgress } = useProgress();
    const router = useRouter();
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const gameCanvasRef = useRef<HTMLCanvasElement>(null);
    const scoreValueRef = useRef<HTMLSpanElement>(null);
    const timeValueRef = useRef<HTMLSpanElement>(null);
    const matchesValueRef = useRef<HTMLSpanElement>(null);
    const musicBtnRef = useRef<HTMLButtonElement>(null);
    const shuffleBtnRef = useRef<HTMLButtonElement>(null);
    const restartBtnRef = useRef<HTMLButtonElement>(null);
    const playAgainBtnRef = useRef<HTMLButtonElement>(null);
    const matchedListRef = useRef<HTMLDivElement>(null);
    const completionModalRef = useRef<HTMLDivElement>(null);
    const finalScoreRef = useRef<HTMLSpanElement>(null);
    const finalTimeRef = useRef<HTMLSpanElement>(null);
    const tutorialRef = useRef<HTMLDivElement>(null);
    const nextLevelBtnRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        console.log('Mahjong3D useEffect ran');
        if (typeof window === 'undefined' || !gameCanvasRef.current) {
            return;
        }

        const MALAYALAM_CHARACTERS = [
            'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ',
            'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ'
        ];

        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, raycaster: THREE.Raycaster, mouse: THREE.Vector2;
        let tiles: any[] = [], selectedTiles: any[] = [], matchedPairs: any[] = [];
        let score = 0, gameTime = 0, gameStarted = false, gameCompleted = false;
        let musicEnabled = true, gameTimer: NodeJS.Timeout | null = null, cloudsGroup: THREE.Group;

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.Fog(0x87CEEB, 30, 100);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 35, 20);
            camera.lookAt(0, 0, 0);

            const canvas = gameCanvasRef.current!;
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            setupLighting();
            createEnvironment();
            loadModels(); // Call to load GLB models
            createTiles();
            setupEventListeners();
            animate();
        }

        function setupLighting() {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(10, 20, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0xFFF8DC, 0.5);
            pointLight.position.set(0, 10, 0);
            scene.add(pointLight);
        }

        function loadModels() {
            const loader = new GLTFLoader();

            const addCoconutTree = (id: number, x: number, y: number, z: number, scale: number, rotationY: number) => {
                loader.load('/3Dmodels/base.glb', (gltf) => {
                    const coconutTree = gltf.scene;
                    coconutTree.scale.set(scale, scale, scale);
                    coconutTree.position.set(x, y, z);
                    coconutTree.rotation.y = rotationY;
                    scene.add(coconutTree);

                    // Create a text label for the tree
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    if (context) {
                        canvas.width = 128;
                        canvas.height = 64;
                        context.font = 'Bold 40px Arial';
                        context.fillStyle = 'red';
                        context.textAlign = 'center';
                        context.textBaseline = 'middle';
                        context.fillText(id.toString(), 64, 32);

                        const texture = new THREE.CanvasTexture(canvas);
                        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
                        const sprite = new THREE.Sprite(spriteMaterial);
                        sprite.scale.set(5, 2.5, 1); // Adjust size of the label
                        sprite.position.set(x, y + scale * 2, z); // Position above the tree
                        scene.add(sprite);
                    }
                }, undefined, (error) => {
                    console.error('An error occurred loading the GLTF model:', error);
                });
            };

            // Additional trees
            // Group of trees near the lake, on the green land (adjusted to be outside the lake)
            addCoconutTree(2, 12, -2, -5, 4.5 + Math.random(), Math.random() * Math.PI * 2); // Moved out of lake, closer to edge and further down and right
            addCoconutTree(3, 10 + Math.random() * 2, -2, -8 + Math.random() * 2, 4 + Math.random(), Math.random() * Math.PI * 2); // Accompanying tree 1
            addCoconutTree(4, 1 - Math.random() * 2, -2, -12 - Math.random() * 3, 4 + Math.random(), Math.random() * Math.PI * 2); // Accompanying tree 2 (shifted even further left)

            // Other trees around the mahjong board, on the green land (adjusted for left overflow)
            addCoconutTree(5, -10 + Math.random() * 5, -2, 10 + Math.random() * 5, 4 + Math.random(), Math.random() * Math.PI * 2); // Bottom-left area (shifted further left)
            addCoconutTree(6, 5 + Math.random() * 10, -2, 8 + Math.random() * 5, 4 + Math.random(), Math.random() * Math.PI * 2);  // Bottom-right area (shifted further left and top)
            addCoconutTree(7, -5 + Math.random() * 5, -2, -15 - Math.random() * 5, 4 + Math.random(), Math.random() * Math.PI * 2); // Top-left area (shifted right)
            addCoconutTree(8, 10 + Math.random() * 10, -2, -19 - Math.random() * 5, 4 + Math.random(), Math.random() * Math.PI * 2);  // Top-right area (shifted further top)
            addCoconutTree(9, -17 + Math.random() * 5, -2, 0 + Math.random() * 5, 4 + Math.random(), Math.random() * Math.PI * 2);   // Mid-left area (shifted further left)
            addCoconutTree(10, 15 + Math.random() * 5, -2, 0 + Math.random() * 5, 4 + Math.random(), Math.random() * Math.PI * 2);    // Mid-right area
        }

        function createEnvironment() {
            const groundGeometry = new THREE.PlaneGeometry(50, 50);
            const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -2;
            ground.receiveShadow = true;
            scene.add(ground);

            const radiusX = 10; // Half-width of the oval
            const radiusY = 5;  // Half-height of the oval

            const ellipse = new THREE.EllipseCurve(
                0, 0,            // ax, aY
                radiusX, radiusY, // xRadius, yRadius
                0, 2 * Math.PI,  // aStartAngle, aEndAngle
                false,           // aClockwise
                0                // aRotation
            );

            const waterShape = new THREE.Shape(ellipse.getPoints(50)); // Get 50 points to define the curve
            const waterGeometry = new THREE.ShapeGeometry(waterShape);
            const waterMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1, transparent: true, opacity: 0.7 });
            const water = new THREE.Mesh(waterGeometry, waterMaterial);
            water.rotation.x = -Math.PI / 2;
            water.position.set(10, -1.9, -15); // Moved further left
            water.visible = true; // Make water visible
            scene.add(water);

            cloudsGroup = new THREE.Group();
            cloudsGroup.position.set(0, 20, -30);
            for (let i = 0; i < 5; i++) {
                const cloudGroup = new THREE.Group();
                cloudGroup.position.set(i * 15 - 30, Math.sin(i) * 5, 0);
                const cloudMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
                const mainCloud = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 3), cloudMaterial);
                cloudGroup.add(mainCloud);
                cloudsGroup.add(cloudGroup);
            }
            scene.add(cloudsGroup);
        }

        function createTiles() {
            tiles.forEach(tile => { if (tile.mesh) scene.remove(tile.mesh); });
            tiles = [];

            const characters = MALAYALAM_CHARACTERS.slice(0, 9);
            const pairs = [...characters, ...characters];
            const shuffled = pairs.sort(() => Math.random() - 0.5);

            let index = 0;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 4; col++) {
                    if (index < shuffled.length) {
                        createTile(`tile_${index}`, shuffled[index], [col * 4.4 - 6.6, 0, row * 4.4 - 4.4], 0, row, col);
                        index++;
                    }
                }
            }

            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 3; col++) {
                    if (index < shuffled.length) {
                        createTile(`tile_${index}`, shuffled[index], [col * 4.4 - 4.4, 0.8, row * 4.4 - 2.2], 1, row, col);
                        index++;
                    }
                }
            }
        }

        function createTile(id: string, character: string, position: [number, number, number], layer: number, row: number, col: number) {
            const tileGroup = new THREE.Group();
            
            const tileGeometry = new THREE.BoxGeometry(4, 0.8, 2.8);
            const tileMaterial = new THREE.MeshLambertMaterial({ color: 0xFFF0B5 }); // Even lighter Marigold color
            const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
            tileMesh.castShadow = true;
            tileMesh.receiveShadow = true;
            
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext('2d')!;
            context.fillStyle = '#228B22'; // Green font color
            context.font = 'bold 50px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(character, 64, 64);
            
            const texture = new THREE.CanvasTexture(canvas);
            const textMaterial = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
            
            const textGeometry = new THREE.PlaneGeometry(3.6, 2.4);
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.rotation.x = -Math.PI / 2;
            textMesh.position.y = 0.41;
            
            tileGroup.add(tileMesh);
            tileGroup.add(textMesh);
            tileGroup.position.set(...position);
            
            const tile = {
                id, character, position, layer, row, col,
                mesh: tileGroup, tileMesh, textMesh,
                matched: false, selected: false, blocked: false
            };
            
            tiles.push(tile);
            scene.add(tileGroup);
        }

        function setupEventListeners() {
            gameCanvasRef.current?.addEventListener('mousemove', onMouseMove);
            gameCanvasRef.current?.addEventListener('click', onMouseClick);
            window.addEventListener('resize', onWindowResize);
            
            musicBtnRef.current?.addEventListener('click', toggleMusic);
            shuffleBtnRef.current?.addEventListener('click', shuffleTiles);
            restartBtnRef.current?.addEventListener('click', restartGame);
            playAgainBtnRef.current?.addEventListener('click', restartGame);
            nextLevelBtnRef.current?.addEventListener('click', () => router.push('/games'));
            
            gameCanvasRef.current?.addEventListener('touchstart', onTouchStart);
        }

        function onMouseMove(event: MouseEvent) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        function onMouseClick() { handleTileClick(); }

        function onTouchStart(event: TouchEvent) {
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
                handleTileClick();
            }
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function handleTileClick() {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(tiles.filter(tile => !tile.matched).map(tile => tile.tileMesh));
            
            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                const clickedTile = tiles.find(tile => tile.tileMesh === clickedMesh);
                
                if (clickedTile) {
                    console.log('Clicked tile:', clickedTile.character, `(ID: ${clickedTile.id})`);
                    const blocked = isTileBlocked(clickedTile);
                    console.log('Is tile blocked?', blocked);

                    if (!blocked) {
                        if (!gameStarted) startGame();
                        playClickSound();
                        playPronunciation(clickedTile.character);
                        processTileSelection(clickedTile);
                    }
                }
            }
        }

        function isTileBlocked(tile: any): boolean {
            // Check for tiles on top
            const onTop = tiles.some(other => {
                if (!other.matched && other.id !== tile.id && other.layer > tile.layer && Math.abs(other.position[0] - tile.position[0]) < 2 && Math.abs(other.position[2] - tile.position[2]) < 1.4) {
                    console.log(`Tile ${tile.character} (ID: ${tile.id}) is blocked by ${other.character} (ID: ${other.id}) from above.`);
                    return true;
                }
                return false;
            });

            if (onTop) {
                return true;
            }

            // Check for tiles on both left and right
            const hasLeftNeighbor = tiles.some(other => {
                if (!other.matched && other.id !== tile.id && other.layer === tile.layer && Math.abs(tile.position[2] - other.position[2]) < 1.4 && tile.position[0] > other.position[0] && Math.abs(tile.position[0] - other.position[0]) < 2.3) {
                    return true;
                }
                return false;
            });

            const hasRightNeighbor = tiles.some(other => {
                if (!other.matched && other.id !== tile.id && other.layer === tile.layer && Math.abs(tile.position[2] - other.position[2]) < 1.4 && tile.position[0] < other.position[0] && Math.abs(tile.position[0] - other.position[0]) < 2.3) {
                    return true;
                }
                return false;
            });

            if (hasLeftNeighbor) {
                console.log(`Tile ${tile.character} (ID: ${tile.id}) has a left neighbor.`);
            }
            if (hasRightNeighbor) {
                console.log(`Tile ${tile.character} (ID: ${tile.id}) has a right neighbor.`);
            }

            if (hasLeftNeighbor && hasRightNeighbor) {
                console.log(`Tile ${tile.character} (ID: ${tile.id}) is blocked horizontally.`);
                return true;
            }

            return false;
        }

        function processTileSelection(clickedTile: any) {
            console.log('Selected tiles before processing:', selectedTiles.map(t => t.character));
            if (selectedTiles.includes(clickedTile)) {
                selectedTiles = selectedTiles.filter(t => t !== clickedTile);
                clickedTile.selected = false;
                updateTileAppearance(clickedTile);
                console.log('Deselected tile. Selected tiles:', selectedTiles.map(t => t.character));
                return;
            }
            
            if (selectedTiles.length === 0) {
                selectedTiles.push(clickedTile);
                clickedTile.selected = true;
                updateTileAppearance(clickedTile);
                console.log('Selected first tile. Selected tiles:', selectedTiles.map(t => t.character));
                return;
            }
            
            if (selectedTiles.length === 1) {
                const firstTile = selectedTiles[0];
                console.log(`Comparing ${firstTile.character} with ${clickedTile.character}`);
                
                if (firstTile.character === clickedTile.character && firstTile.id !== clickedTile.id) { // Added ID check for robustness
                    console.log('Match found!');
                    playMatchSound();
                    score += 100;
                    updateScore();
                    
                    firstTile.matched = true;
                    clickedTile.matched = true;
                    
                    matchedPairs.push([firstTile, clickedTile]);
                    updateMatchedPairs();
                    
                    animateMatchedTiles(firstTile, clickedTile);
                    selectedTiles = [];
                    
                    setTimeout(() => { checkGameCompletion(); }, 1000);
                } else {
                    console.log('Not a match.');
                    firstTile.selected = false;
                    updateTileAppearance(firstTile);
                    clickedTile.selected = true;
                    updateTileAppearance(clickedTile);
                    selectedTiles = [clickedTile];
                }
                console.log('Selected tiles after processing:', selectedTiles.map(t => t.character));
            }
        }

        function updateTileAppearance(tile: any) {
            if (tile.selected) {
                tile.tileMesh.scale.setScalar(1.1);
                tile.tileMesh.material.emissive.setHex(0x444444);
            } else {
                tile.tileMesh.scale.setScalar(1);
                tile.tileMesh.material.emissive.setHex(0x000000);
            }
        }

        function animateMatchedTiles(tile1: any, tile2: any) {
            const fadeOut = (tile: any, delay: number) => {
                setTimeout(() => {
                    let opacity = 1;
                    const fadeInterval = setInterval(() => {
                        opacity -= 0.05;
                        if (tile.tileMesh.material) {
                            tile.tileMesh.material.transparent = true;
                            tile.tileMesh.material.opacity = opacity;
                        }
                        if (tile.textMesh.material) {
                            tile.textMesh.material.transparent = true;
                            tile.textMesh.material.opacity = opacity;
                        }
                        
                        if (opacity <= 0) {
                            clearInterval(fadeInterval);
                            scene.remove(tile.mesh);
                        }
                    }, 50);
                }, delay);
            };
            
            fadeOut(tile1, 500);
            fadeOut(tile2, 700);
        }

        function startGame() {
            gameStarted = true;
            if(tutorialRef.current) tutorialRef.current.style.display = 'none';
            gameTimer = setInterval(() => {
                gameTime++;
                updateTime();
            }, 1000);
        }

        function toggleMusic() {
            musicEnabled = !musicEnabled;
            if(musicBtnRef.current) musicBtnRef.current.textContent = `Music: ${musicEnabled ? 'ON' : 'OFF'}`;
            console.log(`Music ${musicEnabled ? 'enabled' : 'disabled'}`);
        }

        function shuffleTiles() {
            const unmatchedTiles = tiles.filter(tile => !tile.matched);
            const characters = unmatchedTiles.map(tile => tile.character);
            const shuffled = characters.sort(() => Math.random() - 0.5);
            
            unmatchedTiles.forEach((tile, index) => {
                tile.character = shuffled[index];
                tile.selected = false;
                updateTileAppearance(tile);
                
                const canvas = document.createElement('canvas');
                canvas.width = 128;
                canvas.height = 128;
                const context = canvas.getContext('2d')!;
                context.fillStyle = '#228B22'; // Green font color
                context.font = 'bold 50px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(tile.character, 64, 64);
                
                if (tile.textMesh.material.map) {
                    tile.textMesh.material.map.dispose();
                }
                const texture = new THREE.CanvasTexture(canvas);
                tile.textMesh.material.map = texture;
            });
            
            selectedTiles = [];
        }

        function restartGame() {
            score = 0;
            gameTime = 0;
            gameStarted = false;
            gameCompleted = false;
            selectedTiles = [];
            matchedPairs = [];
            
            if (gameTimer) {
                clearInterval(gameTimer);
                gameTimer = null;
            }
            
            updateScore();
            updateTime();
            updateMatchedPairs();
            if(tutorialRef.current) tutorialRef.current.style.display = 'block';
            if(completionModalRef.current) completionModalRef.current.classList.remove('show');
            
            createTiles();
        }

        function updateScore() {
            if(scoreValueRef.current) scoreValueRef.current.textContent = score.toString();
        }

        function updateTime() {
            const mins = Math.floor(gameTime / 60);
            const secs = gameTime % 60;
            if(timeValueRef.current) timeValueRef.current.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function updateMatchedPairs() {
            console.log('updateMatchedPairs called. matchedPairs:', matchedPairs);
            if(matchedListRef.current) {
                matchedListRef.current.innerHTML = '';
                matchedPairs.forEach((pair, index) => {
                    const div = document.createElement('div');
                    div.className = 'matched-pair';
                    div.innerHTML = `${pair[0].character} ✓ ${pair[1].character}`;
                    matchedListRef.current!.appendChild(div);
                });
            }
            if(matchesValueRef.current) matchesValueRef.current.textContent = matchedPairs.length.toString();
        }

        function checkGameCompletion() {
            const allMatched = tiles.every(tile => tile.matched);
            if (allMatched) {
                gameCompleted = true;
                if (gameTimer) clearInterval(gameTimer);
                
                if(finalScoreRef.current) finalScoreRef.current.textContent = score.toString();
                const mins = Math.floor(gameTime / 60);
                const secs = gameTime % 60;
                if(finalTimeRef.current) finalTimeRef.current.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                if(completionModalRef.current) completionModalRef.current.classList.add('show');

                // Update user progress for Mahjong game completion
                console.log('Attempting to update progress for mahjong-3d. Score:', score);
                updateModuleProgress('mahjong-3d', 'practice', 'completed', score);
                console.log('updateModuleProgress called.');
            }
        }

        function playClickSound() {
            console.log('Click sound');
        }

        function playMatchSound() {
            console.log('Match sound');
        }

        function playPronunciation(character: string) {
            console.log(`Pronouncing: ${character}`);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            if (cloudsGroup) {
                cloudsGroup.position.x = Math.sin(Date.now() * 0.0001) * 2;
            }
            
            renderer.render(scene, camera);
        }

        init();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('click', onMouseClick);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('touchstart', onTouchStart);
            musicBtnRef.current?.removeEventListener('click', toggleMusic);
            shuffleBtnRef.current?.removeEventListener('click', shuffleTiles);
            restartBtnRef.current?.removeEventListener('click', restartGame);
            playAgainBtnRef.current?.removeEventListener('click', restartGame);
            if (gameTimer) {
                clearInterval(gameTimer);
            }
            // Dispose of three.js objects
            scene.traverse(object => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            renderer.dispose();
        }

    }, []);

    return (
        <>
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: Arial, sans-serif;
                    overflow: hidden;
                    background: linear-gradient(to bottom, #87CEEB, #90EE90);
                }
                
                #gameContainer { position: relative; width: 100vw; height: 100vh; }
                #gameCanvas { display: block; cursor: pointer; }
                
                .ui-overlay {
                    position: absolute; top: 0; left: 0; right: 0; z-index: 10;
                    background: rgba(0, 0, 0, 0.2); color: white; padding: 1rem;
                }
                
                .ui-header {
                    display: flex; justify-content: space-between; align-items: center;
                    max-width: 1200px; margin: 0 auto;
                }
                
                .game-stats { display: flex; gap: 2rem; }
                .stat { font-size: 1.1rem; font-weight: bold; }
                .controls { display: flex; gap: 0.5rem; }
                
                .btn {
                    padding: 0.5rem 1rem; border: none; border-radius: 4px;
                    cursor: pointer; font-size: 0.9rem; font-weight: bold;
                    transition: background-color 0.2s;
                }
                
                .btn-blue { background: #3b82f6; color: white; }
                .btn-blue:hover { background: #2563eb; }
                .btn-yellow { background: #eab308; color: white; }
                .btn-yellow:hover { background: #ca8a04; }
                .btn-red { background: #ef4444; color: white; }
                .btn-red:hover { background: #dc2626; }
                
                .matched-panel {
                    position: absolute; right: 1rem; top: 5rem; bottom: 1rem; width: 12rem;
                    background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 1rem;
                    z-index: 10; color: white;
                }
                
                .matched-panel h3 { text-align: center; margin-bottom: 1rem; font-weight: bold; }
                .matched-list { max-height: calc(100% - 2rem); overflow-y: auto; }
                
                .matched-pair {
                    background: rgba(255, 255, 255, 0.8); border-radius: 4px;
                    padding: 0.5rem; margin-bottom: 0.5rem; text-align: center;
                    color: #228B22; font-weight: bold; font-size: 0.9rem;
                }
                
                .completion-modal {
                    position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5);
                    display: none; align-items: center; justify-content: center; z-index: 20;
                }
                
                .completion-modal.show { display: flex; }
                
                .modal-content {
                    background: white; border-radius: 8px; padding: 2rem;
                    text-align: center; max-width: 400px; margin: 1rem;
                }
                
                .modal-title {
                    font-size: 2rem; font-weight: bold; color: #16a34a; margin-bottom: 1rem;
                }
                
                .tutorial {
                    position: absolute; bottom: 1rem; left: 1rem;
                    background: rgba(0, 0, 0, 0.6); color: white;
                    padding: 1rem; border-radius: 8px; max-width: 400px;
                }
                
                @media (max-width: 768px) {
                    .ui-header { flex-direction: column; gap: 1rem; }
                    .game-stats { gap: 1rem; }
                    .matched-panel { width: 10rem; font-size: 0.9rem; }
                }
            `}</style>
            <div id="gameContainer" ref={gameContainerRef}>
                <div className="ui-overlay">
                    <div className="ui-header">
                        <div className="game-stats">
                            <div className="stat">Score: <span id="scoreValue" ref={scoreValueRef}>0</span></div>
                            <div className="stat">Time: <span id="timeValue" ref={timeValueRef}>0:00</span></div>
                            <div className="stat">Matches: <span id="matchesValue" ref={matchesValueRef}>0</span></div>
                        </div>
                        <div className="controls">
                            <button id="musicBtn" className="btn btn-blue" ref={musicBtnRef}>Music: ON</button>
                            <button id="shuffleBtn" className="btn btn-yellow" ref={shuffleBtnRef}>Shuffle</button>
                            <button id="restartBtn" className="btn btn-red" ref={restartBtnRef}>Restart</button>
                        </div>
                    </div>
                </div>
                
                <div className="matched-panel">
                    <h3>Matched Pairs</h3>
                    <div id="matchedList" className="matched-list" ref={matchedListRef}></div>
                </div>
                
                <canvas id="gameCanvas" ref={gameCanvasRef}></canvas>
                
                <div id="completionModal" className="completion-modal" ref={completionModalRef}>
                    <div className="modal-content">
                        <h2 className="modal-title">🎉 Congratulations! 🎉</h2>
                        <p>You completed the game!</p>
                        <p>Final Score: <span id="finalScore" ref={finalScoreRef}>0</span></p>
                        <p>Time: <span id="finalTime" ref={finalTimeRef}>0:00</span></p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                            <button id="playAgainBtn" className="btn btn-blue" style={{ padding: '0.75rem 1.5rem' }} ref={playAgainBtnRef}>Play Again</button>
                            <button id="nextLevelBtn" className="btn btn-yellow" style={{ padding: '0.75rem 1.5rem' }} ref={nextLevelBtnRef}>Next Level</button>
                        </div>
                    </div>
                </div>
                
                <div id="tutorial" className="tutorial" ref={tutorialRef}>
                    <h4>How to Play:</h4>
                    <p>Click on tiles with matching Malayalam characters. Only free tiles (not blocked by others) can be selected. Match all pairs to win!</p>
                </div>
            </div>
        </>
    );
};

export default Mahjong3DGame;