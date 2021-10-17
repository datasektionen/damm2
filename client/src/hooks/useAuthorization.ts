import axios from 'axios';
import { useEffect, useState } from 'react'
import { url } from '../common/api';

// Hook that runs once on application mount. Checks the token (if any) and sets admin status and loading status
const useAuthorization = () => {
    const [admin, setAdmin] = useState<string[]>([]);
    const [user, setUser] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [hasToken, setHasToken] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setHasToken(true)
        axios.get(url("/api/check-token"), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            setAdmin(res.data.admin)
            setUser(res.data.user)
        })
        .catch(res => {
            setHasToken(false)
            setAdmin([])
            setUser("")
        })
        .finally(() => setLoading(false))
    }, [])

    return { admin, loading, hasToken, user }
}

export default useAuthorization;