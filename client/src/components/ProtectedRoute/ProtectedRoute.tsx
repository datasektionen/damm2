import React, { useContext } from 'react';
import { AdminContext } from '../../App';
import { Unauthorized } from '../../views/Unauthorized/Unauthorized';
import { SpinnerCover } from '../SpinnerCover/SpinnerCover';

interface Props {
    allowed: "prylis" | "admin";
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowed }) => {
    const { admin, loading: checkingToken } = useContext(AdminContext)
    
    if (checkingToken) return <SpinnerCover />

    if (allowed === "admin") {
        if (!admin.includes("admin")) {
            return <Unauthorized />
        }
    } else if (allowed === "prylis") {
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