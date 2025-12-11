// src/routes/PrivateRoute.tsx
import {Navigate, Outlet} from "react-router-dom";
import useAuthStore from "@/store/authStore.ts";

export default function PrivateRoute() {
    const token = useAuthStore((state) => state.accessToken);
    const devMode = import.meta.env.VITE_DEV_MODE === 'true';
    
    // In dev mode, bypass authentication and allow access
    if (devMode) {
        return <Outlet />;
    }
    
    return token ? <Outlet/> : <Navigate to="/login"/>;
}