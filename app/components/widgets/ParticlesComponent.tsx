import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
#define GLSLIFY 1
highp float random(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14);
    return fract(sin(sn) * c);
}

uniform float iTime;
uniform float iVelocity;

attribute vec2 aSeed;
attribute float aSize;

varying float vRandColor;

void main() {
    vec3 p = position;

    float t = iTime * 1000.0;
    float v = iVelocity;
    float s = v * t;
    p.z = mod(p.z + s, 2000.0);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float pSize = aSize * (200.0 / -mvPosition.z);
    gl_PointSize = pSize;

    float randColor = random(aSeed);
    vRandColor = randColor;
}
`;

const fragmentShader = `
#define GLSLIFY 1
float circle(vec2 st, float r) {
    vec2 dist = st - vec2(0.5);
    return 1.0 - smoothstep(r - (r * 1.15), r, dot(dist, dist) * 4.0);
}

uniform vec3 iColor1;
uniform vec3 iColor2;

varying float vRandColor;

void main() {
    vec2 p = gl_PointCoord - vec2(0.5) + vec2(0.5);

    vec3 color = iColor1;
    if (vRandColor > 0.0 && vRandColor < 0.5) {
        color = iColor2;
    }

    float shape = circle(p, 1.0);
    vec3 col = color * shape;

    gl_FragColor = vec4(col, 1.0);
}
`;

interface ParticlesConfig {
	count: number;
	pointColor1: string;
	pointColor2: string;
	pointSize: number;
	angularVelocity: number;
	velocity: number;
}

const ParticlesComponent: React.FC<ParticlesConfig> = ({
	count = 5000,
	pointColor1 = "#ff6030",
	pointColor2 = "#1b3984",
	pointSize = 3,
	angularVelocity = 0,
	velocity = 0.01,
}) => {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const width = mountRef.current?.clientWidth || window.innerWidth;
		const height = mountRef.current?.clientHeight || window.innerHeight;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x17181c);

		const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
		camera.position.z = 1000;

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize(width, height);
		if (mountRef.current) {
			mountRef.current.appendChild(renderer.domElement);
		}

		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(count * 3);
		const seeds = new Float32Array(count * 2);
		const sizes = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			positions[i * 3] = Math.random() * 50 - 25;
			positions[i * 3 + 1] = Math.random() * 50 - 25;
			positions[i * 3 + 2] = Math.random() * 2000;
			seeds[i * 2] = Math.random();
			seeds[i * 2 + 1] = Math.random();
			sizes[i] = pointSize + Math.random();
		}
		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));
		geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			uniforms: {
				iTime: { value: 0 },
				iColor1: { value: new THREE.Color(pointColor1) },
				iColor2: { value: new THREE.Color(pointColor2) },
				iVelocity: { value: velocity },
			},
		});

		const points = new THREE.Points(geometry, material);
		scene.add(points);

		const animate = (time: number) => {
			material.uniforms.iTime.value = time / 1000;
			points.rotation.z += angularVelocity * 0.01;
			renderer.render(scene, camera);
			requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);

		return () => {
			if (mountRef.current) {
				mountRef.current.removeChild(renderer.domElement);
			}
			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, [count, pointColor1, pointColor2, pointSize, angularVelocity, velocity]);

	return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ParticlesComponent;
