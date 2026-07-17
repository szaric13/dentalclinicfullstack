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
    if (_doctorsCache) {import { useEffect, useState } from "react"
      import { publicApi } from "../lib/services"

// Keš za podatke (ali sa mogućnošću osvežavanja)
      let _doctorsCache = null
      let _servicesCache = null
      let _doctorsPromise = null
      let _servicesPromise = null

      export function useDoctors() {
        const [doctors, setDoctors] = useState(_doctorsCache || [])
        const [loading, setLoading] = useState(!_doctorsCache)
        const [error, setError] = useState(null)

        const fetchDoctors = () => {
          setLoading(true)
          setError(null)

          // Resetujemo keš i promise da bi ponovo dohvatili sveže podatke
          _doctorsCache = null
          _doctorsPromise = null

          _doctorsPromise = publicApi.doctors()
          return _doctorsPromise
              .then((data) => {
                _doctorsCache = data
                setDoctors(data)
                setLoading(false)
              })
              .catch((e) => {
                _doctorsPromise = null
                setError(e)
                setLoading(false)
                throw e
              })
        }

        useEffect(() => {
          let active = true

          // Ako već imamo keš, koristimo ga
          if (_doctorsCache) {
            setDoctors(_doctorsCache)
            setLoading(false)
            return
          }

          // Ako nema keša, dohvatamo podatke
          if (!_doctorsPromise) {
            _doctorsPromise = publicApi.doctors()
          }

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

        // ✅ NOVO: refetch funkcija koja osvežava podatke
        const refetch = () => {
          return fetchDoctors()
        }

        return { doctors, loading, error, refetch }
      }

      export function useServices() {
        const [services, setServices] = useState(_servicesCache || [])
        const [loading, setLoading] = useState(!_servicesCache)
        const [error, setError] = useState(null)

        const fetchServices = () => {
          setLoading(true)
          setError(null)

          _servicesCache = null
          _servicesPromise = null

          _servicesPromise = publicApi.services()
          return _servicesPromise
              .then((data) => {
                _servicesCache = data
                setServices(data)
                setLoading(false)
              })
              .catch((e) => {
                _servicesPromise = null
                setError(e)
                setLoading(false)
                throw e
              })
        }

        useEffect(() => {
          let active = true

          if (_servicesCache) {
            setServices(_servicesCache)
            setLoading(false)
            return
          }

          if (!_servicesPromise) {
            _servicesPromise = publicApi.services()
          }

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

        // ✅ NOVO: refetch funkcija za servise
        const refetch = () => {
          return fetchServices()
        }

        return { services, loading, error, refetch }
      }
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
