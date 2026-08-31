import { useState, useEffect } from 'react'

export interface GeoFeature {
  type: 'Feature'
  properties: {
    name: string
    code?: string
    type?: string
  }
  geometry: {
    type: string
    coordinates: any
  }
}

export interface GeoJSON {
  type: 'FeatureCollection'
  features: GeoFeature[]
}

export function useGeoData(filename: string) {
  const [data, setData] = useState<GeoJSON | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/geojson/${filename}`)
        if (!response.ok) throw new Error(`Failed to load ${filename}`)
        const geoData = await response.json()
        setData(geoData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchGeoData()
  }, [filename])

  return { data, loading, error }
}
