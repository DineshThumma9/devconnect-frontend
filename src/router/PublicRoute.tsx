// src/routes/PublicRoute.tsx
import {Navigate, Outlet} from "react-router-dom";
import useAuthStore from "@/store/authStore.ts";

export default function PublicRoute() {
    const token = useAuthStore((state) => state.accessToken);
    const devMode = import.meta.env.VITE_DEV_MODE === 'true';
    
    console.log('PublicRoute - Dev Mode:', devMode, 'Token:', !!token, 'Env:', import.meta.env.VITE_DEV_MODE);
    
    // In dev mode, allow access to both public and private routes
    if (devMode) {
        console.log('✅ Dev mode enabled - allowing access');
        return <Outlet />;
    }
    
    return token ? <Navigate to="/app"/> : <Outlet/>;
}