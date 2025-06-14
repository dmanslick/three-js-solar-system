import * as THREE from 'three'
import { EarthConfig, JupiterConfig, MarsConfig, MercuryConfig, MoonConfig, NeptuneConfig, SaturnConfig, SunConfig, UranusConfig, VenusConfig } from './configs'
import { addRenderLoopCallback } from './main'

function createBasicPlanet(scene: THREE.Scene, radius: number, distance: number, color: THREE.ColorRepresentation) {
    const planetGeometry = new THREE.SphereGeometry(radius)
    const planetMaterial = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.1 })
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    planet.position.set(0, distance, 0)
    scene.add(planet)

    createOrbitOutline(scene, 0, 0, distance, distance, 'red')

    addRenderLoopCallback((timeStep) => {
        planet.position.set(distance * Math.cos(timeStep * (1000 / distance)), distance * Math.sin(timeStep * (1000 / distance)), 0)
    })

    return planet
}

function createOrbitOutline(scene: THREE.Scene, centerX: number, centerY: number, radiusX: number, radiusY: number, color: THREE.ColorRepresentation) {
    const orbitCurve = new THREE.EllipseCurve(centerX, centerY, radiusX, radiusY, 0, 2 * Math.PI,)
    const orbitPoints = orbitCurve.getPoints(250)
    const orbit3DPoints = orbitPoints.map(p => new THREE.Vector3(p.x, p.y, 0))
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbit3DPoints)
    const orbitMaterial = new THREE.LineBasicMaterial({ color })
    const orbitEllipse = new THREE.LineLoop(orbitGeometry, orbitMaterial)
    scene.add(orbitEllipse)
    return () => scene.remove(orbitEllipse)
}

function createBasicSatellite(scene: THREE.Scene, parent: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>, radius: number, distance: number, color: THREE.ColorRepresentation) {
    const satelliteGeometry = new THREE.SphereGeometry(radius)
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color })
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
    scene.add(satellite)

    let removeLastOrbitOutline = createOrbitOutline(scene, parent.position.x, parent.position.y, distance, distance, 'magenta')

    addRenderLoopCallback((timeStep) => {
        removeLastOrbitOutline()
        const parentX = parent.position.x
        const parentY = parent.position.y
        removeLastOrbitOutline = createOrbitOutline(scene, parentX, parentY, distance, distance, 'magenta')
        satellite.position.set(parentX - (distance * Math.cos(timeStep * (1000 / distance))), parentY - (distance * Math.sin(timeStep * (1000 / distance))), 0) // https://www.desmos.com/calculator/imgfwntxx4
    })

    return satellite
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
    return createBasicPlanet(scene, MarsConfig.radius, MarsConfig.distance, '#b37255')
}

export function createJupiter(scene: THREE.Scene) {
    return createBasicPlanet(scene, JupiterConfig.radius, JupiterConfig.distance, '#e6aa5c')
}

export function createSaturn(scene: THREE.Scene) {
    const saturn = createBasicPlanet(scene, SaturnConfig.radius, SaturnConfig.distance, 'tan')
    const saturnRingGeometry = new THREE.RingGeometry(SaturnConfig.radius + 60, SaturnConfig.radius + 110)
    const saturnRingMaterial = new THREE.MeshBasicMaterial({ color: 'gray', side: 2, transparent: true, opacity: 0.75 })
    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial)
    scene.add(saturnRing)

    saturnRing.rotateX(Math.PI * 0.05)

    addRenderLoopCallback(() => {
        saturnRing.position.set(saturn.position.x, saturn.position.y, saturn.position.z)
    })

    return saturn
}

export function createUranus(scene: THREE.Scene) {
    return createBasicPlanet(scene, UranusConfig.radius, UranusConfig.distance, 'aqua')
}

export function createNeptune(scene: THREE.Scene) {
    return createBasicPlanet(scene, NeptuneConfig.radius, NeptuneConfig.distance, 'blue')
}

export function createMoon(scene: THREE.Scene, earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial, THREE.Object3DEventMap>) {
    return createBasicSatellite(scene, earth, MoonConfig.radius, 75, 'gray')
}