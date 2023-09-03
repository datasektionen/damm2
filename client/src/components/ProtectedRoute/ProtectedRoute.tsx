import React from 'react';
import { Unauthorized } from '../../views/Unauthorized/Unauthorized';
import { SpinnerCover } from '../SpinnerCover/SpinnerCover';
import { useAppContext } from '../../hooks/useAppContext';

interface Props {
    allowed: ("prylis" | "admin" | "post")[];
}
// Component that protects a route.
export const ProtectedRoute: React.FC<Props> = ({ children, allowed }) => {
    const { admin, loading: checkingToken } = useAppContext()
    
    if (checkingToken) return <SpinnerCover />

    if (allowed.includes("post")) {
        if (!admin.includes("post") && !admin.includes("admin")) {
            return <Unauthorized />
        }
    } else if (allowed.includes("prylis")) {
        if (!(admin.includes("admin") || admin.includes("prylis"))) {
            return <Unauthorized />
        }
    }

    return (
        <>
            {children}
        </>
    )
}