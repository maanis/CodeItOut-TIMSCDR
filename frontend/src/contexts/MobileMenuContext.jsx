import { createContext, useContext, useState } from 'react';

const MobileMenuContext = createContext();

export function MobileMenuProvider({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <MobileMenuContext.Provider value={{
            isMobileMenuOpen,
            setIsMobileMenuOpen,
            toggleMobileMenu,
            closeMobileMenu
        }}>
            {children}
        </MobileMenuContext.Provider>
    );
}

export function useMobileMenu() {
    const context = useContext(MobileMenuContext);
    if (!context) {
        throw new Error('useMobileMenu must be used within MobileMenuProvider');
    }
    return context;
}