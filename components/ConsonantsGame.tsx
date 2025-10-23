'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Phaser from 'phaser';
import { consonants } from '@/lib/data';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { playAudio } from '@/lib/utils';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const MobileGameControls = ({ onUpPress, onUpRelease, onLeftPress, onLeftRelease, onRightPress, onRightRelease }) => (
    <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gray-800 bg-opacity-50 z-10">
        <div className="flex">
            <Button onTouchStart={onLeftPress} onTouchEnd={onLeftRelease} onMouseDown={onLeftPress} onMouseUp={onLeftRelease} className="px-8 py-4 text-lg mr-2">Left</Button>
            <Button onTouchStart={onRightPress} onTouchEnd={onRightRelease} onMouseDown={onRightPress} onMouseUp={onRightRelease} className="px-8 py-4 text-lg">Right</Button>
        </div>
        <Button onTouchStart={onUpPress} onTouchEnd={onUpRelease} onMouseDown={onUpPress} onMouseUp={onUpRelease} className="px-8 py-6 text-lg">Jump</Button>
    </div>
);

class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Group;
    private playerBody!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private bgFar!: Phaser.GameObjects.TileSprite;
    private bgNear!: Phaser.GameObjects.TileSprite;
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

        this.player = this.add.group();
        const body = this.add.rectangle(0, 0, 64, 48, 0xff0000);
        this.player.add(body);
        this.playerBody = body;
        this.physics.add.existing(this.playerBody);
        (this.playerBody.body as Phaser.Physics.Arcade.Body).setBounce(0.2).setCollideWorldBounds(true);

        const legs: Phaser.GameObjects.Rectangle[] = [];
        for (let i = 0; i < 6; i++) {
            const leg = this.add.rectangle(i < 3 ? -20 : 20, (i % 3) * 15 - 15, 20, 5, 0xff0000);
            this.player.add(leg);
            legs.push(leg);
        }

        this.player.setXY(100, 450);

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


    }

    update() {
        const externalInput = this.registry.get('externalInput') || { left: false, right: false, up: false };

        const moveLeft = this.cursors.left.isDown || externalInput.left;
        const moveRight = this.cursors.right.isDown || externalInput.right;
        const jump = this.cursors.up.isDown || externalInput.up;

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

        playAudio(`/audio/malayalam/consonants/${letterToReveal}.wav`);

        const style = { fontSize: '48px', fill: colorToUse, fontStyle: 'bold', stroke: '#fff', strokeThickness: 5 };
        this.add.text(x, 50, letterToReveal, style).setOrigin(0.5, 0.5);

        if (letterToReveal === 'റ') {
            const onGameComplete = this.registry.get('onGameComplete');
            if (onGameComplete) {
                this.time.delayedCall(1000, () => {
                    onGameComplete(true);
                });
            }
        }
    }
}

const ConsonantsGame: React.FC = () => {
    const router = useRouter();
    const { updateModuleProgress } = useProgress();
    const [gameCompleted, setGameCompleted] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const currentGameId = 'consonants-game';

    const gameContainer = useRef<HTMLDivElement>(null);
    const gameInstance = useRef<Phaser.Game | null>(null);

    const [inputState, setInputState] = useState({ left: false, right: false, up: false });

    const handleUpPress = () => setInputState(s => ({ ...s, up: true }));
    const handleUpRelease = () => setInputState(s => ({ ...s, up: false }));
    const handleLeftPress = () => setInputState(s => ({ ...s, left: true }));
    const handleLeftRelease = () => setInputState(s => ({ ...s, left: false }));
    const handleRightPress = () => setInputState(s => ({ ...s, right: true }));
    const handleRightRelease = () => setInputState(s => ({ ...s, right: false }));

    const handleGameComplete = useCallback((success: boolean) => {
        if (success) {
          updateModuleProgress(currentGameId, 'practice', 'completed', 100);
          setWasSuccessful(true);
        }
        setGameCompleted(true);
    }, [currentGameId, updateModuleProgress]);

    useEffect(() => {
        if (gameInstance.current) {
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

        gameInstance.current.registry.set('onGameComplete', handleGameComplete);
        gameInstance.current.registry.set('externalInput', inputState);
        gameInstance.current.scene.start('GameScene', { levelData, platformData, worldWidth });

        return () => {
            gameInstance.current?.destroy(true);
            gameInstance.current = null;
        };
    }, [handleGameComplete, inputState]);

    if (gameCompleted) {
        return (
            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-emerald-400 mb-4">
                    {wasSuccessful ? 'Congratulations!' : 'Game Over'}
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                    {wasSuccessful ? "You've completed the Consonants Adventure!" : "Better luck next time!"}
                </p>
                <Button 
                    onClick={() => router.push(`/games?completed=${currentGameId}`)}
                    className="px-8 py-3 text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
                    Go to Games Page
                </Button>
            </div>
        );
    }

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