import { FC, memo, useCallback, useEffect, useState } from 'react';
import { BiSwitch } from '../../components/BiSwitch/BiSwitch';
import axios from 'axios';
import { useDarkMode } from '../../hooks/useDarkMode';

type DarkModeProps = {};

export const DarkMode: FC<DarkModeProps> = memo((props) => {
  const [value, setValue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkmodeAudio, setDarkmodeAudio] = useState(
    new Audio('/nocturne.ogg')
  );
  const [lightmodeAudio, setLightmodeAudio] = useState(
    new Audio('/keeper_of_the_light.mp3')
  );
  const [playing, setPlaying] = useState(false);

  const { refetch } = useDarkMode();

  const getValue = useCallback(() => {
    axios.get('/api/dark-mode').then((res) => {
      setValue(res.data);
    });
  }, []);

  useEffect(() => {
    darkmodeAudio.addEventListener('ended', () => setPlaying(false));
    return () => {
      darkmodeAudio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  useEffect(() => {
    lightmodeAudio.addEventListener('ended', () => setPlaying(false));
    return () => {
      lightmodeAudio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  const onChange = useCallback((v: string) => {
    setLoading(true);
    axios
      .patch('/api/dark-mode')
      .then((res) => {
        setValue(res.data);
        if (res.data === true) {
          setPlaying(true);
          darkmodeAudio.volume = 0.3;
          darkmodeAudio.play();
        } else if (res.data === false) {
          lightmodeAudio.volume = 0.3;
          lightmodeAudio.play();
        }
      })
      .finally(() => {
        refetch();
        setLoading(false);
      });
  }, []);

  useEffect(getValue, []);

  return (
    <div>
      <h2>Mörkläggning</h2>
      <p>Mörkläggningsläget döljer tidslinjen och mottagningsmärken.</p>
      <BiSwitch
        left={{ key: 'off', label: 'AV' }}
        right={{ key: 'on', label: 'PÅ' }}
        setValue={onChange}
        value={value ? 'on' : 'off'}
        disabled={loading}
      />
    </div>
  );
});
