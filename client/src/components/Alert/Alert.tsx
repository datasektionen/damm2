import React from 'react';
import { ErrorAlert, SuccessAlert } from './style';

interface Props {
    type: "error" | "success";
}

export const Alert: React.FC<Props> = ({ children, type }) => {
    return (
        <>
            {type === "error" && <ErrorAlert>{children}</ErrorAlert>}
            {type === "success" && <SuccessAlert>{children}</SuccessAlert>}
        </>
    )
}