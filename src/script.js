import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import fireworkVertexShader from './shaders/firework/vertex.glsl';
import fireworkFragmentShader from './shaders/firework/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.resolution.set(window.innerWidth, window.innerHeight)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1.5, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Fireworks
 */
const createFirework = (count, position, size) => {
    // Geometry
    const positionsArray = new Float32Array(count * 3); // x y z for each vertex and as such you multiply it by 3

    for (let i = 0; i < count; i++) {
        const i3 = i * 3; // the first three values of the array are the x y z of 1 single particle, and the same applies for the rest of the values of the array
    
        positionsArray[i3    ] = Math.random() - 0.5; // x, - 0.5 positions the particle at the center
        positionsArray[i3 + 1] = Math.random() - 0.5; // y, - 0.5 positions the particle at the center
        positionsArray[i3 + 2] = Math.random() - 0.5; // z, - 0.5 positions the particle at the center
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3)); // the 3 parameter informs the GPU that it has to take 3 values per particle

    // Material
    const material = new THREE.ShaderMaterial({
        vertexShader: fireworkVertexShader,
        fragmentShader: fireworkFragmentShader,
        uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution)
        }
    });

    // Points
    const firework = new THREE.Points(geometry, material);
    firework.position.copy(position); // send the position to the fireworks, this will come in handy later for randomizing things
    scene.add(firework);
}

createFirework(
    100, // 100 particles 
    new THREE.Vector3(), // Position
    0.5 // Particle size
);

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()