/**
 * Settings can be accessed multiple ways, either via the `useSettings()`
 * hook, or if outside React, using this module.  Both use the same
 * values in localStorage. The benefit of the `useSettings()` hook is that
 * it makes changes to the settings reactive.  This code module is useful
 * when you only need to read something.
 */
export type Settings = {
    apiKey: string;
    selectedModel: string;
};

export const defaults: Settings = {
    apiKey: "",
    selectedModel: "gpt-4o", // Use the flagship model by default
};

export const key = "raggy-chats-settings";

export const serializer = (value: Settings) => JSON.stringify(value);

export const deserializer = (value: string): Settings => {
    const settings = JSON.parse(value);

    return { ...defaults, ...settings };
};

export const getSettings = () => {
    const value = localStorage.getItem(key);
    if (value === null) {
        return defaults;
    }
    return deserializer(value);
};
