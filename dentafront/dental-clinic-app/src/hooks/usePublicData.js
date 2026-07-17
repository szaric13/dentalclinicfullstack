import { useEffect, useState } from "react"
import { publicApi } from "../lib/services"

let _doctorsCache = null
let _nursesCache = null
let _servicesCache = null
let _doctorsPromise = null
let _nursesPromise = null
let _servicesPromise = null

export function useDoctors() {
    const [doctors, setDoctors] = useState(_doctorsCache || [])
    const [loading, setLoading] = useState(!_doctorsCache)
    const [error, setError] = useState(null)

    const fetchDoctors = () => {
        setLoading(true)
        setError(null)
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
        return () => { active = false }
    }, [])

    const refetch = fetchDoctors
    return { doctors, loading, error, refetch }
}

// ✅ NOVI HOOK za sestre
export function useNurses() {
    const [nurses, setNurses] = useState(_nursesCache || [])
    const [loading, setLoading] = useState(!_nursesCache)
    const [error, setError] = useState(null)

    const fetchNurses = () => {
        setLoading(true)
        setError(null)
        _nursesCache = null
        _nursesPromise = null
        _nursesPromise = publicApi.nurses()
        return _nursesPromise
            .then((data) => {
                _nursesCache = data
                setNurses(data)
                setLoading(false)
            })
            .catch((e) => {
                _nursesPromise = null
                setError(e)
                setLoading(false)
                throw e
            })
    }

    useEffect(() => {
        let active = true
        if (_nursesCache) {
            setNurses(_nursesCache)
            setLoading(false)
            return
        }
        if (!_nursesPromise) _nursesPromise = publicApi.nurses()
        _nursesPromise
            .then((data) => {
                _nursesCache = data
                if (active) setNurses(data)
            })
            .catch((e) => {
                _nursesPromise = null
                if (active) setError(e)
            })
            .finally(() => active && setLoading(false))
        return () => { active = false }
    }, [])

    const refetch = fetchNurses
    return { nurses, loading, error, refetch }
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
        return () => { active = false }
    }, [])

    const refetch = fetchServices
    return { services, loading, error, refetch }
}