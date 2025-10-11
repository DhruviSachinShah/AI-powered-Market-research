import { useEffect, useRef } from 'react';

export const GridCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<Array<{ col: number; row: number; startTime: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grid settings
    const BLOCK_SIZE = 24;
    const STROKE_COLOR = "rgba(156, 163, 175, 0.4)"; // More subtle gray
    const BASE_FILL = "transparent"; // Transparent background
    const GRID_HIGHLIGHT = "rgba(156, 163, 175, 0.2)"; // Very subtle highlight for intersections

    // Effect settings (3 phases with smooth transitions)
    const PHASE_DURATION = 200;
    const EFFECT_DURATION = 800; // Longer duration for more appeal
    const colorA = "#3b82f6"; // Vibrant blue for checkerboard
    const colorB = "#ec4899"; // Bright pink for final fill
    const colorC = "#8b5cf6"; // Purple intermediate

    const effects = effectsRef.current;

    // Resize canvas
    const resizeCanvas = () => {
      const wrapper = canvas.parentElement;
      if (!wrapper) return;

      const newWidth = Math.floor(wrapper.offsetWidth / BLOCK_SIZE) * BLOCK_SIZE;
      canvas.width = newWidth;
      canvas.height = Math.floor(wrapper.offsetHeight / BLOCK_SIZE) * BLOCK_SIZE;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw the grid
    const drawGrid = () => {
      const cols = Math.floor(canvas.width / BLOCK_SIZE);
      const rows = Math.floor(canvas.height / BLOCK_SIZE);
      
      // Clear canvas (transparent background)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid lines with enhanced visibility
      ctx.strokeStyle = STROKE_COLOR;
      ctx.lineWidth = 1;
      
      // Draw vertical lines
      for (let c = 0; c <= cols; c++) {
        const x = c * BLOCK_SIZE;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Draw horizontal lines
      for (let r = 0; r <= rows; r++) {
        const y = r * BLOCK_SIZE;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Add subtle highlights at intersections
      ctx.fillStyle = GRID_HIGHLIGHT;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * BLOCK_SIZE;
          const y = r * BLOCK_SIZE;
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
    };

    // Draw checkerboard pattern
    const drawCheckerboard = (x: number, y: number) => {
      const miniSize = BLOCK_SIZE / 15;
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          const cellColor = ((i + j) % 2 === 0) ? colorA : "rgba(59, 130, 246, 0.1)";
          ctx.fillStyle = cellColor;
          ctx.fillRect(x + j * miniSize, y + i * miniSize, miniSize, miniSize);
        }
      }
    };

    // Draw diagonal dither pattern
    const drawDiagonalDither = (x: number, y: number) => {
      const miniSize = BLOCK_SIZE / 15;
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          if ((i + j) % 3 === 0) {
            ctx.fillStyle = STROKE_COLOR;
          } else {
            ctx.fillStyle = BASE_FILL;
          }
          ctx.fillRect(x + j * miniSize, y + i * miniSize, miniSize, miniSize);
        }
      }
    };

    // Draw effect on a cell with smooth color transitions
    const drawEffect = (col: number, row: number, dt: number) => {
      const x = col * BLOCK_SIZE;
      const y = row * BLOCK_SIZE;
      
      if (dt < PHASE_DURATION) {
        // Phase 1: Vibrant blue checkerboard pattern (0-200ms)
        drawCheckerboard(x, y);
      } else if (dt < 2 * PHASE_DURATION) {
        // Phase 2: Transition to solid blue (200-400ms)
        const progress = (dt - PHASE_DURATION) / PHASE_DURATION;
        ctx.fillStyle = colorA;
        ctx.globalAlpha = 0.6 + (progress * 0.4); // Fade in from 0.6 to 1
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        ctx.globalAlpha = 1;
      } else if (dt < 3 * PHASE_DURATION) {
        // Phase 3: Transition to purple (400-600ms)
        const progress = (dt - 2 * PHASE_DURATION) / PHASE_DURATION;
        // Interpolate between blue and purple
        const r = Math.floor(59 + (139 - 59) * progress);
        const g = Math.floor(130 + (92 - 130) * progress);
        const b = Math.floor(246 + (246 - 246) * progress);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      } else if (dt < EFFECT_DURATION) {
        // Phase 4: Transition to bright pink (600-800ms)
        const progress = (dt - 3 * PHASE_DURATION) / PHASE_DURATION;
        // Interpolate between purple and pink
        const r = Math.floor(139 + (236 - 139) * progress);
        const g = Math.floor(92 + (72 - 92) * progress);
        const b = Math.floor(246 + (153 - 246) * progress);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
      }
    };

    // Mouse move handler with trail effect
    let lastCol = -1;
    let lastRow = -1;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      // Only process if mouse is within canvas bounds
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const col = Math.floor(x / BLOCK_SIZE);
        const row = Math.floor(y / BLOCK_SIZE);
        
        // Only add effect if we're in a new cell (prevents duplicate effects)
        if (col !== lastCol || row !== lastRow) {
          // Add main effect
          effects.push({ col, row, startTime: Date.now() });
          
          // Add surrounding cells for a 2x2 ripple effect
          const neighbors = [
            { col: col, row: row }, // Right
            { col: col, row: row }, // Bottom
            { col: col, row: row } // Bottom-right
          ];
          
          neighbors.forEach(({ col: nCol, row: nRow }) => {
            if (nCol >= 0 && nRow >= 0 && nCol < Math.floor(canvas.width / BLOCK_SIZE) && nRow < Math.floor(canvas.height / BLOCK_SIZE)) {
              effects.push({ col: nCol, row: nRow, startTime: Date.now() + Math.random() * 100 });
            }
          });
          
          lastCol = col;
          lastRow = row;
        }
      }
    };

    // Listen to document mousemove to capture events even over content
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      drawGrid();

      const now = Date.now();
      for (let i = effects.length - 1; i >= 0; i--) {
        const effect = effects[i];
        const dt = now - effect.startTime;
        if (dt < EFFECT_DURATION) {
          drawEffect(effect.col, effect.row, dt);
        } else {
          effects.splice(i, 1);
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
};