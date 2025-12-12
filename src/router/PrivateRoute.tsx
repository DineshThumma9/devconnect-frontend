// src/routes/PrivateRoute.tsx
import {Navigate, Outlet} from "react-router-dom";
import useAuthStore from "@/store/authStore.ts";

export default function PrivateRoute() {
    const token = useAuthStore((state) => state.accessToken);
    const devMode = import.meta.env.VITE_DEV_MODE === 'true';
    
    console.log('PrivateRoute - Dev Mode:', devMode, 'Token:', !!token, 'Env:', import.meta.env.VITE_DEV_MODE);
    
    // In dev mode, bypass authentication and allow access
    if (devMode) {
        console.log('✅ Dev mode enabled - bypassing auth');
        return <Outlet />;
    }
    
    if (!token) {
        console.log('❌ No token found - redirecting to login');
    }
    
    return token ? <Outlet/> : <Navigate to="/login"/>;
}