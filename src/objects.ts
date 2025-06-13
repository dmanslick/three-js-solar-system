import * as THREE from 'three'
import { EarthConfig, JupiterConfig, MarsConfig, MercuryConfig, NeptuneConfig, SaturnConfig, SunConfig, UranusConfig, VenusConfig } from './configs'
import { addRenderLoopCallback, getTimeStep } from './main'

function createBasicPlanet(scene: THREE.Scene, radius: number, distance: number, color: THREE.ColorRepresentation) {
    const planetGeometry = new THREE.SphereGeometry(radius)
    const planetMaterial = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.5, roughness: 0.4,
        metalness: 0.1
    })
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    planet.position.set(0, distance, 0)
    scene.add(planet)

    const orbitCurve = new THREE.EllipseCurve(
        0, 0,                  // center
        distance, distance,    // xRadius, yRadius
        0, 2 * Math.PI,        // startAngle, endAngle
        false,                 // clockwise
        0                      // rotation
    )

    const orbitPoints = orbitCurve.getPoints(100)
    const orbit3DPoints = orbitPoints.map(p => new THREE.Vector3(p.x, p.y, 0))
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbit3DPoints)
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 'red' })
    const orbitEllipse = new THREE.LineLoop(orbitGeometry, orbitMaterial)
    scene.add(orbitEllipse)


    addRenderLoopCallback(() => {
        const timeStep = getTimeStep()
        planet.position.set(distance * Math.cos(timeStep * (1000 / distance)), distance * Math.sin(timeStep * (1000 / distance)), 0)
    })

    return planet
}

export function createSun(scene: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(SunConfig.radius)
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' })
    const sun = new THREE.Mesh(geometry, material)
    const light = new THREE.PointLight('white', 20, 0)
    light.position.copy(sun.position)
    scene.add(sun)
    scene.add(light)
    return sun
}

export function createMercury(scene: THREE.Scene) {
    return createBasicPlanet(scene, MercuryConfig.radius, MercuryConfig.distance, 'grey')
}

export function createVenus(scene: THREE.Scene) {
    return createBasicPlanet(scene, VenusConfig.radius, VenusConfig.distance, 'tan')
}

export function createEarth(scene: THREE.Scene) {
    return createBasicPlanet(scene, EarthConfig.radius, EarthConfig.distance, 'green')
}

export function createMars(scene: THREE.Scene) {
    return createBasicPlanet(scene, MarsConfig.radius, MarsConfig.distance, 'orange')
}

export function createJupiter(scene: THREE.Scene) {
    return createBasicPlanet(scene, JupiterConfig.radius, JupiterConfig.distance, 'tan')
}

export function createSaturn(scene: THREE.Scene) {
    return createBasicPlanet(scene, SaturnConfig.radius, SaturnConfig.distance, 'tan')
}

export function createUranus(scene: THREE.Scene) {
    return createBasicPlanet(scene, UranusConfig.radius, UranusConfig.distance, 'aqua')
}

export function createNeptune(scene: THREE.Scene) {
    return createBasicPlanet(scene, NeptuneConfig.radius, NeptuneConfig.distance, 'blue')
}