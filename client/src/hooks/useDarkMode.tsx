import http from '../common/api';
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAppContext } from './useAppContext';

type DarkModeContextType = {
  isDarkModeEnabled: boolean;
  isAdminOrPrylis: boolean;
  refetch: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>(null as never);
// TODO: Move to useAuthorization
export const DarkModeContextProvider: FC<{ children?: ReactNode }> = (
  props
) => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(true);

  const doFetch = () => {
    http.get<boolean>('https://darkmode.datasektionen.se/').then((res) => {
      setIsDarkModeEnabled(res.data);
    });
  };

  useEffect(doFetch, []);

  const { admin: roles } = useAppContext();

  const isAdminOrPrylis = roles.includes('admin') || roles.includes('prylis');

  return (
    <DarkModeContext.Provider
      value={{ isAdminOrPrylis, isDarkModeEnabled, refetch: doFetch }}
    >
      {props.children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);

  if (!context)
    throw new Error('useDarkMode must be used inside DarkModeContextProvider');

  return context;
};
