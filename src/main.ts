import * as THREE from 'three'
import { createEarth, createJupiter, createMars, createMercury, createNeptune, createSaturn, createSun, createUranus, createVenus } from './objects'
import './style.css'
import { TrackballControls } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e8)
camera.position.z = 1000

const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambientLight)

const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new TrackballControls(camera, renderer.domElement)
// controls.rotateSpeed = 5.0
// controls.zoomSpeed = 2.0
// controls.panSpeed = 1.0
// controls.noZoom = false
// controls.noPan = false
// controls.staticMoving = true
// controls.dynamicDampingFactor = 0.3

let renderLoopCallbacks: (() => void)[] = []
export const addRenderLoopCallback = (callback: (() => void)) => {
    renderLoopCallbacks.push(callback)
}

let timeStep = 0
export const getTimeStep = () => timeStep

const Sun = createSun(scene)
const Mercury = createMercury(scene)
const Venus = createVenus(scene)
const Earth = createEarth(scene)
const Mars = createMars(scene)
const Jupiter = createJupiter(scene)
const Saturn = createSaturn(scene)
const Uranus = createUranus(scene)
const Neptune = createNeptune(scene)

const objects = [Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune]

let focusedObjectIndex = 0
const cameraOffset = new THREE.Vector3(0, 0, 300)


function slideRight() {
    if (focusedObjectIndex < objects.length - 1) {
        focusedObjectIndex++
    }
}

function slideLeft() {
    if (focusedObjectIndex > 0) {
        focusedObjectIndex--
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') slideRight()
    if (e.key === 'ArrowLeft') slideLeft()
    console.log('Focused index:', focusedObjectIndex)
})

const renderLoop = () => {
    timeStep += 0.01
    controls.update()
    renderLoopCallbacks.forEach(cb => cb())
    camera.lookAt(objects[focusedObjectIndex].position)
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(renderLoop)
