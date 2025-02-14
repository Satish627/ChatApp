import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false, // ✅ Fixed typo (was `isSingingUp`)
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true }); // ✅ Fixed typo (was `isSingingUp`)
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });

            toast.success("Account created successfully");
        } catch (error) {
            console.error("Signup Error:", error);

            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
        } finally {
            set({ isSigningUp: false }); // ✅ Fixed typo
        }
    },
    logout: async ()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null})
            toast.success("Logged out successfully")
        }
        catch(error){
            const errorMessage = error.response.data.message;
            toast.error(errorMessage);
        }
    }
}));
