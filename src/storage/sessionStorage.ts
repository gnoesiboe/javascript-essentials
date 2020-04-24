import { createBrowserStorage } from './browserStorage';

export const { get, getInt, getBoolean, write } = createBrowserStorage(
    sessionStorage
);
