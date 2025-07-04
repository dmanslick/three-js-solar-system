import * as THREE from 'three'
import { createEarth, createJupiter, createMars, createMercury, createMoon, createNeptune, createSaturn, createSun, createUranus, createVenus, disableOrbitOutlines, enableOrbitOutlines } from './objects'
import './style.css'
import { EffectComposer, RenderPass, TrackballControls, UnrealBloomPass } from 'three/examples/jsm/Addons.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e10)
camera.position.z = 1000

const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambientLight)


const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85) // sun bloom
composer.addPass(bloomPass)

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

const BASE_TIME_STEP = 0.1

let timeStep = 0
let timeStepIncrement = BASE_TIME_STEP

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

interface Info {
    title: string,
    blurb: string
}

const infoMap = new Map<THREE.Mesh, Info>()

infoMap.set(Sun, { title: 'The Sun', blurb: 'The sun, not much else too it...' })
infoMap.set(Mercury, { title: 'Mercury', blurb: 'No one cares about this one' })
infoMap.set(Venus, { title: 'Venus', blurb: 'Very thick atmosphere' })
infoMap.set(Earth, { title: 'Earth', blurb: 'You are here' })
infoMap.set(Moon, { title: 'The Moon', blurb: 'Have you ever seen the far side?' })
infoMap.set(Mars, { title: 'Mars', blurb: 'The red one' })
infoMap.set(Jupiter, { title: 'Jupiter', blurb: 'Nice spot' })
infoMap.set(Saturn, { title: 'Saturn', blurb: 'Rings are cool' })
infoMap.set(Uranus, { title: 'Uranus', blurb: 'I like the color of this one' })
infoMap.set(Neptune, { title: 'Neptune', blurb: 'The last planet, according to some...' })

let focusedObjectIndex = 0
let relativeCameraOffset = new THREE.Vector3(0, 0, 100)

const infoTitle = document.getElementById('info-title')!
const infoBlurb = document.getElementById('info-blurb')!
const infoContainer = document.getElementById('info-container')!
const toggleInfoButton = document.getElementById('toggle-info')!
const toggleOrbitOutlinesButton = document.getElementById('toggle-orbit-outlines')!
const previousObjectButton = document.getElementById('previous-object')!
const nextObjectButton = document.getElementById('next-object')!

function toggleInfo() {
    if (infoContainer.style.display == 'none') {
        infoContainer.style.display = 'flex'
    } else {
        infoContainer.style.display = 'none'
    }
}

function focusOnObject() {
    const focus = objects[focusedObjectIndex]
    relativeCameraOffset = camera.position.clone().sub(controls.target)
    controls.target.copy(focus.position.clone())
    const data = infoMap.get(focus)!
    infoTitle.innerText = data.title
    infoBlurb.innerText = data.blurb
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

let orbitOutlinesEnabled = true

function toggleOrbitOutlines() {
    orbitOutlinesEnabled = !orbitOutlinesEnabled
    if (orbitOutlinesEnabled) {
        enableOrbitOutlines()
    } else {
        disableOrbitOutlines()
    }
}

toggleInfoButton.addEventListener('click', toggleInfo)
toggleOrbitOutlinesButton.addEventListener('click', toggleOrbitOutlines)
previousObjectButton.addEventListener('click', slideLeft)
nextObjectButton.addEventListener('click', slideRight)

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') slideRight()
    if (e.key === 'ArrowLeft') slideLeft()
    if (e.key === 'o') toggleOrbitOutlines()
    if (e.key === 'i') toggleInfo()
    console.log('Focused index:', focusedObjectIndex)
})

const renderLoop = () => {
    timeStep += timeStepIncrement
    renderLoopCallbacks.forEach(cb => cb(timeStep))

    const focusObject = objects[focusedObjectIndex]

    controls.target.copy(focusObject.position)
    camera.position.copy(focusObject.position.clone().add(relativeCameraOffset))

    controls.update()
    relativeCameraOffset = camera.position.clone().sub(controls.target)

    // renderer.render(scene, camera)
    composer.render()
}

renderer.setAnimationLoop(renderLoop)

const speedInput = document.getElementById('speed-input') as HTMLInputElement

speedInput?.addEventListener('change', (e: Event) => {
    const input = e.target as HTMLInputElement
    const multiplier = Number(input.value)
    timeStepIncrement = BASE_TIME_STEP * multiplier
})

speedInput.addEventListener('beforeinput', (e: InputEvent) => {
    if (e.data && !/^\d+$/.test(e.data)) {
        e.preventDefault()
    }
})

let stoppedTimeIncrementStep = 0
let stopped = false

const stopButton = document.getElementById('stop-button')
const resumeButton = document.getElementById('resume-button')

stopButton?.addEventListener('click', () => {
    if (!stopped) {
        stoppedTimeIncrementStep = timeStepIncrement
        stopped = true
    }
    timeStepIncrement = 0
    speedInput.disabled = true
})

resumeButton?.addEventListener('click', () => {
    timeStepIncrement = stoppedTimeIncrementStep
    stopped = false
    speedInput.disabled = false
})

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

window.addEventListener('load', () => {
    const data = infoMap.get(Sun)!
    infoTitle.innerText = data.title
    infoBlurb.innerText = data.blurb
})