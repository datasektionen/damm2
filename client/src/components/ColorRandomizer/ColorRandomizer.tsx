import React, { useEffect } from 'react';
import { StyledColorRandomizer } from './style';

interface Props {
    type: "background" | "color";
    color: string;
    backgroundColor: string;
    setColors: (color: string, bg: string) => void;
    disabled?: boolean;
}

export const ColorRandomizer: React.FC<Props> = ({ backgroundColor, color, setColors, type, disabled }) => {

    const randomizeColor = () => {
        let alphabet = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += alphabet[Math.floor(Math.random() * 16)];
        }
        return color
    }
    
    const randomizeBackgroundColor = () => {
        let bgColor = randomizeColor()
        // http://www.w3.org/TR/AERT#color-contrast
        const brightness = Math.round(((parseInt(bgColor.substring(1,3), 16) * 299) +
                            (parseInt(bgColor.substring(3,5), 16) * 587) +
                            (parseInt(bgColor.substring(5,7), 16) * 114)) / 1000)
        let txtColor = brightness > 125 ? "#000000" : "#FFFFFF"
        return {color: txtColor, backgroundColor: bgColor}
    }

    const onClick = () => {
        if (disabled) return;
        if (type === "background") {
            const c = randomizeBackgroundColor();
            setColors(c.color, c.backgroundColor);
        }
        else setColors(randomizeColor(), backgroundColor);
    }

    return (
        <StyledColorRandomizer
            onClick={onClick}
            color={color}
            backgroundColor={backgroundColor}
            type={type}
        >
            <i className="fas fa-sync-alt"></i>
        </StyledColorRandomizer>
    )
}