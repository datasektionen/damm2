import axios from 'axios';
import {
  FC,
  createContext,
  useCallback,
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
export const DarkModeContextProvider: FC = (props) => {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const doFetch = () => {
    axios.get('api/dark-mode').then((x) => {
      setIsDarkModeEnabled(x.data);
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
