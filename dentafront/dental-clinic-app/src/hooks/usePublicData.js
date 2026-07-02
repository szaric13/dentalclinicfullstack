import { useEffect, useState } from "react"
import { publicApi } from "../lib/services"

let _doctorsCache = null
let _servicesCache = null
let _doctorsPromise = null
let _servicesPromise = null

export function useDoctors() {
  const [doctors, setDoctors] = useState(_doctorsCache || [])
  const [loading, setLoading] = useState(!_doctorsCache)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    if (_doctorsCache) {
      setDoctors(_doctorsCache)
      setLoading(false)
      return
    }
    if (!_doctorsPromise) _doctorsPromise = publicApi.doctors()
    _doctorsPromise
      .then((data) => {
        _doctorsCache = data
        if (active) setDoctors(data)
      })
      .catch((e) => {
        _doctorsPromise = null
        if (active) setError(e)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return { doctors, loading, error }
}

export function useServices() {
  const [services, setServices] = useState(_servicesCache || [])
  const [loading, setLoading] = useState(!_servicesCache)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    if (_servicesCache) {
      setServices(_servicesCache)
      setLoading(false)
      return
    }
    if (!_servicesPromise) _servicesPromise = publicApi.services()
    _servicesPromise
      .then((data) => {
        _servicesCache = data
        if (active) setServices(data)
      })
      .catch((e) => {
        _servicesPromise = null
        if (active) setError(e)
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return { services, loading, error }
}
