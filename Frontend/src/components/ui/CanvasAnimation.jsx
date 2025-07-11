import { useEffect, useRef } from "react";

const CanvasAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: 100, y: 100 };
    let dx = 4,
      dy = 4,
      radius = 50;

    let color = "rgba(0, 247, 247, 0.2)";
    function getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.3)`;
    }

    setInterval(() => {
      color = getRandomColor();
    }, 10000)
    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();

      for (let i = 0; i < canvas.width; i++) {
        let y =
          canvas.height / 2 + Math.sin(i * 0.01) * Math.cos(mouse.x * 0.01) * 30;
        ctx.lineTo(i, y);
        y =
          canvas.height / 2 + Math.cos(i * 0.01) * Math.sin(mouse.x * 0.01) * 30;
        ctx.lineTo(i, y);
        ctx.lineTo(i + 1, y + canvas.height);

      }

      ctx.strokeStyle = color;
      // ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }

    function drawCircle() {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.closePath();
    }

    function animate() {
      requestAnimationFrame(animate);
      drawWave();
      drawCircle();

      mouse.x += dx;
      mouse.y += dy;

      if (mouse.x + radius > canvas.width || mouse.x - radius < 0) {
        dx = -dx;
      }
      if (mouse.y + radius > canvas.height || mouse.y - radius < 0) {
        dy = -dy;
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, background: "url(https://t3.ftcdn.net/jpg/09/19/55/54/360_F_919555443_nMcSl34R8Z4aGaN7Zi6CLt2KqaIQoxoG.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
    />
  );
};
export default CanvasAnimation;
