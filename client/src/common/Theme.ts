const Theme = {
    palette: {
        yellow: "#E5C100",
        cerise: "#E83D84",
        blackgrey: "#333333",
        taggrey: "#D1D1D1F9",
        taggreyhover: "#A7A7A7F9",
        red: "#D73A4A",
        blue: "#2196F3"
    },
    sizes: {
        maxContainerWidth: 1240,
    }
};

export const px = (n: number) => `${n}px`;
export const maxWidth = (width: number) => `@media (max-width: ${width}px)`;

export default Theme;