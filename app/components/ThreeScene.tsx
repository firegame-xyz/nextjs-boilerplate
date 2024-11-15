import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

export default function ThreeScene() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const width = Math.max(1, container.clientWidth);
		const height = Math.max(1, container.clientHeight);

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(40, width / height, 1, 100);
		camera.position.set(-4, 2, -3.8);
		scene.add(camera);

		// Lighting
		scene.add(new THREE.AmbientLight(0xcccccc));
		const pointLight = new THREE.PointLight(0xffffff, 200);
		camera.add(pointLight);

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			powerPreference: "high-performance",
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(width, height);
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.toneMappingExposure = Math.pow(1, 4.0);
		container.appendChild(renderer.domElement);

		// Post-processing setup
		const renderScene = new RenderPass(scene, camera);
		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(width, height),
			1.5,
			0.4,
			2,
		);
		const outputPass = new OutputPass();
		const composer = new EffectComposer(renderer);
		composer.addPass(renderScene);
		composer.addPass(bloomPass);
		composer.addPass(outputPass);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.maxPolarAngle = Math.PI * 0.5;
		controls.minDistance = 2;
		controls.maxDistance = 6;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;

		// Model loading
		const clock = new THREE.Clock();
		let mixer: THREE.AnimationMixer;

		const loader = new GLTFLoader();
		loader.load("/models/gltf/PrimaryIonDrive.glb", (gltf) => {
			const model = gltf.scene;
			scene.add(model);

			mixer = new THREE.AnimationMixer(model);
			const clip = gltf.animations[0];
			mixer.clipAction(clip.optimize()).play();
		});

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);

			const delta = clock.getDelta();
			if (mixer) mixer.update(delta);

			controls.update();
			composer.render();
		}

		// Resize handler
		function handleResize() {
			if (!container) return;

			const width = Math.max(1, container.clientWidth);
			const height = Math.max(1, container.clientHeight);

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
			composer.setSize(width, height);
			bloomPass.resolution.set(width, height);
		}

		// Initial animation
		animate();

		// Setup resize observer
		const resizeObserver = new ResizeObserver(() => {
			handleResize();
		});
		resizeObserver.observe(container);

		// Cleanup
		return () => {
			resizeObserver.disconnect();
			container.removeChild(renderer.domElement);
			scene.clear();
			renderer.dispose();
			composer.dispose();
			controls.dispose();
		};
	}, []);

	return (
		<div
			style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				minWidth: "1px",
				minHeight: "1px",
				overflow: "hidden",
			}}
		>
			<div
				ref={containerRef}
				style={{
					width: "100%",
					height: "100%",
					minWidth: "1px",
					minHeight: "1px",
				}}
			/>
		</div>
	);
}
