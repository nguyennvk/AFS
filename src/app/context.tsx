import { createContext, useContext } from 'react';

interface HomepageContextType {
    accessToken: string | "";
}

export const HomepageContext = createContext<HomepageContextType|undefined>(undefined);
export const useHomepageContext = () => {
    const context = useContext(HomepageContext);
    if (!context) {
        throw new Error("useHomepageContext must be used within a HomepageProvider");
    }
    return context;
}

