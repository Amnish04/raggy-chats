import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type FC,
    type ReactNode,
} from "react";
import { useLocalStorage } from "react-use";

import { defaults, deserializer, key, serializer, type Settings } from "../lib/settings";

type SettingsContextType = {
    settings: Settings;
    setSettings: (newSettings: Settings) => void;
};

const SettingsContext = createContext<SettingsContextType>({
    settings: defaults,
    setSettings: () => {
        /* do nothing */
    },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useLocalStorage<Settings>(key, defaults, {
        raw: false,
        serializer,
        deserializer,
    });

    const [state, setState] = useState<Settings>(settings || defaults);

    useEffect(() => {
        setState(settings || defaults);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateSettings = useCallback(
        (newSettings: Settings) => {
            const updated = { ...state, ...newSettings };
            setState(updated);
            setSettings(updated);
        },
        [state, setSettings]
    );

    const value = { settings: state, setSettings: updateSettings };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
