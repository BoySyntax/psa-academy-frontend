import { useEffect, useState } from "react";
import { apiClient } from "@/lib/supabase";
import { UserType } from "@/constants/userTypes";

export interface AuthUser {
  id: string;
  email?: string;
  user_type?: UserType;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (you can implement token-based auth here)
    const checkAuth = async () => {
      try {
        // For now, we'll implement a simple auth check
        // You can modify this based on your auth strategy
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token with API
          const response = await apiClient.get('/student/profile.php?user_id=1');
          if (response.success) {
            setUser(response.profile);
            setUserType(response.profile.user_type);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Implement sign in with your PHP API
    try {
      const response = await apiClient.post('/login.php', { email, password });
      if (response.success) {
        setUser(response.user);
        setUserType(response.user.user_type);
        localStorage.setItem('auth_token', response.token);
      }
      return response;
    } catch (error) {
      return { success: false, message: 'Sign in failed' };
    }
  };

  const signOut = async () => {
    // Implement sign out
    setUser(null);
    setUserType(null);
    localStorage.removeItem('auth_token');
  };

  return { user, userType, loading, signIn, signOut };
};
