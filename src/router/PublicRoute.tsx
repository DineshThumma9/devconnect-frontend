// src/routes/PublicRoute.tsx
import {Navigate, Outlet} from "react-router-dom";
import useAuthStore from "@/store/authStore.ts";

export default function PublicRoute() {
    const token = useAuthStore((state) => state.accessToken);
    const devMode = import.meta.env.VITE_DEV_MODE === 'true';
    
    // In dev mode, allow access to both public and private routes
    if (devMode) {
        return <Outlet />;
    }
    
    return token ? <Navigate to="/app"/> : <Outlet/>;
}