import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ROUTES } from "../../common/routes";

export const ScrollToTop: React.FC = props => {
    const history = useHistory()

    useEffect(() => {
        const unlisten = history.listen(({ pathname, search, state }: any) => {
            if (state && state.from === pathname) {
                // Don't scroll to top in when routing to where we are
            } else {
                window.scrollTo(0, 0);
            }
        })

        return () => {
            unlisten();
        }
    })

    return null;
}