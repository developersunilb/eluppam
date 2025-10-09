'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Phaser from 'phaser';
import { consonants } from '@/lib/data';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { playAudio } from '@/lib/utils';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import MobileGameControls from './MobileGameControls';

interface ConsonantsGameProps {
  onComplete: (success: boolean) => void;
}

class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Group;
    private playerBody!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private bgFar!: Phaser.GameObjects.TileSprite;
    private bgNear!: Phaser.GameObjects.TileSprite;
    private externalInput: { moveLeft: boolean; moveRight: boolean; jump: boolean; } = { moveLeft: false, moveRight: false, jump: false };
    private worldWidth!: number;
    private levelData!: { x: number; y: number; letter: string; color: string; }[];
    private platformData!: { x: number; y: number; scale: number; }[];

    constructor() { super({ key: 'GameScene' }); }

    init(data: any) {
        this.worldWidth = data.worldWidth;
        this.levelData = data.levelData;
        this.platformData = data.platformData;
    }

    preload() {

        this.load.svg('letter_collectible', '/game/assets/image/letter_collectible.svg', { width: 32, height: 32 });
        this.load.svg('ground', '/game/assets/image/ground.svg', { width: 800, height: 64 });
        this.load.svg('hills-far', '/game/assets/image/hills-far.svg', { width: 800, height: 600 });
        this.load.svg('hills-near', '/game/assets/image/hills-near.svg', { width: 800, height: 600 });
    }

    create() {
        this.physics.world.setBounds(0, 0, this.worldWidth, 600);

        this.bgFar = this.add.tileSprite(0, 0, this.worldWidth, 600, 'hills-far').setOrigin(0, 0).setScrollFactor(0.25);
        this.bgNear = this.add.tileSprite(0, 0, this.worldWidth, 600, 'hills-near').setOrigin(0, 0).setScrollFactor(0.5);

        const platforms = this.physics.add.staticGroup();
        
        const groundSpriteWidth = 800;
        for (let x = 0; x < this.worldWidth; x += groundSpriteWidth) {
            platforms.create(x, 568, 'ground').setOrigin(0, 0).refreshBody();
        }

        this.platformData.forEach(p => {
            platforms.create(p.x, p.y, 'ground').setScale(p.scale, 1).refreshBody();
        });

        // Create a placeholder crab
        this.player = this.add.group();
        const body = this.add.rectangle(0, 0, 64, 48, 0xff0000);
        this.player.add(body);
        this.playerBody = body; // Store the body rectangle
        this.physics.add.existing(this.playerBody); // Add physics to the body rectangle
        (this.playerBody.body as Phaser.Physics.Arcade.Body).setBounce(0.2).setCollideWorldBounds(true);

        const legs: Phaser.GameObjects.Rectangle[] = [];
        for (let i = 0; i < 6; i++) {
            const leg = this.add.rectangle(i < 3 ? -20 : 20, (i % 3) * 15 - 15, 20, 5, 0xff0000);
            this.player.add(leg);
            legs.push(leg);
        }

        const collectibles = this.physics.add.group();
        this.levelData.forEach(data => {
            const collectible = this.physics.add.sprite(data.x, data.y, 'letter_collectible');
            collectibles.add(collectible);
            const colorObject = Phaser.Display.Color.ValueToColor(data.color);
            collectible.setTint(Phaser.Display.Color.GetColor(colorObject.red, colorObject.green, colorObject.blue));
            collectible.setData({ letter: data.letter, color: data.color });
            (collectible.body as Phaser.Physics.Arcade.Body).setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
        });

        this.physics.add.collider(collectibles, platforms);

        this.cursors = this.input.keyboard!.createCursorKeys();
        this.cameras.main.setBounds(0, 0, this.worldWidth, 600).startFollow(this.playerBody, true, 0.08, 0.08);

        this.physics.add.collider(this.playerBody, platforms);
        this.physics.add.overlap(this.playerBody, collectibles, this.collectLetter, undefined, this);

        // Get external input state from registry
        this.registry.events.on('changedata-externalInput', (parent: any, key: string, data: any) => {
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
            (this.playerBody.body as Phaser.Physics.Arcade.Body).setVelocityX(-200);
        } else if (moveRight) {
            (this.playerBody.body as Phaser.Physics.Arcade.Body).setVelocityX(200);
        } else {
            (this.playerBody.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        }

        if (jump && this.playerBody.body && (this.playerBody.body as Phaser.Physics.Arcade.Body).touching.down) {
            (this.playerBody.body as Phaser.Physics.Arcade.Body).setVelocityY(-350);
        }

        // Animate the legs
        const legs = this.player.getChildren().slice(1) as Phaser.GameObjects.Rectangle[];
        if (moveLeft || moveRight) {
            legs.forEach((leg, i) => {
                leg.x = (i < 3 ? -20 : 20) + Math.sin(this.time.now / 100 + i) * 5;
            });
        }

        this.bgFar.tilePositionX = this.cameras.main.scrollX * 0.25;
        this.bgNear.tilePositionX = this.cameras.main.scrollX * 0.5;
    }

    private collectLetter(player: any, letter: any) {
        const collectible = letter as Phaser.Physics.Arcade.Sprite;
        if (!collectible.active) return;

        const letterToReveal = collectible.getData('letter') as string;
        const colorToUse = collectible.getData('color') as string;
        const x = collectible.x;

        collectible.disableBody(true, true);

        // Play audio for the collected consonant
        playAudio(`/audio/malayalam/consonants/${letterToReveal}.wav`);

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

const ConsonantsGame: React.FC<ConsonantsGameProps> = ({ onComplete }) => {
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

        const generateColorPalette = (numColors: number): string[] => {
            const palette: string[] = [];
            for (let i = 0; i < numColors; i++) {
                const hue = i / numColors;
                const color = Phaser.Display.Color.HSLToColor(hue, 0.8, 0.6);
                palette.push(Phaser.Display.Color.RGBToString(color.red, color.green, color.blue));
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

            consonants.forEach((letterObj, index) => {
                const x = startX + (index * stepX);
                let y = groundY;

                if (index % 5 === 1) y = platformY1;
                if (index % 5 === 2) y = platformY2;
                if (index % 5 === 3) y = platformY1;

                levelData.push({ x, y, letter: letterObj.consonant, color: aphabetColors[index] });

                if (y !== groundY) {
                    platformData.push({ x: x, y: y + 80, scale: 0.3 });
                }
            });

            return { levelData, platformData };
        };

        const { levelData, platformData } = generateLevelData();
        const worldWidth = 200 + (consonants.length * 180) + 200;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameContainer.current || undefined,
            backgroundColor: '#87ceeb',
            physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 300 }, debug: false } },
            scene: [GameScene]
        };
        gameInstance.current = new Phaser.Game(config);

        // Set the onComplete callback and input state in the game registry
        gameInstance.current.registry.set('onGameComplete', onComplete);
        gameInstance.current.registry.set('externalInput', inputState);
        gameInstance.current.scene.start('GameScene', { levelData, platformData, worldWidth });


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

export default ConsonantsGame;