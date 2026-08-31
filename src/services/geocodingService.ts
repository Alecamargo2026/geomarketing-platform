// @ts-ignore
import NodeGeocoder from 'node-geocoder'

// Cache em memória (em produção, usar Redis)
const geocodeCache: Record<string, { latitude: number; longitude: number }> = {}

// Coordenadas aproximadas dos bairros do RJ (fallback)
const RJ_BAIRROS_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'GARDENIA AZUL': { latitude: -22.95, longitude: -43.35 },
  'JACAREPAGUA': { latitude: -22.98, longitude: -43.38 },
  'JACAREPAGUÁ': { latitude: -22.98, longitude: -43.38 },
  'LEBLON': { latitude: -22.98, longitude: -43.23 },
  'BARRA DA TIJUCA': { latitude: -23.01, longitude: -43.36 },
  'ANIL': { latitude: -22.96, longitude: -43.42 },
  'CATETE': { latitude: -22.92, longitude: -43.18 },
  'CENTRO': { latitude: -22.90, longitude: -43.18 },
  'COPACABANA': { latitude: -22.98, longitude: -43.19 },
  'IPANEMA': { latitude: -22.99, longitude: -43.20 },
  'BOTAFOGO': { latitude: -22.95, longitude: -43.19 },
  'FLAMENGO': { latitude: -22.92, longitude: -43.18 },
  'GLORIA': { latitude: -22.91, longitude: -43.18 },
  'LAPA': { latitude: -22.91, longitude: -43.18 },
  'SANTA TERESA': { latitude: -22.91, longitude: -43.21 },
  'TIJUCA': { latitude: -22.96, longitude: -43.23 },
  'VILA ISABEL': { latitude: -22.93, longitude: -43.24 },
  'MARACANA': { latitude: -22.92, longitude: -43.23 },
  'SAO CRISTOVAO': { latitude: -22.90, longitude: -43.23 },
  'PENHA': { latitude: -22.86, longitude: -43.28 },
  'IRAJÁ': { latitude: -22.82, longitude: -43.32 },
  'CAMPO GRANDE': { latitude: -22.90, longitude: -43.56 },
  'SANTA CRUZ': { latitude: -22.95, longitude: -43.70 },
  'BANGU': { latitude: -22.88, longitude: -43.48 },
  'REALENGO': { latitude: -22.87, longitude: -43.52 },
  'PADRE MIGUEL': { latitude: -22.88, longitude: -43.54 },
  'INHAUMA': { latitude: -22.88, longitude: -43.28 },
  'MEIER': { latitude: -22.89, longitude: -43.29 },
  'RAMOS': { latitude: -22.84, longitude: -43.25 },
  'OLARIA': { latitude: -22.83, longitude: -43.27 },
  'PIEDADE': { latitude: -22.85, longitude: -43.30 },
  'ENGENHO NOVO': { latitude: -22.90, longitude: -43.30 },
  'ENGENHO DE DENTRO': { latitude: -22.91, longitude: -43.31 },
  'ENCANTADO': { latitude: -22.92, longitude: -43.32 },
  'CACHAMBI': { latitude: -22.89, longitude: -43.32 },
  'HIGIENOPOLIS': { latitude: -22.88, longitude: -43.33 },
  'TODOS OS SANTOS': { latitude: -22.87, longitude: -43.34 },
  'ANDARAI': { latitude: -22.94, longitude: -43.25 },
  'GRAJAÚ': { latitude: -22.97, longitude: -43.27 },
  'SAUDE': { latitude: -22.96, longitude: -43.28 },
  'MADUREIRA': { latitude: -22.87, longitude: -43.35 },
  'OSWALDO CRUZ': { latitude: -22.86, longitude: -43.36 },
  'BONSUCESSO': { latitude: -22.84, longitude: -43.26 },
  'CIDADE NOVA': { latitude: -22.91, longitude: -43.20 },
  'SANTO CRISTO': { latitude: -22.89, longitude: -43.20 },
  'VILA DA PENHA': { latitude: -22.85, longitude: -43.28 },
}

/**
 * Geocodifica um bairro do RJ
 * Tenta Nominatim API primeiro, depois fallback para coordenadas aproximadas
 */
export async function geocodeBairro(
  bairro: string,
  cidade: string = 'Rio de Janeiro',
  estado: string = 'RJ'
): Promise<{ latitude: number; longitude: number }> {
  const cacheKey = `${bairro}-${cidade}-${estado}`
  
  // Verificar cache
  if (geocodeCache[cacheKey]) {
    return geocodeCache[cacheKey]
  }
  
  // Verificar fallback
  const normalized = bairro.toUpperCase().trim()
  if (RJ_BAIRROS_COORDS[normalized]) {
    const coords = RJ_BAIRROS_COORDS[normalized]
    geocodeCache[cacheKey] = coords
    return coords
  }
  
  try {
    // Tentar Nominatim API (gratuito, sem API key)
    const options: any = {
      provider: 'openstreetmap',
      timeout: 5000,
    }
    
    const geocoder = NodeGeocoder(options)
    const results = await geocoder.geocode({
      address: `${bairro}, ${cidade}, ${estado}, Brazil`,
    } as any)
    
    if (results && results.length > 0) {
      const coords = {
        latitude: results[0].latitude || 0,
        longitude: results[0].longitude || 0,
      }
      geocodeCache[cacheKey] = coords
      return coords
    }
  } catch (error) {
    console.warn(`Geocoding failed for ${bairro}:`, error)
  }
  
  // Fallback: retornar coordenadas aproximadas do RJ
  const defaultCoords = { latitude: -22.90, longitude: -43.20 }
  geocodeCache[cacheKey] = defaultCoords
  return defaultCoords
}

/**
 * Geocodifica múltiplos bairros em batch
 */
export async function batchGeocode(
  bairros: string[],
  cidade: string = 'Rio de Janeiro',
  estado: string = 'RJ'
): Promise<Record<string, { latitude: number; longitude: number }>> {
  const results: Record<string, { latitude: number; longitude: number }> = {}
  
  for (const bairro of bairros) {
    try {
      results[bairro] = await geocodeBairro(bairro, cidade, estado)
      // Rate limit: 1 request por segundo (Nominatim policy)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error geocoding ${bairro}:`, error)
      results[bairro] = { latitude: -22.90, longitude: -43.20 }
    }
  }
  
  return results
}

/**
 * Limpar cache (útil para testes)
 */
export function clearGeocodeCache() {
  Object.keys(geocodeCache).forEach(key => delete geocodeCache[key])
}
