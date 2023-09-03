import { FC, memo, useCallback, useEffect, useState } from 'react';
import { BiSwitch } from '../../components/BiSwitch/BiSwitch';
import axios from 'axios';
import { useDarkMode } from '../../hooks/useDarkMode';

type DarkModeProps = {};

export const DarkMode: FC<DarkModeProps> = memo((props) => {

    const [value, setValue] = useState(false);
    const [loading, setLoading] = useState(false);

    const { refetch } = useDarkMode();

    const getValue = useCallback(() => {
        axios.get("/api/dark-mode")
            .then(res => {
                setValue(res.data)
            })
    }, [])

    const onChange = useCallback((v: string) => {
        setLoading(true);
        axios.patch("/api/dark-mode")
            .then(res => {
                setValue(res.data)
            })
            .finally(() => {
                refetch();
                setLoading(false);
            })
    }, [])

    useEffect(getValue , []);

    return (
        <div>
            <h2>Mörkläggning</h2>
            <p>Mörkläggningsläget döljer tidslinjen och mottagningsmärken.</p>
            <BiSwitch left={{ key: "off",  label: "AV"}} right={{ key: "on",  label: "PÅ"}} setValue={onChange} value={value ? "on" : "off"} disabled={loading} />
        </div>
    )
});
