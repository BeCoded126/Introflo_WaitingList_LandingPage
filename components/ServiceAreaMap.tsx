'use client'

import { useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Circle } from '@react-google-maps/api'

const mapContainerStyle = {
  width: '100%',
  height: '400px',
}

const center = {
  lat: 39.8283,
  lng: -98.5795,
}

interface ServiceAreaMapProps {
  apiKey: string
  serviceAreas: Array<{
    id: string
    lat: number
    lng: number
    radiusMiles: number
  }>
  facilityId?: string
  onAreaChange?: (areas: Array<{
    lat: number
    lng: number
    radiusMiles: number
  }>) => void
  isEditable?: boolean
}

export default function ServiceAreaMap({
  apiKey,
  serviceAreas,
  onAreaChange,
  isEditable = false,
}: ServiceAreaMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [circles, setCircles] = useState(serviceAreas)

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds()
    circles.forEach(({ lat, lng }) => {
      bounds.extend({ lat, lng })
    })
    map.fitBounds(bounds)
    setMap(map)
  }, [circles])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleCircleRadiusChange = (index: number, radius: number) => {
    const newCircles = [...circles]
    newCircles[index] = {
      ...newCircles[index],
      radiusMiles: radius / 1609.34, // Convert meters to miles
    }
    setCircles(newCircles)
    onAreaChange?.(newCircles)
    saveAreas(newCircles)
  }

  const handleCircleCenterChange = (index: number, center: google.maps.LatLng) => {
    const newCircles = [...circles]
    newCircles[index] = {
      ...newCircles[index],
      lat: center.lat(),
      lng: center.lng(),
    }
    setCircles(newCircles)
    onAreaChange?.(newCircles)
    saveAreas(newCircles)
  }

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!isEditable || !event.latLng) return

    const newCircle = {
      id: Date.now().toString(),
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      radiusMiles: 10,
    }

    const newCircles = [...circles, newCircle]
    setCircles(newCircles)
    onAreaChange?.(newCircles)
    saveAreas(newCircles)
  }

  async function saveAreas(areasToSave: typeof circles) {
    try {
      // Try to persist to API if facilityId is provided
      if (!facilityId) return

      await fetch('/api/service-areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityId, areas: areasToSave }),
      })
    } catch (err) {
      console.error('Failed to save service areas', err)
    }
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={4}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {circles.map((circle, index) => (
          <Circle
            key={circle.id}
            center={{ lat: circle.lat, lng: circle.lng }}
            radius={circle.radiusMiles * 1609.34} // Convert miles to meters
            options={{
              fillColor: '#3B82F6',
              fillOpacity: 0.3,
              strokeColor: '#2563EB',
              strokeOpacity: 1,
              strokeWeight: 2,
              editable: isEditable,
              draggable: isEditable,
            }}
            onRadiusChanged={(e) => {
              if (e && e.target instanceof google.maps.Circle) {
                handleCircleRadiusChange(index, e.target.getRadius())
              }
            }}
            onCenterChanged={(e) => {
              if (e && e.target instanceof google.maps.Circle) {
                handleCircleCenterChange(index, e.target.getCenter()!)
              }
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}