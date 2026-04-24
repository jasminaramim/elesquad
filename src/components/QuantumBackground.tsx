import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const QuantumBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, particles: THREE.Points, core: THREE.Mesh, group: THREE.Group;
    let mouseX = 0, mouseY = 0;

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

      // 1. DYNAMIC PARTICLE NETWORK
      const partCount = 1500;
      const posArray = new Float32Array(partCount * 3);
      for (let i = 0; i < partCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
      }
      const partGeo = new THREE.BufferGeometry();
      partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const partMat = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      particles = new THREE.Points(partGeo, partMat);
      group.add(particles);

      // 2. CENTRAL TECH CORE (Icosahedron Wireframe)
      const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x7000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });
      core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // 3. OUTER GLOW SHELL
      const shellGeo = new THREE.SphereGeometry(1.5, 32, 32);
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0x00f2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.05
      });
      const shell = new THREE.Mesh(shellGeo, shellMat);
      group.add(shell);

      // 4. FLOOR GRID
      const grid = new THREE.GridHelper(30, 60, 0x00f2ff, 0x111111);
      grid.position.y = -2.5;
      grid.material.transparent = true;
      grid.material.opacity = 0.2;
      scene.add(grid);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.05;
      group.rotation.x += (mouseY * 0.5 - group.rotation.x) * 0.05;
      particles.rotation.y += 0.001;
      core.rotation.y -= 0.005;
      core.rotation.z += 0.002;
      const s = 1 + Math.sin(time * 2) * 0.05;
      core.scale.set(s, s, s);
      renderer.render(scene, camera);
    };

    init3D();
    animate();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.4 }}
    />
  );
};

export default QuantumBackground;
