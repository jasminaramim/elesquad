import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const QuantumBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        renderer: THREE.WebGLRenderer,
        particles: THREE.Points,
        core: THREE.Mesh,
        group: THREE.Group;

    // Smooth-tracked mouse & scroll values
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let scrollY = 0;
    let targetScrollOffset = 0;
    let currentScrollOffset = 0;

    const init3D = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 4;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current?.appendChild(renderer.domElement);

      group = new THREE.Group();
      scene.add(group);

      // Particle field
      const partCount = 1800;
      const posArray = new Float32Array(partCount * 3);
      for (let i = 0; i < partCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 14;
      }
      const partGeo = new THREE.BufferGeometry();
      partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const partMat = new THREE.PointsMaterial({
        size: 0.013,
        color: 0x6C4DF6,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      particles = new THREE.Points(partGeo, partMat);
      group.add(particles);

      // Central wireframe icosahedron
      const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x7000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // Outer glow shell
      const shellGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0x6C4DF6,
        wireframe: true,
        transparent: true,
        opacity: 0.06
      });
      group.add(new THREE.Mesh(shellGeo, shellMat));

      // Floor grid
      const grid = new THREE.GridHelper(30, 60, 0x6C4DF6, 0x111111);
      grid.position.y = -2.5;
      (grid.material as THREE.Material).transparent = true;
      (grid.material as THREE.Material).opacity = 0.15;
      scene.add(grid);
    };

    // --- Mouse move: normalise to [-1, 1] ---
    const onMouseMove = (e: MouseEvent) => {
      targetX = ((e.clientX / window.innerWidth) - 0.5) * 2;   // -1 … 1
      targetY = ((e.clientY / window.innerHeight) - 0.5) * 2;  // -1 … 1
    };

    // --- Scroll: track page scroll position ---
    const onScroll = () => {
      scrollY = window.scrollY;
      targetScrollOffset = scrollY * 0.0008; // tune sensitivity here
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Smooth lerp mouse
      const ease = 0.06;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      // Smooth lerp scroll
      currentScrollOffset += (targetScrollOffset - currentScrollOffset) * 0.04;

      // Apply mouse-driven rotation — strong but smooth
      group.rotation.y = currentX * 1.2;
      group.rotation.x = currentY * 0.8;

      // group.position.y = -currentScrollOffset * 1.5;
      // group.rotation.z = currentScrollOffset * 0.3;

      // Idle animations
      particles.rotation.y += 0.0008;
      core.rotation.y -= 0.004;
      core.rotation.z += 0.002;
      const s = 1 + Math.sin(time * 2) * 0.05;
      core.scale.set(s, s, s);

      renderer.render(scene, camera);
    };

    init3D();
    animate();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.45 }}
    />
  );
};

export default QuantumBackground;
