// components/ImageMapEditor.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LOCATIONS, GameObject } from '@/lib/game-data';
import toast from 'react-hot-toast'; // Import toast for user feedback

const CLOSING_THRESHOLD = 10; // pixels

export default function ImageMapEditor() {
    const [selectedLocationId, setSelectedLocationId] = useState<string>(LOCATIONS[0].id);
    const [shapes, setShapes] = useState<any[]>([]);
    const [drawMode, setDrawMode] = useState<'rect' | 'poly' | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [currentShape, setCurrentShape] = useState<any | null>(null);
    const [currentPolygonPoints, setCurrentPolygonPoints] = useState<number[][]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedObjectId, setSelectedObjectId] = useState<string>('');
    const [previewPoint, setPreviewPoint] = useState<{x: number, y: number} | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const selectedLocation = LOCATIONS.find(loc => loc.id === selectedLocationId);

    // Load existing shapes for the selected location on mount and when location changes
    useEffect(() => {
        const loadShapes = async () => {
            try {
                const res = await fetch('/game-maps.json');
                const data = await res.json();
                setShapes(data[selectedLocationId] || []);
            } catch (error) {
                console.error('Failed to load game maps:', error);
                setShapes([]);
            }
        };
        loadShapes();
    }, [selectedLocationId]);

    const handleSave = useCallback(async () => {
        try {
            const allMapsRes = await fetch('/game-maps.json');
            const allMaps = await allMapsRes.json();
            
            const updatedMaps = {
                ...allMaps,
                [selectedLocationId]: shapes
            };

            const res = await fetch('/api/save-game-map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMaps),
            });

            if (res.ok) {
                toast.success('Shapes saved successfully!');
            } else {
                toast.error('Failed to save shapes.');
                console.error('Save failed:', await res.text());
            }
        } catch (error) {
            toast.error('An error occurred during saving.');
            console.error('Save error:', error);
        }
    }, [selectedLocationId, shapes]);

    const handleClearShapes = () => {
        if (window.confirm('Are you sure you want to clear all shapes for this location?')) {
            setShapes([]);
            toast.success('Shapes cleared locally. Remember to save!');
        }
    };

    const getMousePos = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const CTM = svg.getScreenCTM();
        if (CTM) {
            return pt.matrixTransform(CTM.inverse());
        }
        return null;
    };

    const finishPolygon = () => {
        if (drawMode !== 'poly' || currentPolygonPoints.length < 3) return;

        const newShape = {
            type: 'poly',
            points: currentPolygonPoints,
        };
        setCurrentShape(newShape);
        setIsModalOpen(true);
        setCurrentPolygonPoints([]);
        setPreviewPoint(null);
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!drawMode) return;
        const point = getMousePos(e);
        if (!point) return;

        if (drawMode === 'rect') {
            setDrawing(true);
            setStartPoint(point);
            setCurrentShape({
                type: 'rect',
                x: point.x,
                y: point.y,
                width: 0,
                height: 0,
            });
        } else if (drawMode === 'poly') {
            if (currentPolygonPoints.length > 2) {
                const firstPoint = currentPolygonPoints[0];
                const dx = firstPoint[0] - point.x;
                const dy = firstPoint[1] - point.y;
                if (Math.sqrt(dx * dx + dy * dy) < CLOSING_THRESHOLD) {
                    finishPolygon();
                    return;
                }
            }
            setCurrentPolygonPoints(prev => [...prev, [point.x, point.y]]);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const point = getMousePos(e);
        if (!point) return;

        if (drawMode === 'rect' && drawing && startPoint && currentShape) {
            const newWidth = Math.abs(point.x - startPoint.x);
            const newHeight = Math.abs(point.y - startPoint.y);
            const newX = Math.min(point.x, startPoint.x);
            const newY = Math.min(point.y, startPoint.y);

            setCurrentShape({
                ...currentShape,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
            });
        } else if (drawMode === 'poly' && currentPolygonPoints.length > 0) {
            setPreviewPoint(point);
        }
    };

    const handleMouseUp = () => {
        if (drawMode === 'rect' && drawing) {
            setDrawing(false);
            setStartPoint(null);
            
            if (currentShape.width > 0 && currentShape.height > 0) {
                setIsModalOpen(true);
            } else {
                setCurrentShape(null);
            }
        }
    };

    const handleDoubleClick = () => {
        finishPolygon();
    };

    const handleModalSave = () => {
        if (!selectedObjectId || !currentShape || !imageSize.width || !imageSize.height) return;
        
        let shapeToSave = { ...currentShape, objectId: selectedObjectId };

        if (shapeToSave.type === 'rect') {
            shapeToSave.x = (shapeToSave.x / imageSize.width) * 100;
            shapeToSave.y = (shapeToSave.y / imageSize.height) * 100;
            shapeToSave.width = (shapeToSave.width / imageSize.width) * 100;
            shapeToSave.height = (shapeToSave.height / imageSize.height) * 100;
        } else if (shapeToSave.type === 'poly') {
            shapeToSave.points = shapeToSave.points.map(([x, y]: number[]) => [
                (x / imageSize.width) * 100,
                (y / imageSize.height) * 100,
            ]);
        }

        setShapes(prev => [...prev, shapeToSave]);
        
        setIsModalOpen(false);
        setSelectedObjectId('');
        setCurrentShape(null);
        setPreviewPoint(null);
        // Keep the drawMode active
    };        return (
            <div className="border rounded-lg p-4">
                {/* Toolbar */}
                <div className="flex items-center gap-4 mb-4 p-2 bg-gray-100 rounded-md">
                    <div className="flex items-center gap-2">
                        <label htmlFor="location-select" className="font-semibold">Location:</label>
                        <select
                            id="location-select"
                            value={selectedLocationId}
                            onChange={(e) => setSelectedLocationId(e.target.value)}
                            className="p-2 border rounded-md"
                        >
                            {LOCATIONS.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={() => setDrawMode('rect')} variant={drawMode === 'rect' ? 'default' : 'outline'}>
                        Draw Rectangle
                    </Button>
                    <Button onClick={() => setDrawMode('poly')} variant={drawMode === 'poly' ? 'default' : 'outline'}>
                        Draw Polygon
                    </Button>
                                    <Button onClick={handleSave} variant="secondary">
                                        Save Shapes
                                    </Button>
                                    <Button onClick={handleClearShapes} variant="destructive">
                                        Clear All Shapes
                                    </Button>
                                </div>    
                {/* Editor Area */}
                {selectedLocation && (
                    <div className="relative w-full aspect-video border">
                                            <img
                                                ref={imageRef}
                                                src={selectedLocation.image}
                                                alt={selectedLocation.name}
                                                className="w-full h-full object-contain"
                                                onLoad={() => {
                                                    if (imageRef.current) {
                                                        setImageSize({
                                                            width: imageRef.current.offsetWidth,
                                                            height: imageRef.current.offsetHeight,
                                                        });
                                                    }
                                                }}
                                            />
                        <svg
                            className="absolute inset-0 w-full h-full"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onDoubleClick={handleDoubleClick}
                        >
                            {/* Render saved shapes */}
                            {shapes.map((shape, index) => {
                                if (shape.type === 'rect') {
                                    return (
                                        <rect
                                            key={index}
                                            x={shape.x}
                                            y={shape.y}
                                            width={shape.width}
                                            height={shape.height}
                                            className="fill-blue-500 fill-opacity-50 stroke-blue-700 stroke-2"
                                        />
                                    );
                                }
                                if (shape.type === 'poly') {
                                    return (
                                        <polygon
                                            key={index}
                                            points={shape.points.map((p: number[]) => p.join(',')).join(' ')}
                                            className="fill-purple-500 fill-opacity-50 stroke-purple-700 stroke-2"
                                        />
                                    );
                                }
                                return null;
                            })}
                            {/* Render current drawing shape */}
                            {currentShape && currentShape.type === 'rect' && (
                                <rect
                                    x={currentShape.x}
                                    y={currentShape.y}
                                    width={currentShape.width}
                                    height={currentShape.height}
                                    className="fill-green-500 fill-opacity-50 stroke-green-700 stroke-2"
                                />
                            )}
                            {/* Render current drawing polygon */}
                            {currentPolygonPoints.length > 0 && (
                                <polyline
                                    points={currentPolygonPoints.map(p => p.join(',')).join(' ')}
                                    className="fill-none stroke-green-700 stroke-2"
                                />
                            )}
                            {/* Render preview line for polygon */}
                            {previewPoint && currentPolygonPoints.length > 0 && (
                                <line
                                    x1={currentPolygonPoints[currentPolygonPoints.length - 1][0]}
                                    y1={currentPolygonPoints[currentPolygonPoints.length - 1][1]}
                                    x2={previewPoint.x}
                                    y2={previewPoint.y}
                                    className="stroke-green-700 stroke-2 stroke-dasharray-2"
                                />
                            )}
                        </svg>
                    </div>
                )}
    
                {/* Modal for linking shape to object */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-lg font-bold mb-4">Link Shape to Object</h2>
                            <select
                                value={selectedObjectId}
                                onChange={(e) => setSelectedObjectId(e.target.value)}
                                className="w-full p-2 border rounded-md mb-4"
                            >
                                <option value="">Select an object</option>
                                {selectedLocation?.objects.map(obj => (
                                    <option key={obj.id} value={obj.id}>{obj.nameEnglish}</option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-2">
                                <Button onClick={() => setIsModalOpen(false)} variant="outline">Cancel</Button>
                                <Button onClick={handleModalSave}>Save Link</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }