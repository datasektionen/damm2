import axios from 'axios';
import { useEffect, useState } from 'react'
import { url } from '../common/api';

// Hook that runs once on application mount. Checks the token (if any) and sets admin status and loading status
const useAuthorization = () => {
    const [admin, setAdmin] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get(url(`/api/check-token?token=${token}`))
        .then(res => setAdmin(res.data.admin))
        .catch(res => {
            setAdmin([])
            setLoading(false)
        })
        .finally(() => setLoading(false))
    }, [])


    return { admin, loading }
}

export default useAuthorization;