import { useState, useEffect } from 'react'

const PREFIX = "codepen-clone-"

export default function LocalStorage(key, initialValue) {
    const prefixedKey = PREFIX + key;
    const [value, setValue] = useState(() => {
        const item = localStorage.getItem(prefixedKey);
        if (item != null) return JSON.parse(item);

        if (typeof initialValue === "function") {
            return initialValue();
        }
        return initialValue;
    }
    );

    useEffect(() => {
        localStorage.setItem(prefixedKey, JSON.stringify(value));
    }, [prefixedKey,value]);

    return (
        [value, setValue]
    )
}
