'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { consonants } from '@/lib/data';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { playAudio } from '../lib/utils';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import MobileGameControls from './MobileGameControls';

interface MaveliGameProps {
  onComplete: (success: boolean) => void;
}

// --- Data Generation ---

const generateColorPalette = (numColors: number): string[] => {
    const palette: string[] = [];
    for (let i = 0; i < numColors; i++) {
        const hue = i / numColors;
        const color = Phaser.Display.Color.HSLToColor(hue, 0.8, 0.6);
        palette.push(Phaser.Display.Color.RGBToString(color.r, color.g, color.b));
    }
    return palette;
};

const aphabetColors = generateColorPalette(consonants.length);

const generateLevelData = () => {
    const levelData: { x: number; y: number; letter: string; color: string; }[] = [];
    const platformData: { x: number; y: number; scale: number; }[] = [];

    const startX = 200;
    const stepX = 180;
    const groundY = 500;
    const platformY1 = 380;
    const platformY2 = 260;

    consonants.forEach((letter, index) => {
        const x = startX + (index * stepX);
        let y = groundY;

        if (index % 5 === 1) y = platformY1;
        if (index % 5 === 2) y = platformY2;
        if (index % 5 === 3) y = platformY1;

        levelData.push({ x, y, letter, color: aphabetColors[index] });

        if (y !== groundY) {
            platformData.push({ x: x, y: y + 80, scale: 0.3 });
        }
    });

    return { levelData, platformData };
};

const { levelData, platformData } = generateLevelData();
const worldWidth = 200 + (consonants.length * 180) + 200;

class GameScene extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private bgFar!: Phaser.GameObjects.TileSprite;
    private bgNear!: Phaser.GameObjects.TileSprite;
    private externalInput: { moveLeft: boolean; moveRight: boolean; jump: boolean; } = { moveLeft: false, moveRight: false, jump: false };

    constructor() { super({ key: 'GameScene' }); }

    preload() {
        this.load.spritesheet('mahabali', '/game/assets/image/mahabali_spritesheet.svg', { frameWidth: 64, frameHeight: 96 });
        this.load.svg('letter_collectible', '/game/assets/image/letter_collectible.svg', { width: 32, height: 32 });
        this.load.svg('ground', '/game/assets/image/ground.svg', { width: 800, height: 64 });
        this.load.svg('hills-far', '/game/assets/image/hills-far.svg', { width: 800, height: 600 });
        this.load.svg('hills-near', '/game/assets/image/hills-near.svg', { width: 800, height: 600 });
    }

    create() {
        this.physics.world.setBounds(0, 0, worldWidth, 600);

        this.bgFar = this.add.tileSprite(0, 0, worldWidth, 600, 'hills-far').setOrigin(0, 0).setScrollFactor(0.25);
        this.bgNear = this.add.tileSprite(0, 0, worldWidth, 600, 'hills-near').setOrigin(0, 0).setScrollFactor(0.5);

        const platforms = this.physics.add.staticGroup();
        
        const groundSpriteWidth = 800;
        for (let x = 0; x < worldWidth; x += groundSpriteWidth) {
            platforms.create(x, 568, 'ground').setOrigin(0, 0).refreshBody();
        }

        platformData.forEach(p => {
            platforms.create(p.x, p.y, 'ground').setScale(p.scale, 1).refreshBody();
        });

        this.player = this.physics.add.sprite(100, 450, 'mahabali');
        this.player.setBounce(0.2).setCollideWorldBounds(true);

        this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('mahabali', { start: 0, end: 1 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [ { key: 'mahabali', frame: 0 } ], frameRate: 20 });

        const collectibles = this.physics.add.group();
        levelData.forEach(data => {
            const collectible = this.physics.add.sprite(data.x, data.y, 'letter_collectible');
            collectibles.add(collectible);
            const colorObject = Phaser.Display.Color.ValueToColor(data.color);
            collectible.setTint(Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b));
            collectible.setData({ letter: data.letter, color: data.color });
            (collectible.body as Phaser.Physics.Arcade.Body).setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
        });

        this.physics.add.collider(collectibles, platforms);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.setBounds(0, 0, worldWidth, 600).startFollow(this.player, true, 0.08, 0.08);

        this.physics.add.collider(this.player, platforms);
        this.physics.add.overlap(this.player, collectibles, this.collectLetter, undefined, this);

        // Get external input state from registry
        this.registry.events.on('changedata-externalInput', (parent, key, data) => {
            if (key === 'externalInput') {
                this.externalInput = data;
            }
        });
    }

    update() {
        // Combine keyboard input and external input
        const moveLeft = this.cursors.left.isDown || this.externalInput.moveLeft;
        const moveRight = this.cursors.right.isDown || this.externalInput.moveRight;
        const jump = this.cursors.up.isDown || this.externalInput.jump;

        if (moveLeft) {
            this.player.setVelocityX(-200).setFlipX(true).anims.play('walk', true);
        } else if (moveRight) {
            this.player.setVelocityX(200).setFlipX(false).anims.play('walk', true);
        } else {
            this.player.setVelocityX(0).anims.play('turn');
        }

        if (jump && this.player.body.touching.down) {
            this.player.setVelocityY(-350);
        }

        this.bgFar.tilePositionX = this.cameras.main.scrollX * 0.25;
        this.bgNear.tilePositionX = this.cameras.main.scrollX * 0.5;
    }

    private collectLetter(player: Phaser.GameObjects.GameObject, letter: Phaser.GameObjects.GameObject) {
        const collectible = letter as Phaser.Physics.Arcade.Sprite;
        if (!collectible.active) return;

        const letterToReveal = collectible.getData('letter') as string;
        const colorToUse = collectible.getData('color') as string;
        const x = collectible.x;

        collectible.disableBody(true, true);

        const style = { fontSize: '48px', fill: colorToUse, fontStyle: 'bold', stroke: '#fff', strokeThickness: 5 };
        this.add.text(x, 50, letterToReveal, style).setOrigin(0.5, 0.5);

        // Check if it's the last letter
        if (letterToReveal === 'റ') {
            const onGameComplete = this.registry.get('onGameComplete');
            if (onGameComplete) {
                // Add a small delay for effect before calling complete
                this.time.delayedCall(1000, () => {
                    onGameComplete(true);
                });
            }
        }
    }
}

