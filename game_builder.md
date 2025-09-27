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


Below is the entire code. Go through it and See if we can replace and implement it as the code for F:\Startup Business\Solopreneur\eluppam\components\Mahjong3D.tsx

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Malayalam Mahjong 3D</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <style>
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
            color: #1e40af; font-weight: bold; font-size: 1.2rem;
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
        
        .tutorial h4 { font-weight: bold; margin-bottom: 0.5rem; }
        .tutorial p { font-size: 0.9rem; line-height: 1.4; }
        
        @media (max-width: 768px) {
            .ui-header { flex-direction: column; gap: 1rem; }
            .game-stats { gap: 1rem; }
            .matched-panel { width: 10rem; font-size: 0.9rem; }
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <div class="ui-overlay">
            <div class="ui-header">
                <div class="game-stats">
                    <div class="stat">Score: <span id="scoreValue">0</span></div>
                    <div class="stat">Time: <span id="timeValue">0:00</span></div>
                    <div class="stat">Matches: <span id="matchesValue">0</span></div>
                </div>
                <div class="controls">
                    <button id="musicBtn" class="btn btn-blue">Music: ON</button>
                    <button id="shuffleBtn" class="btn btn-yellow">Shuffle</button>
                    <button id="restartBtn" class="btn btn-red">Restart</button>
                </div>
            </div>
        </div>
        
        <div class="matched-panel">
            <h3>Matched Pairs</h3>
            <div id="matchedList" class="matched-list"></div>
        </div>
        
        <canvas id="gameCanvas"></canvas>
        
        <div id="completionModal" class="completion-modal">
            <div class="modal-content">
                <h2 class="modal-title">🎉 Congratulations! 🎉</h2>
                <p>You completed the game!</p>
                <p>Final Score: <span id="finalScore">0</span></p>
                <p>Time: <span id="finalTime">0:00</span></p>
                <button id="playAgainBtn" class="btn btn-blue" style="padding: 0.75rem 1.5rem; margin-top: 1rem;">Play Again</button>
            </div>
        </div>
        
        <div id="tutorial" class="tutorial">
            <h4>How to Play:</h4>
            <p>Click on tiles with matching Malayalam characters. Only free tiles (not blocked by others) can be selected. Match all pairs to win!</p>
        </div>
    </div>

    <script>
        const MALAYALAM_CHARACTERS = [
            'അ', 'ആ', 'ഇ', 'ഈ', 'ഉ', 'ഊ', 'എ', 'ഏ', 'ഐ', 'ഒ', 'ഓ', 'ഔ',
            'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ', 'ഝ', 'ഞ', 'ട', 'ഠ'
        ];

        let scene, camera, renderer, raycaster, mouse;
        let tiles = [], selectedTiles = [], matchedPairs = [];
        let score = 0, gameTime = 0, gameStarted = false, gameCompleted = false;
        let musicEnabled = true, gameTimer, cloudsGroup;

        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.Fog(0x87CEEB, 30, 100);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 15, 15);
            camera.lookAt(0, 0, 0);

            const canvas = document.getElementById('gameCanvas');
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            setupLighting();
            createEnvironment();
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

        function createEnvironment() {
            const groundGeometry = new THREE.PlaneGeometry(50, 50);
            const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -2;
            ground.receiveShadow = true;
            scene.add(ground);

            for (let i = 0; i < 8; i++) {
                const treeGroup = new THREE.Group();
                const angle = i * Math.PI / 4;
                treeGroup.position.set(Math.cos(angle) * 15, -2, Math.sin(angle) * 15);

                const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 8);
                const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
                trunk.position.y = 4;
                trunk.castShadow = true;
                treeGroup.add(trunk);

                for (let j = 0; j < 8; j++) {
                    const frondGeometry = new THREE.BoxGeometry(0.2, 4, 0.1);
                    const frondMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
                    const frond = new THREE.Mesh(frondGeometry, frondMaterial);
                    const frondAngle = j * Math.PI / 4;
                    frond.position.set(Math.cos(frondAngle) * 2, 8, Math.sin(frondAngle) * 2);
                    frond.rotation.y = frondAngle;
                    frond.castShadow = true;
                    treeGroup.add(frond);
                }
                scene.add(treeGroup);
            }

            const houseGroup = new THREE.Group();
            houseGroup.position.set(-20, -2, -10);
            const houseGeometry = new THREE.BoxGeometry(8, 4, 6);
            const houseMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
            const house = new THREE.Mesh(houseGeometry, houseMaterial);
            house.position.y = 2;
            house.castShadow = true;
            houseGroup.add(house);
            scene.add(houseGroup);

            const waterGeometry = new THREE.PlaneGeometry(30, 15);
            const waterMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1, transparent: true, opacity: 0.7 });
            const water = new THREE.Mesh(waterGeometry, waterMaterial);
            water.rotation.x = -Math.PI / 2;
            water.position.set(15, -1.9, 0);
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

            const characters = MALAYALAM_CHARACTERS.slice(0, 15);
            const pairs = [...characters, ...characters];
            const shuffled = pairs.sort(() => Math.random() - 0.5);

            let index = 0;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 4; col++) {
                    if (index < shuffled.length) {
                        createTile(`tile_${index}`, shuffled[index], [col * 2.2 - 3.3, 0, row * 2.2 - 2.2], 0, row, col);
                        index++;
                    }
                }
            }

            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 3; col++) {
                    if (index < shuffled.length) {
                        createTile(`tile_${index}`, shuffled[index], [col * 2.2 - 2.2, 0.6, row * 2.2 - 1.1], 1, row, col);
                        index++;
                    }
                }
            }
        }

        function createTile(id, character, position, layer, row, col) {
            const tileGroup = new THREE.Group();
            
            const tileGeometry = new THREE.BoxGeometry(2, 0.4, 1.4);
            const tileMaterial = new THREE.MeshLambertMaterial({ color: 0xf5f5dc });
            const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
            tileMesh.castShadow = true;
            tileMesh.receiveShadow = true;
            
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            context.fillStyle = '#8B4513';
            context.font = 'bold 80px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(character, 64, 64);
            
            const texture = new THREE.CanvasTexture(canvas);
            const textMaterial = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
            
            const textGeometry = new THREE.PlaneGeometry(1.8, 1.2);
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.rotation.x = -Math.PI / 2;
            textMesh.position.y = 0.21;
            
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
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('click', onMouseClick);
            window.addEventListener('resize', onWindowResize);
            
            document.getElementById('musicBtn').addEventListener('click', toggleMusic);
            document.getElementById('shuffleBtn').addEventListener('click', shuffleTiles);
            document.getElementById('restartBtn').addEventListener('click', restartGame);
            document.getElementById('playAgainBtn').addEventListener('click', restartGame);
            
            window.addEventListener('touchstart', onTouchStart);
        }

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        function onMouseClick() { handleTileClick(); }

        function onTouchStart(event) {
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
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
                
                if (clickedTile && !isTileBlocked(clickedTile)) {
                    if (!gameStarted) startGame();
                    playClickSound();
                    playPronunciation(clickedTile.character);
                    processTileSelection(clickedTile);
                }
            }
        }

        function isTileBlocked(tile) {
            return tiles.some(otherTile => {
                if (otherTile.id === tile.id || otherTile.matched) return false;
                if (otherTile.layer > tile.layer) {
                    const dx = Math.abs(otherTile.position[0] - tile.position[0]);
                    const dz = Math.abs(otherTile.position[2] - tile.position[2]);
                    return dx < 2 && dz < 2;
                }
                if (otherTile.layer === tile.layer) {
                    const dx = Math.abs(otherTile.position[0] - tile.position[0]);
                    const dz = Math.abs(otherTile.position[2] - tile.position[2]);
                    if (Math.abs(tile.position[0] - otherTile.position[0]) === 2.2 && dz < 1) return true;
                }
                return false;
            });
        }

        function processTileSelection(clickedTile) {
            if (selectedTiles.includes(clickedTile)) {
                selectedTiles = selectedTiles.filter(t => t !== clickedTile);
                clickedTile.selected = false;
                updateTileAppearance(clickedTile);
                return;
            }
            
            if (selectedTiles.length === 0) {
                selectedTiles.push(clickedTile);
                clickedTile.selected = true;
                updateTileAppearance(clickedTile);
                return;
            }
            
            if (selectedTiles.length === 1) {
                const firstTile = selectedTiles[0];
                
                if (firstTile.character === clickedTile.character) {
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
                    firstTile.selected = false;
                    updateTileAppearance(firstTile);
                    clickedTile.selected = true;
                    updateTileAppearance(clickedTile);
                    selectedTiles = [clickedTile];
                }
            }
        }

        function updateTileAppearance(tile) {
            if (tile.selected) {
                tile.tileMesh.scale.setScalar(1.1);
                tile.tileMesh.material.emissive.setHex(0x444444);
            } else {
                tile.tileMesh.scale.setScalar(1);
                tile.tileMesh.material.emissive.setHex(0x000000);
            }
        }

        function animateMatchedTiles(tile1, tile2) {
            const fadeOut = (tile, delay) => {
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
            document.getElementById('tutorial').style.display = 'none';
            gameTimer = setInterval(() => {
                gameTime++;
                updateTime();
            }, 1000);
        }

        function toggleMusic() {
            musicEnabled = !musicEnabled;
            document.getElementById('musicBtn').textContent = `Music: ${musicEnabled ? 'ON' : 'OFF'}`;
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
                const context = canvas.getContext('2d');
                context.fillStyle = '#8B4513';
                context.font = 'bold 80px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(tile.character, 64, 64);
                
                const texture = new THREE.CanvasTexture(canvas);
                tile.textMesh.material.map = texture;
                tile.textMesh.material.needsUpdate = true;
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
            document.getElementById('tutorial').style.display = 'block';
            document.getElementById('completionModal').classList.remove('show');
            
            createTiles();
        }

        function updateScore() {
            document.getElementById('scoreValue').textContent = score;
        }

        function updateTime() {
            const mins = Math.floor(gameTime / 60);
            const secs = gameTime % 60;
            document.getElementById('timeValue').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function updateMatchedPairs() {
            const matchedList = document.getElementById('matchedList');
            matchedList.innerHTML = '';
            matchedPairs.forEach((pair, index) => {
                const div = document.createElement('div');
                div.className = 'matched-pair';
                div.innerHTML = `${pair[0].character} ✓ ${pair[1].character}`;
                matchedList.appendChild(div);
            });
            document.getElementById('matchesValue').textContent = matchedPairs.length;
        }

        function checkGameCompletion() {
            const allMatched = tiles.every(tile => tile.matched);
            if (allMatched) {
                gameCompleted = true;
                if (gameTimer) clearInterval(gameTimer);
                
                document.getElementById('finalScore').textContent = score;
                const mins = Math.floor(gameTime / 60);
                const secs = gameTime % 60;
                document.getElementById('finalTime').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                document.getElementById('completionModal').classList.add('show');
            }
        }

        function playClickSound() {
            console.log('Click sound');
        }

        function playMatchSound() {
            console.log('Match sound');
        }

        function playPronunciation(character) {
            console.log(`Pronouncing: ${character}`);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            if (cloudsGroup) {
                cloudsGroup.position.x = Math.sin(Date.now() * 0.0001) * 2;
            }
            
            renderer.render(scene, camera);
        }

        window.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>