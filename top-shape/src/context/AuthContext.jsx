import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getProfile } from "../features/auth/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function fetchUserProfile(userId) {
        try {
            const profileData = await getProfile(userId);
            setProfile(profileData);
        } catch (err) {
            console.error("Error al cargar el perfil:", err.message);
            setProfile(null);
        }
    }

    useEffect(() => {
        async function initializeAuth() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                const currentUser = session?.user ?? null;
                setUser(currentUser);

                if (currentUser) {
                    await fetchUserProfile(currentUser.id);
                }
            } catch (err) {
                console.error("Error inicializando auth:", err);
            } finally {
                setLoading(false);
            }
        }

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                setLoading(true);
                await fetchUserProfile(currentUser.id);
                setLoading(false);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}