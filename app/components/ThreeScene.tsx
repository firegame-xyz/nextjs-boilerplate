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
		const width = container.clientWidth;
		const height = container.clientHeight;

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
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(width, height);
		renderer.toneMapping = THREE.ReinhardToneMapping;
		renderer.toneMappingExposure = Math.pow(1, 4.0); // Default exposure
		container.appendChild(renderer.domElement);

		// Post-processing setup
		const renderScene = new RenderPass(scene, camera);
		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(width, height),
			1.5, // strength 从1.5增加到2.0
			0.4, // radius 从0.4增加到0.5
			2, // threshold 从0.85降低到0.75
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

			composer.render();
		}
		animate();

		// Resize handler
		function handleResize() {
			const width = container.clientWidth;
			const height = container.clientHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.setSize(width, height);
			composer.setSize(width, height);
		}

		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(container);

		// Cleanup
		return () => {
			resizeObserver.disconnect();
			container.removeChild(renderer.domElement);
			renderer.dispose();
		};
	}, []);

	return (
		<div style={{ position: "absolute", width: "100%", height: "100%" }}>
			<div ref={containerRef} style={{ width: "100%", height: "100%" }} />
		</div>
	);
}
