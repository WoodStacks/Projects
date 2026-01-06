import { useEffect, useRef, useState } from "react";

const ZOOM_SENSITIVITY = 0.001;
const BASE_ITER = 500;

export default function Mandelbrot() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragging = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const [bounds, setBounds] = useState({
    minX: -2.5,
    maxX: 1,
    minY: -1.5,
    maxY: 1.5,
  });

  const computeMaxIter = () => {
    const zoomFactor = 3.5 / (bounds.maxX - bounds.minX);
    return Math.floor(BASE_ITER + Math.log2(zoomFactor) * 50);
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const maxIter = computeMaxIter();

    const imgData = ctx.createImageData(width, height);

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x0 = bounds.minX + (px / width) * (bounds.maxX - bounds.minX);
        const y0 = bounds.minY + (py / height) * (bounds.maxY - bounds.minY);

        let x = 0;
        let y = 0;
        let iter = 0;

        while (x * x + y * y <= 4 && iter < maxIter) {
          const xtemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iter++;
        }

        // Smooth coloring
        let t = iter;
        if (iter < maxIter) {
          const logZn = Math.log(x * x + y * y) / 2;
          const nu = Math.log(logZn / Math.log(2)) / Math.log(2);
          t = iter + 1 - nu;
        }
        t = t / maxIter;

        // Classic color formula
        const r = Math.floor(9 * (1 - t) * t * t * t * 255);
        const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
        const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);

        const idx = (py * width + px) * 4;
        imgData.data[idx] = r;
        imgData.data[idx + 1] = g;
        imgData.data[idx + 2] = b;
        imgData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  };

  useEffect(() => {
    render();
  }, [bounds]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const zoom = Math.exp(e.deltaY * ZOOM_SENSITIVITY);
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    const cx = bounds.minX + (mx / canvas.width) * width;
    const cy = bounds.minY + (my / canvas.height) * height;

    const newWidth = width * zoom;
    const newHeight = height * zoom;

    setBounds({
      minX: cx - newWidth * (mx / canvas.width),
      maxX: cx + newWidth * (1 - mx / canvas.width),
      minY: cy - newHeight * (my / canvas.height),
      maxY: cy + newHeight * (1 - my / canvas.height),
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !lastPos.current) return;

    const canvas = canvasRef.current!;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;

    setBounds({
      minX: bounds.minX - dx * (width / canvas.width),
      maxX: bounds.maxX - dx * (width / canvas.width),
      minY: bounds.minY - dy * (height / canvas.height),
      maxY: bounds.maxY - dy * (height / canvas.height),
    });

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const stopDrag = () => {
    dragging.current = false;
    lastPos.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      style={{
        display: "block",
        margin: "0 auto",
        background: "#000",
        cursor: dragging.current ? "grabbing" : "grab",
      }}
    />
  );
};