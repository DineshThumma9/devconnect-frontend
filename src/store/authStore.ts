import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
    accessToken: string;
    refreshToken: string;

    setAccessToken: (access: string) => void;
    setRefreshToken: (refresh: string) => void;
    logout: () => void;
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: '',
            refreshToken: '',

            setAccessToken: (access: string) => set({ accessToken: access }),
            setRefreshToken: (refresh: string) => set({ refreshToken: refresh }),
            logout: () => set({ accessToken: '', refreshToken: '' }),
        }),
        {
            name: 'auth-store', // 🔐 localStorage key
        }
    )
);

export default useAuthStore;
