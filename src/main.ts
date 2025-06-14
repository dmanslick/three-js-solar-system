import * as THREE from 'three'
import { createEarth, createJupiter, createMars, createMercury, createMoon, createNeptune, createSaturn, createSun, createUranus, createVenus } from './objects'
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

let renderLoopCallbacks: ((timeStep: number) => void)[] = []
export const addRenderLoopCallback = (callback: ((timeStep: number) => void)) => {
    renderLoopCallbacks.push(callback)
}

let timeStep = 0
let timeStepIncrement = 0.0001

const Sun = createSun(scene)
const Mercury = createMercury(scene)
const Venus = createVenus(scene)
const Earth = createEarth(scene)
const Mars = createMars(scene)
const Jupiter = createJupiter(scene)
const Saturn = createSaturn(scene)
const Uranus = createUranus(scene)
const Neptune = createNeptune(scene)
const Moon = createMoon(scene, Earth)

const objects = [Sun, Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune]

let focusedObjectIndex = 0
let relativeCameraOffset = new THREE.Vector3(0, 0, 100)

function focusOnObject() {
    const focus = objects[focusedObjectIndex]
    relativeCameraOffset = camera.position.clone().sub(controls.target)
    controls.target.copy(focus.position.clone())
}

function slideRight() {
    if (focusedObjectIndex < objects.length - 1) {
        focusedObjectIndex++
        focusOnObject()
    }
}

function slideLeft() {
    if (focusedObjectIndex > 0) {
        focusedObjectIndex--
        focusOnObject()
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') slideRight()
    if (e.key === 'ArrowLeft') slideLeft()
    console.log('Focused index:', focusedObjectIndex)
})

const renderLoop = () => {
    timeStep += timeStepIncrement

    const focusObject = objects[focusedObjectIndex]

    controls.target.copy(focusObject.position)
    camera.position.copy(focusObject.position.clone().add(relativeCameraOffset))

    controls.update()
    relativeCameraOffset = camera.position.clone().sub(controls.target)

    renderLoopCallbacks.forEach(cb => cb(timeStep))
    renderer.render(scene, camera)
}

renderer.setAnimationLoop(renderLoop)

const speedDisplay = document.getElementById("speed-display") as HTMLSpanElement
const speedSlider = document.getElementById("speed-slider") as HTMLInputElement

speedSlider?.addEventListener("change", (e: Event) => {
    const input = e.target as HTMLInputElement
    const percent = Number(input.value)
    timeStepIncrement = 0.0001 * percent
    speedDisplay.innerText = percent.toString()
})

let stoppedTimeIncrementStep = 0

const stopButton = document.getElementById('stop-button')
const resumeButton = document.getElementById('resume-button')

stopButton?.addEventListener('click', () => {
    stoppedTimeIncrementStep = timeStepIncrement
    timeStepIncrement = 0
    speedSlider.disabled = true
})

resumeButton?.addEventListener('click', () => {
    timeStepIncrement = stoppedTimeIncrementStep
    speedSlider.disabled = false
})

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
})