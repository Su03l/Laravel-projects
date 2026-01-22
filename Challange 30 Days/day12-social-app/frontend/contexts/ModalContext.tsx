'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    showLoginModal: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    return (
        <ModalContext.Provider value={{ showLoginModal, openLoginModal, closeLoginModal }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
