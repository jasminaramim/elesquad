import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeWaveProps {
  color?: number;
  opacity?: number;
}

const ThreeWave: React.FC<ThreeWaveProps> = ({ color = 0x6C4DF6, opacity = 0.5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer, 
        particles: THREE.Points, 
        count = 0;
    
    let mouseX = 0, mouseY = 0;
    const container = containerRef.current;

    // Parameters for particle grid
    const AMOUNTX = 50;
    const AMOUNTY = 50;
    const SEPARATION = 100;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 10000);
      camera.position.z = 1000;
      camera.position.y = 500;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      container.appendChild(renderer.domElement);

      const numParticles = AMOUNTX * AMOUNTY;
      const positions = new Float32Array(numParticles * 3);
      const scales = new Float32Array(numParticles);

      let i = 0, j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION / 2); // x
          positions[i + 1] = 0; // y
          positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION / 2); // z
          scales[j] = 1;
          i += 3;
          j++;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

      const material = new THREE.PointsMaterial({
        color: color,
        size: 2,
        transparent: true,
        opacity: opacity
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const onDocumentMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX - (window.innerWidth / 2);
        mouseY = event.clientY - (window.innerHeight / 2);
      };

      const onWindowResize = () => {
        if (!container) return;
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      };

      document.addEventListener('mousemove', onDocumentMouseMove);
      window.addEventListener('resize', onWindowResize);

      const animate = () => {
        requestAnimationFrame(animate);
        render();
      };

      const render = () => {
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        const positions = particles.geometry.attributes.position.array as Float32Array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50);
            i += 3;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        count += 0.1;

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        document.removeEventListener('mousemove', onDocumentMouseMove);
        window.removeEventListener('resize', onWindowResize);
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    const cleanup = init();
    return cleanup;
  }, [color, opacity]);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default ThreeWave;
