import React, { useContext } from "react";

export const AdminContext = React.createContext<{ loading: boolean; admin: string[]; user: string; }>({ loading: true, admin: [], user: "" })

export const useAppContext = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAppContext must be used inside AdminContext.Provider")

    return context;
}