const MaveliGame: React.FC<MaveliGameProps> = ({ onComplete }) => {
    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    const [inputState, setInputState] = useState({
        moveLeft: false,
        moveRight: false,
        jump: false,
    });

    const handleLeftPress = useCallback(() => setInputState(prev => ({ ...prev, moveLeft: true })), []);
    const handleLeftRelease = useCallback(() => setInputState(prev => ({ ...prev, moveLeft: false })), []);
    const handleRightPress = useCallback(() => setInputState(prev => ({ ...prev, moveRight: true })), []);
    const handleRightRelease = useCallback(() => setInputState(prev => ({ ...prev, moveRight: false })), []);
    const handleUpPress = useCallback(() => setInputState(prev => ({ ...prev, jump: true })), []);
    const handleUpRelease = useCallback(() => setInputState(prev => ({ ...prev, jump: false })), []);

    useEffect(() => {
        if (gameInstance.current) {
            // Update registry with latest inputState
            gameInstance.current.registry.set('externalInput', inputState);
            return;
        }

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current || undefined,
            backgroundColor: '#87ceeb',
            physics: { default: 'arcade', arcade: { gravity: { y: 300 }, debug: false } },
            scene: [GameScene]
        };
        gameInstance.current = new Phaser.Game(config);

        // Set the onComplete callback and input state in the game registry
        gameInstance.current.registry.set('onGameComplete', onComplete);
        gameInstance.current.registry.set('externalInput', inputState);


        return () => {
            gameInstance.current?.destroy(true);
            gameInstance.current = null;
        };
    }, [onComplete, inputState]);

    return (
        <div ref={gameContainer} id="phaser-game-container">
            <MobileGameControls
                onUpPress={handleUpPress}
                onUpRelease={handleUpRelease}
                onLeftPress={handleLeftPress}
                onLeftRelease={handleLeftRelease}
                onRightPress={handleRightPress}
                onRightRelease={handleRightRelease}
            />
        </div>
    );
};

export default MaveliGame;
