import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User store
export const useUser = create(
    persist(
        (set, get) => ({
            role: null,
            token: null,
            user: null,
            setToken: (role, token) => set({
                role: role,
                token: token,
            }),
            updateToken: (role, token) => set({
                role: role,
                token: token,
            }),
            clearToken: () => set({
                role: null,
                token: null,
                user: null,
            }),
            setUser: (user) => set({
                user: user,
            }),
        }),
        {
            name: `${(process.env.NEXT_PUBLIC_APP_NAME).toLowerCase().replaceAll(' ', '_')}.auth`,
            storage: createJSONStorage(() => localStorage),
        }
    )
)