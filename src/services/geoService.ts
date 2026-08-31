import * as turf from '@turf/turf'

export interface Location {
  latitude: number
  longitude: number
  name: string
}

export interface RoutePoint {
  customerId: string
  customerName: string
  latitude: number
  longitude: number
  order: number
  distance: number
  time: number
}

/**
 * Calcula distância entre dois pontos em km
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const from = turf.point([lon1, lat1])
  const to = turf.point([lon2, lat2])
  return turf.distance(from, to, { units: 'kilometers' })
}

/**
 * Otimiza sequência de visitas usando algoritmo Nearest Neighbor
 */
export function optimizeRoute(
  startPoint: Location,
  customers: Location[]
): RoutePoint[] {
  if (customers.length === 0) return []

  const visited = new Set<string>()
  const route: RoutePoint[] = []
  let currentPoint = startPoint
  let totalDistance = 0
  let order = 1

  // Adicionar ponto de partida
  visited.add(startPoint.name)

  while (visited.size <= customers.length) {
    let nearestCustomer: Location | null = null
    let nearestDistance = Infinity

    // Encontrar cliente mais próximo não visitado
    for (const customer of customers) {
      if (!visited.has(customer.name)) {
        const distance = calculateDistance(
          currentPoint.latitude,
          currentPoint.longitude,
          customer.latitude,
          customer.longitude
        )

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestCustomer = customer
        }
      }
    }

    if (!nearestCustomer) break

    visited.add(nearestCustomer.name)
    totalDistance += nearestDistance

    route.push({
      customerId: nearestCustomer.name,
      customerName: nearestCustomer.name,
      latitude: nearestCustomer.latitude,
      longitude: nearestCustomer.longitude,
      order,
      distance: nearestDistance,
      time: nearestDistance / 60, // Assumir 60 km/h
    })

    currentPoint = nearestCustomer
    order++
  }

  return route
}

/**
 * Calcula centroide de um polígono (para zoom em estado/cidade)
 */
export function getPolygonCenter(coordinates: any[]): [number, number] {
  try {
    const polygon = turf.polygon(coordinates)
    const center = turf.centroid(polygon)
    return [center.geometry.coordinates[1], center.geometry.coordinates[0]]
  } catch {
    return [0, 0]
  }
}

/**
 * Calcula área de um polígono em km²
 */
export function getPolygonArea(coordinates: any[]): number {
  try {
    const polygon = turf.polygon(coordinates)
    return turf.area(polygon) / 1000000 // Converter para km²
  } catch {
    return 0
  }
}

/**
 * Verifica se um ponto está dentro de um polígono
 */
export function isPointInPolygon(
  latitude: number,
  longitude: number,
  polygonCoordinates: any[]
): boolean {
  try {
    const point = turf.point([longitude, latitude])
    const polygon = turf.polygon(polygonCoordinates)
    return turf.booleanPointInPolygon(point, polygon)
  } catch {
    return false
  }
}

/**
 * Calcula densidade comercial (clientes por km²)
 */
export function calculateCommercialDensity(
  customerCount: number,
  areaKm2: number
): number {
  if (areaKm2 === 0) return 0
  return customerCount / areaKm2
}

/**
 * Classifica potencial de uma região
 */
export function classifyPotential(score: number): string {
  if (score >= 80) return 'Muito Alto'
  if (score >= 60) return 'Alto'
  if (score >= 40) return 'Médio'
  if (score >= 20) return 'Baixo'
  return 'Muito Baixo'
}

/**
 * Calcula score de cobertura
 */
export function calculateCoverageScore(
  coveredValue: number,
  totalPotential: number
): number {
  if (totalPotential === 0) return 0
  return (coveredValue / totalPotential) * 100
}
