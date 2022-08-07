import { useState, useEffect } from 'react'

const PREFIX = "message-app-"

export default function useLocalStorage(key, initialValue) {
    const PREFIXED_KEY = PREFIX + key
    const [value, setValue] = useState(() => {
        const json = localStorage.getItem(PREFIXED_KEY)
        if (json != null) return JSON.parse(json)
        if (typeof initialValue === "function") {return initialValue()}
        else {return initialValue}
    })

    useEffect(() => {
        localStorage.setItem(PREFIXED_KEY, JSON.stringify(value))
    }, [PREFIXED_KEY, value])

    return [value, setValue]
}
