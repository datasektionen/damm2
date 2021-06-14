import { useEffect, useState } from "react"

const isSmallScreen = (mediaQuery : any): boolean => {
    return mediaQuery.matches ? true : false;
}

const useScreenSizeChecker = (breakpoint: number) => {
    const [small, setIsSmallScreen] = useState<boolean>(false);

    useEffect(() => {
        const mediaQuery : MediaQueryList = window.matchMedia(`(max-width: ${breakpoint}px)`);
        mediaQuery.addEventListener("change", () => {
            setIsSmallScreen(isSmallScreen(mediaQuery));
        });
        // Initial check
        setIsSmallScreen(isSmallScreen(mediaQuery));
        localStorage.setItem("isSmallScreen", isSmallScreen(mediaQuery) + "");
        
        return () => {
            mediaQuery.removeEventListener("change", () => {
                setIsSmallScreen(isSmallScreen(mediaQuery));
            });
        }
    }, [])

    return small
}

export default useScreenSizeChecker