import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;

  float sinc(float x) {
    return (x == 0.0) ? 1.0 : sin(x) / x;
  }

  float triIsolate(float x) {
    return abs(-1.0 + fract(clamp(x, -0.5, 0.5)) * 2.0);
  }

  float rand(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float waveform(float x) {
    float randomOffset = rand(floor(iTime)) * 0.15;                   
    float randomAmplitude = 0.7 + rand(floor(iTime) + 1.0) * 0.6;    
    
    float pos1 = 0.37 + rand(floor(iTime) + 9.0) * 0.2;              
    float pos2 = 0.5 + rand(floor(iTime) + 10.0) * 0.25;             
    float pos3 = 0.7 + rand(floor(iTime) + 11.0) * 0.2;              
    
    float randomFreq1 = 25.0 + rand(floor(iTime) + 2.0) * 10.0;      
    float randomFreq2 = 35.0 + rand(floor(iTime) + 3.0) * 15.0;      
    float randomFreq3 = 8.0 + rand(floor(iTime) + 4.0) * 6.0;        
    
    float prebeat = -sinc((x - pos1) * randomFreq1) 
                   * (0.6 + rand(floor(iTime) + 5.0) * 0.2)          
                   * triIsolate((x - pos1) * (0.9 + rand(floor(iTime) + 6.0) * 0.2));
    
    float mainbeat = sinc((x - pos2) * randomFreq2) 
                    * (randomAmplitude * 0.8)                         
                    * triIsolate((x - pos2) * (0.8 + rand(floor(iTime) + 7.0) * 0.2));
    
    float postbeat = sinc((x - pos3) * randomFreq3) 
                    * (0.5 + rand(floor(iTime) + 8.0) * 0.2)         
                    * triIsolate((x - pos3) * (0.8 + rand(floor(iTime) + 12.0) * 0.2));
    
    float envelope = triIsolate((x - (0.5 + randomOffset)) * (0.9 + rand(floor(iTime) + 13.0) * 0.1));
    
    return (prebeat + mainbeat + postbeat) * envelope;
  }

  float test(vec2 uv) {
    float delta = 0.000001;
    float x1 = uv.x - delta;
    float x2 = uv.x + delta;
    float y1 = waveform(x1);
    float y2 = waveform(x2);
    
    float x0 = uv.x;
    float y0 = uv.y;
    float d = ((y2-y1)*x0-(x2-x1)*y0+x2*y1-y2*x1)/sqrt(pow(y2-y1, 2.0)+pow(x2-x1, 2.0));
    
    float t = smoothstep(0.0, 1.0, pow(abs(d), 0.4) * 12.0);
    float w = smoothstep(0.0, 1.0, pow(abs(uv.y - y1), 0.75) * 12.0);

    return min(t, min(t * w, min(t + (t * w) * 0.5, w + (t * w) * 0.5)));
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float Time = fract(iTime);
    
    float light = 2.5 + rand(floor(iTime)) * 1.0;
    
    float noiseScale = 0.08 + rand(floor(iTime) + 2.0) * 0.04;
    float noise = noiseScale * rand(floor(fract(iTime * 0.1) * 10.0));
    float delta = (0.8 + rand(floor(iTime) + 3.0) * 0.4) * noise * sin(noise + uv.x);
    
    uv.y += noise + delta;
    float dist = test(vec2(uv.x * 1.1 + 0.2, uv.y * 4.0 - 1.5)) * 1.2;
    
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    
    if (Time >= uv.x) {
      float alpha = (1.0 - dist);
      alpha = smoothstep(0.1, 0.9, alpha);
      fragColor = vec4(vec3(light, 0.0, 0.0) * alpha, alpha);
    }

    uv.x *= iResolution.x / iResolution.y;
    
    vec2 tuv = vec2(Time * iResolution.x / iResolution.y, (waveform(Time * 1.1 + 0.2) + 1.5) / 4.0);
    float dotDist = distance(vec2(uv.x, uv.y), tuv);
    
    if (dotDist < 0.01) {
      float dotAlpha = smoothstep(0.01, 0.0, dotDist);
      fragColor = vec4(1.0, 1.0, 1.0, dotAlpha);
    }
       
    uv.y -= noise + delta;        

    float gridSize = 20.0;
    float gridThickness = 0.06;
    float gridAlpha = 0.15;
    
    if (fract(uv.x * gridSize) < gridThickness || 
        fract(uv.y * gridSize) < gridThickness) {
      fragColor = max(fragColor, vec4(0.25, 0.25, 0.25, gridAlpha));
    }
  }

  void main() {
    vec4 fragColor;
    mainImage(fragColor, gl_FragCoord.xy);
    gl_FragColor = fragColor;
  }
`;

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface WaveformShaderProps {
	className?: string;
}

export function WaveformShader({ className }: WaveformShaderProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!containerRef.current) return;

		const updateDimensions = () => {
			const rect = containerRef.current?.getBoundingClientRect();
			if (rect) {
				setDimensions({
					width: Math.round(rect.width),
					height: Math.round(rect.height),
				});
			}
		};

		// Initial update
		updateDimensions();

		// Listen for size changes
		const resizeObserver = new ResizeObserver(() => {
			updateDimensions();
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		if (
			!containerRef.current ||
			dimensions.width === 0 ||
			dimensions.height === 0
		)
			return;

		const scene = new THREE.Scene();

		// Use actual container dimensions
		const width = dimensions.width;
		const height = dimensions.height;
		const aspect = width / height;

		// Adjust camera view to maintain content ratio
		let cameraWidth = aspect;
		let cameraHeight = 1;
		if (aspect < 1) {
			cameraWidth = 1;
			cameraHeight = 1 / aspect;
		}

		const camera = new THREE.OrthographicCamera(
			-cameraWidth,
			cameraWidth,
			cameraHeight,
			-cameraHeight,
			0.1,
			100,
		);
		camera.position.z = 1;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			precision: "lowp",
		});

		// Use device pixel ratio but limit max value for performance balance
		const pixelRatio = Math.min(window.devicePixelRatio, 2);
		renderer.setPixelRatio(pixelRatio);
		renderer.setSize(width, height, true);
		renderer.setClearColor(0x000000, 0);

		containerRef.current.appendChild(renderer.domElement);

		const shaderMaterial = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms: {
				iTime: { value: 0 },
				iResolution: {
					value: new THREE.Vector2(width * pixelRatio, height * pixelRatio),
				},
			},
			transparent: true,
			depthWrite: false,
			depthTest: false,
		});

		// Adjust plane geometry size to match camera view
		const geometry = new THREE.PlaneGeometry(cameraWidth * 2, cameraHeight * 2);
		const mesh = new THREE.Mesh(geometry, shaderMaterial);
		scene.add(mesh);

		let animationFrameId: number;
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			shaderMaterial.uniforms.iTime.value = performance.now() / 1000;
			renderer.render(scene, camera);
		};

		animate();

		// Cleanup function
		return () => {
			cancelAnimationFrame(animationFrameId);
			if (containerRef.current?.contains(renderer.domElement)) {
				containerRef.current.removeChild(renderer.domElement);
			}
			geometry.dispose();
			shaderMaterial.dispose();
			renderer.dispose();
			scene.clear();
		};
	}, [dimensions.width, dimensions.height]);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
				overflow: "hidden",
				display: "block",
				boxSizing: "border-box",
				margin: "0",
				padding: "0",
				willChange: "transform",
				transform: "translateZ(0)",
				WebkitFontSmoothing: "antialiased",
				MozOsxFontSmoothing: "grayscale",
			}}
		/>
	);
}
