import { useEffect } from "react";
import { useLocation, Location } from "react-router-dom";

export const ScrollToTop: React.FC = props => {
    const location = useLocation();

    useEffect(() => {
        const { state, pathname }: (Location & { state: any }) = location;
        if (state && state.from === pathname ) {
            // Don't scroll to top in when routing to where we are
        } else {
            window.scrollTo(0, 0);
        }

    }, [location]);

    return null;
}