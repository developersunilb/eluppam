import React, { useState, useEffect, useMemo } from 'react';
import { useProgress } from '@/context/ProgressContext'; // New import
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SectionColors {
  [key: string]: string; // Keys are section IDs, values are color hex codes
}

interface ActivatedColors {
  [key: string]: boolean; // Keys are color hex codes, values are booleans
}

const MalayalamColoringApp = () => {
  const { addBadge } = useProgress(); // New line
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sectionColors, setSectionColors] = useState<SectionColors>({});
  const [activatedColors, setActivatedColors] = useState<ActivatedColors>({});
  const [feedback, setFeedback] = useState('');
  const [pendingActivationColorHex, setPendingActivationColorHex] = useState<string | null>(null);
  const [jumbledMalayalamWords, setJumbledMalayalamWords] = useState<string[]>([]);
  const [isPookalamComplete, setIsPookalamComplete] = useState(false);
  const [earnedBadgeImage, setEarnedBadgeImage] = useState<string | null>(null);

  const colorPalette = useMemo(() => [
    { malayalam: 'കറുപ്പ്', english: 'Black', hex: '#000000', pronunciation: ['karuppu', 'karup', 'black'] },
    { malayalam: 'ചുവപ്പ്', english: 'Red', hex: '#FF0000', pronunciation: ['chuvappu', 'chuvap', 'red'] },
    { malayalam: 'നീല', english: 'Blue', hex: '#0000FF', pronunciation: ['neela', 'nila', 'blue'] },
    { malayalam: 'ഓറഞ്ച്', english: 'Orange', hex: '#FFA500', pronunciation: ['orange', 'orangu', 'oranj'] },
    { malayalam: 'വെള്ള', english: 'White', hex: '#FFFFFF', pronunciation: ['vella', 'vellu', 'white'] },
    { malayalam: 'മഞ്ഞ', english: 'Yellow', hex: '#FFFF00', pronunciation: ['manja', 'manjha', 'yellow'] },
    { malayalam: 'തവിട്ട്', english: 'Brown', hex: '#8B4513', pronunciation: ['thavittu', 'tavitt', 'brown'] },
    { malayalam: 'പച്ച', english: 'Green', hex: '#008000', pronunciation: ['pacha', 'pasha', 'green'] },
    { malayalam: 'പിങ്ക്', english: 'Pink', hex: '#FFC0CB', pronunciation: ['pink', 'pinku'] }
  ], []);

  useEffect(() => {
    // Shuffle Malayalam words for the buttons
    const allMalayalamWords = colorPalette.map(color => color.malayalam);
    const shuffledWords = [...allMalayalamWords].sort(() => Math.random() - 0.5);
    setJumbledMalayalamWords(shuffledWords);
  }, [colorPalette]);

  const captureSvgAsPng = (svgElement: SVGSVGElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Set canvas dimensions to desired badge size
      const badgeSize = 232;
      canvas.width = badgeSize;
      canvas.height = badgeSize;

      const img = new Image();
      img.onload = () => {
        // Draw the image, scaling it to fit the canvas dimensions
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (error) => {
        reject(error);
      };
      // It's important to set the SVG's intrinsic size for the Image object
      // This helps the Image object render the SVG correctly before drawing to canvas
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(
        svgString.replace('<svg', `<svg width="${svgElement.viewBox.baseVal.width}" height="${svgElement.viewBox.baseVal.height}">`)
      )));
    });
  };

  useEffect(() => {
    const totalSections = 65; // Based on manual count of SVG sections
    if (Object.keys(sectionColors).length === totalSections) {
      setIsPookalamComplete(true);
      setFeedback('Congrats! You earned a Pookkalam badge!');

      // Capture SVG as PNG
      const svgElement = document.querySelector('#pookalam-svg') as SVGSVGElement;
      if (svgElement) {
        captureSvgAsPng(svgElement)
          .then(dataUrl => {
            // Save badge image to server
            const badgeId = 'pookalam-master'; // Use a consistent ID for the badge file
            fetch('/api/save-badge', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageData: dataUrl, badgeId }),
            })
              .then(response => response.json())
              .then(data => {
                if (data.filePath) {
                  // Update badge with server-saved image path
                  addBadge({
                    id: badgeId,
                    name: 'Pookalam Master',
                    image: data.filePath, // Use the server-saved path
                    dateEarned: Date.now(),
                  });
                  setEarnedBadgeImage(data.filePath); // Also update local state with new path
                  console.log('Badge saved on server:', data.filePath);
                } else {
                  console.error('Failed to save badge on server:', data.message);
                  // Fallback to dataUrl if server save fails
                  addBadge({
                    id: badgeId,
                    name: 'Pookalam Master',
                    image: dataUrl,
                    dateEarned: Date.now(),
                  });
                  setEarnedBadgeImage(dataUrl);
                }
              })
              .catch(error => {
                console.error('Error calling save-badge API:', error);
                // Fallback to dataUrl if API call fails
                addBadge({
                  id: badgeId,
                  name: 'Pookalam Master',
                  image: dataUrl,
                  dateEarned: Date.now(),
                });
                setEarnedBadgeImage(dataUrl);
              });
          })
          .catch(error => console.error('Error capturing SVG:', error));
      }
    } else {
      setIsPookalamComplete(false);
      setEarnedBadgeImage(null); // Clear badge if not complete
    }
  }, [sectionColors, addBadge]);

  const handleMalayalamWordSelection = (word: string) => {
    if (!pendingActivationColorHex) {
      setFeedback('Please select a color from the palette first!');
      return;
    }

    const selectedPaletteColor = colorPalette.find(c => c.hex === pendingActivationColorHex);
    if (!selectedPaletteColor) return;

    if (selectedPaletteColor.malayalam === word) {
      setActivatedColors(prev => ({ ...prev, [pendingActivationColorHex]: true }));
      setSelectedColor(pendingActivationColorHex);
      setFeedback(`Very good, now you are ready to use the color.`);
      setPendingActivationColorHex(null);
    } else {
      setFeedback(`Incorrect, please try again.`);
    }
  };

  const handleColorSelection = (color: { malayalam: string; english: string; hex: string; pronunciation: string[] }) => {
    if (activatedColors[color.hex]) {
      setSelectedColor(color.hex);
      setFeedback(`Using ${color.malayalam} (${color.english})`);
      setPendingActivationColorHex(null); // Clear pending activation if already activated
    } else {
      setPendingActivationColorHex(color.hex);
      setSelectedColor(null); // Deselect current color until activated
      setFeedback('Please choose the correct Malayalam word to activate this color.');
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (isPookalamComplete) {
      setFeedback('Pookalam is already complete! Reset to play again.');
      return;
    }
    if (selectedColor && activatedColors[selectedColor]) {
      setSectionColors(prev => ({
        ...prev,
        [sectionId]: selectedColor
      }));
    } else {
      setFeedback('Please select and activate a color first!');
    }
  };

  const clearColors = () => {
    setSectionColors({});
    setFeedback('All colors cleared!');
  };

  const resetActivations = () => {
    setActivatedColors({});
    setSelectedColor(null);
    setPendingActivationColorHex(null); // Clear pending activation
    setFeedback('All color activations reset. Match Malayalam words to activate them!');
    // Reshuffle words
    const allMalayalamWords = colorPalette.map(color => color.malayalam);
    const shuffledWords = [...allMalayalamWords].sort(() => Math.random() - 0.5);
    setJumbledMalayalamWords(shuffledWords);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto my-8 bg-marigold-100">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-gray-800">
          മലയാളം നിറങ്ങൾ പഠിക്കാം
        </CardTitle>
        <p className="text-2xl text-gray-600">
          Learn Malayalam Colors - Pookkalam Coloring
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Color Palette Section */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Color Palette</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Color Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {colorPalette.map((color, index) => (
                                <div key={index} className="text-center">
                                  <button
                                    className={`w-16 h-16 rounded-lg border-4 transition-all hover:scale-105 ${
                                      selectedColor === color.hex ? 'border-gray-800 scale-105' : 'border-gray-300'
                                    } ${
                                      activatedColors[color.hex] ? 'shadow-lg' : 'opacity-50'
                                    }`}
                                    style={{
                                      backgroundColor: color.hex,
                                      border: color.hex === '#FFFFFF' ? '4px solid #ccc' : undefined
                                    }}
                                                          onClick={() => handleColorSelection(color)}
                                                        >                                    {activatedColors[color.hex] && (
                                      <span className="text-white text-xs">✓</span>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
              
                {/* Malayalam Word Buttons Grid */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg"> {/* Changed bg-blue-50 to bg-gray-50 for neutrality */}
                  <h4 className="text-lg font-bold text-center mb-3 text-gray-800">Choose the Malayalam word:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {jumbledMalayalamWords.map((word, index) => (
                      <Button
                        key={index}
                        onClick={() => handleMalayalamWordSelection(word)}
                                    className={`text-sm font-semibold h-auto py-2 px-3
                                      ${
                                        (() => {
                                          const foundColor = colorPalette.find(c => c.malayalam === word);
                                          return foundColor && activatedColors[foundColor.hex]
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white';
                                        })()
                                      }
                                    `}
                      >
                        {word}
                      </Button>
                    ))}
                  </div>
                </div>


              {/* Feedback Display */}
              {feedback && (
                <p className={`text-center text-xl font-semibold mt-4 ${
                  feedback.includes('Very good') ? 'text-green-700' : // Correct activation
                  feedback.includes('Incorrect') ? 'text-red-700' : // Incorrect attempt
                  'text-gray-700' // General feedback
                }`}>
                  {feedback}
                </p>
              )}

              {/* Control Buttons */}
              <div className="space-y-2 mt-6"> {/* Added mt-6 for spacing */}
                <Button
                  onClick={clearColors}
                  className="w-full py-2 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Clear All Colors
                </Button>
                <Button
                  onClick={resetActivations}
                  className="w-full py-2 text-lg bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Reset Activations
                </Button>
              </div>

              {/* Instructions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">How to Play:</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click on a color from the palette to select it.</li>
                    <li>Then, click on the correct Malayalam word below to activate the color.</li>
                    <li>Once activated, click on Pookalam sections to color them.</li>
                    <li>Learn all nine Malayalam color names!</li>
                  </ol>
                </CardContent>
              </Card>
              </CardContent>
            </Card>
          </div>

          {/* Mandala Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Onam Pookalam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <svg
                    id="pookalam-svg"
                    width="500"
                    height="500"
                    viewBox="0 0 500 500"
                    className="border-2 border-gray-300 rounded-lg shadow-sm bg-marigold-100"
                  >
                    {/* Outermost circle - drawn first so it appears behind other elements */}
                    <circle
                      cx="250"
                      cy="250"
                      r="240"
                      fill={sectionColors['circle-outermost'] || '#FDF3E7'}
                      stroke="black"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSectionClick('circle-outermost')}
                    />

                    {/* Large scalloped petals */}
                    <g transform="translate(250,250)">
                      {Array.from({ length: 16 }, (_, i) => {
                        const angle = (i * 360) / 16;
                        const radius = 200;
                        const petalWidth = 35;
                        
                        const centerX = Math.cos((angle * Math.PI) / 180) * radius;
                        const centerY = Math.sin((angle * Math.PI) / 180) * radius;
                        
                        return (
                          <circle
                            key={`petal-${i}`}
                            cx={centerX}
                            cy={centerY}
                            r={petalWidth}
                            fill={sectionColors[`petal-${i}`] || '#FDF3E7'}
                            stroke="black"
                            strokeWidth="2"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleSectionClick(`petal-${i}`)}
                          />
                        );
                      })}
                    </g>

                    {/* Outer circle */}
                    <circle
                      cx="250"
                      cy="250"
                      r="170"
                      fill={sectionColors['circle-outer'] || '#FDF3E7'}
                      stroke="black"
                      strokeWidth="3"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSectionClick('circle-outer')}
                    />
                    
                    {/* Middle circle */}
                    <circle
                      cx="250"
                      cy="250"
                      r="150"
                      fill={sectionColors['circle-mid'] || '#FDF3E7'}
                      stroke="black"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSectionClick('circle-mid')}
                    />

                    {/* Decorative wavy ring */}
                    <g transform="translate(250,250)">
                      {Array.from({ length: 24 }, (_, i) => {
                        const angle = (i * 360) / 24;
                        const radius = 130;
                        const waveRadius = 12;
                        
                        const centerX = Math.cos((angle * Math.PI) / 180) * radius;
                        const centerY = Math.sin((angle * Math.PI) / 180) * radius;
                        
                        return (
                          <circle
                            key={`wave-${i}`}
                            cx={centerX}
                            cy={centerY}
                            r={waveRadius}
                            fill={sectionColors[`wave-${i}`] || '#FDF3E7'}
                            stroke="black"
                            strokeWidth="1.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleSectionClick(`wave-${i}`)}
                          />
                        );
                      })}
                    </g>

                    {/* Inner star sections */}
                    <g transform="translate(250,250)">
                      {Array.from({ length: 12 }, (_, i) => {
                        const angle = (i * 360) / 12;
                        const innerRadius = 65;
                        const outerRadius = 110;
                        const nextAngle = ((i + 1) * 360) / 12;
                        
                        const x1 = Math.cos((angle * Math.PI) / 180) * innerRadius;
                        const y1 = Math.sin((angle * Math.PI) / 180) * innerRadius;
                        const x2 = Math.cos(((angle + nextAngle) / 2 * Math.PI) / 180) * outerRadius;
                        const y2 = Math.sin(((angle + nextAngle) / 2 * Math.PI) / 180) * outerRadius;
                        const x3 = Math.cos((nextAngle * Math.PI) / 180) * innerRadius;
                        const y3 = Math.sin((nextAngle * Math.PI) / 180) * innerRadius;
                        
                        return (
                          <path
                            key={`star-${i}`}
                            d={`M 0 0 L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
                            fill={sectionColors[`star-${i}`] || '#FDF3E7'}
                            stroke="black"
                            strokeWidth="2"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleSectionClick(`star-${i}`)}
                          />
                        );
                      })}
                    </g>

                    {/* Inner circle */}
                    <circle
                      cx="250"
                      cy="250"
                      r="60"
                      fill={sectionColors['inner-circle'] || '#FDF3E7'}
                      stroke="black"
                      strokeWidth="2"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleSectionClick('inner-circle')}
                    />

                    {/* Center flower petals */}
                    <g transform="translate(250,250)">
                      {Array.from({ length: 8 }, (_, i) => {
                        const angle = (i * 360) / 8;
                        const radius = 20;
                        
                        const centerX = Math.cos((angle * Math.PI) / 180) * radius;
                        const centerY = Math.sin((angle * Math.PI) / 180) * radius;
                        
                        return (
                          <circle
                            key={`center-${i}`}
                            cx={centerX}
                            cy={centerY}
                            r="10"
                            fill={sectionColors[`center-${i}`] || '#FDF3E7'}
                            stroke="black"
                            strokeWidth="1.5"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleSectionClick(`center-${i}`)}
                          />
                        );
                      })}
                      
                      {/* Center dot */}
                      <circle
                        cx="0"
                        cy="0"
                        r="6"
                        fill={sectionColors['center-dot'] || '#FDF3E7'}
                        stroke="black"
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleSectionClick('center-dot')}
                      />
                    </g>
                  </svg>
                </div>
                
                <div className="mt-4 text-center text-gray-600 text-sm">
                  <p>🎯 Select a color, click its Malayalam name, then click on pookkalam sections to color them!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MalayalamColoringApp;
