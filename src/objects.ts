import * as THREE from 'three'
import { EarthConfig, JupiterConfig, MarsConfig, MercuryConfig, MoonConfig, NeptuneConfig, SaturnConfig, SunConfig, UranusConfig, VenusConfig } from './configs'
import { addRenderLoopCallback } from './main'

function createBasicPlanet(scene: THREE.Scene, radius: number, distance: number, color: THREE.ColorRepresentation, textureMapURL?: string) {
    let planetMaterial = new THREE.MeshBasicMaterial({ color })

    if (textureMapURL) {
        const texture = new THREE.TextureLoader().load(textureMapURL)
        planetMaterial = new THREE.MeshBasicMaterial({ map: texture })
    }

    const planetGeometry = new THREE.SphereGeometry(radius, 100, 100)
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    planet.position.set(distance, 0, 0)
    scene.add(planet)

    createOrbitOutline(scene, 0, 0, distance, distance, 'red')

    addRenderLoopCallback((timeStep) => {
        planet.position.set(distance * Math.cos(timeStep * (1000 / distance)), 0, distance * Math.sin(timeStep * (1000 / distance)))
    })

    return planet
}

function createOrbitOutline(scene: THREE.Scene, centerX: number, centerY: number, radiusX: number, radiusY: number, color: THREE.ColorRepresentation) {
    const orbitCurve = new THREE.EllipseCurve(centerX, centerY, radiusX, radiusY, 0, 2 * Math.PI,)
    const orbitPoints = orbitCurve.getPoints(10000)
    const orbit3DPoints = orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbit3DPoints)
    const orbitMaterial = new THREE.LineBasicMaterial({ color })
    const orbitEllipse = new THREE.LineLoop(orbitGeometry, orbitMaterial)
    scene.add(orbitEllipse)
    return () => scene.remove(orbitEllipse)
}

function createBasicSatellite(scene: THREE.Scene, parent: THREE.Mesh, radius: number, distance: number, color: THREE.ColorRepresentation, textureMapURL?: string) {
    let satelliteMaterial = new THREE.MeshBasicMaterial({ color })

    if (textureMapURL) {
        const texture = new THREE.TextureLoader().load(textureMapURL)
        satelliteMaterial = new THREE.MeshBasicMaterial({ map: texture })
    }

    const satelliteGeometry = new THREE.SphereGeometry(radius)
    const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)
    scene.add(satellite)

    let removeLastOrbitOutline = createOrbitOutline(scene, parent.position.x, parent.position.y, distance, distance, 'magenta')

    addRenderLoopCallback((timeStep) => {
        removeLastOrbitOutline()
        const parentX = parent.position.x
        const parentZ = parent.position.z
        removeLastOrbitOutline = createOrbitOutline(scene, parentX, parentZ, distance, distance, 'magenta')
        satellite.position.set(parentX - (distance * Math.cos(timeStep * (1000 / distance))), 0, parentZ - (distance * Math.sin(timeStep * (1000 / distance)))) // https://www.desmos.com/calculator/imgfwntxx4
    })

    return satellite
}

export function createSun(scene: THREE.Scene) {
    const sunGeometry = new THREE.SphereGeometry(SunConfig.radius, 250, 250)
    const sunTexture = new THREE.TextureLoader().load('sun-map.jpg')
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    const light = new THREE.PointLight('aqua', 2000, 0)
    light.position.copy(sun.position)
    scene.add(sun)
    scene.add(light)
    return sun
}

export function createMercury(scene: THREE.Scene) {
    return createBasicPlanet(scene, MercuryConfig.radius, MercuryConfig.distance, 'grey', 'mercury-map.jpg')
}

export function createVenus(scene: THREE.Scene) {
    return createBasicPlanet(scene, VenusConfig.radius, VenusConfig.distance, 'tan', 'venus-map.jpg')
}

export function createEarth(scene: THREE.Scene) {
    return createBasicPlanet(scene, EarthConfig.radius, EarthConfig.distance, 'green', 'earth-map.jpg')
}

export function createMars(scene: THREE.Scene) {
    return createBasicPlanet(scene, MarsConfig.radius, MarsConfig.distance, '#b37255', 'mars-map.jpg')
}

export function createJupiter(scene: THREE.Scene) {
    return createBasicPlanet(scene, JupiterConfig.radius, JupiterConfig.distance, '#e6aa5c', 'jupiter-map.jpg')
}

export function createSaturn(scene: THREE.Scene) {
    const saturn = createBasicPlanet(scene, SaturnConfig.radius, SaturnConfig.distance, 'tan', 'saturn-map.jpg')
    const saturnRingGeometry = new THREE.RingGeometry(SaturnConfig.radius + 30000, SaturnConfig.radius + 60000)
    const saturnRingMaterial = new THREE.MeshBasicMaterial({ color: 'gray', side: 2, transparent: true, opacity: 0.75 })
    const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial)
    scene.add(saturnRing)

    saturnRing.rotation.x = Math.PI / 1.75

    addRenderLoopCallback(() => {
        saturnRing.position.set(saturn.position.x, saturn.position.y, saturn.position.z)
    })

    return saturn
}

export function createUranus(scene: THREE.Scene) {
    return createBasicPlanet(scene, UranusConfig.radius, UranusConfig.distance, 'aqua', 'uranus-map.jpg')
}

export function createNeptune(scene: THREE.Scene) {
    return createBasicPlanet(scene, NeptuneConfig.radius, NeptuneConfig.distance, 'blue', 'neptune-map.jpg')
}

export function createMoon(scene: THREE.Scene, earth: THREE.Mesh) {
    return createBasicSatellite(scene, earth, MoonConfig.radius, MoonConfig.distance, 'gray', 'moon-map.jpg')
}