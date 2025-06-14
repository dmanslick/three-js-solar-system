interface Config {
    radius: number
    distance: number
}

// https://www.jpl.nasa.gov/_edu/pdfs/scaless_reference.pdf
const SIZE_SCALAR = 0.0005
const DISTANCE_SCALAR = 0.00001
const PLANET_SCALAR = 4

const makeConfig = (diameter: number, distance: number): Config => {
    return { radius: diameter / 2 * SIZE_SCALAR, distance: distance * DISTANCE_SCALAR }
}

export const SunConfig = makeConfig(1391400, 0)
export const MercuryConfig = makeConfig(4879 * PLANET_SCALAR, 57900000)
export const VenusConfig = makeConfig(12104 * PLANET_SCALAR, 108200000)
export const EarthConfig = makeConfig(12756 * PLANET_SCALAR, 149600000)
export const MarsConfig = makeConfig(6792 * PLANET_SCALAR, 227900000)
export const JupiterConfig = makeConfig(142984 * PLANET_SCALAR, 778600000)
export const SaturnConfig = makeConfig(120536 * PLANET_SCALAR, 1433500000)
export const UranusConfig = makeConfig(51118 * PLANET_SCALAR, 2872500000)
export const NeptuneConfig = makeConfig(49528 * PLANET_SCALAR, 4495100000)
export const MoonConfig = makeConfig(3475 * PLANET_SCALAR, 383500)