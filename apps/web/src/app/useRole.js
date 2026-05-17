import { useState, useEffect } from "react";

export function useRole() {
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("svms_user_role") || null;
    }
    return null;
  });

  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("svms_user_data")) || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setRole(localStorage.getItem("svms_user_role") || null);
      try {
        setUser(JSON.parse(localStorage.getItem("svms_user_data")) || null);
      } catch {
        setUser(null);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("auth-change", handleAuthChange);
      return () => window.removeEventListener("auth-change", handleAuthChange);
    }
  }, []);

  const login = (token, userData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("svms_token", token);
      localStorage.setItem("svms_user_role", userData.role);
      localStorage.setItem("svms_user_data", JSON.stringify(userData));
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("svms_token");
      localStorage.removeItem("svms_user_role");
      localStorage.removeItem("svms_user_data");
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  // For backward compatibility in some components during transition
  const changeRole = (newRole) => {
    if (typeof window !== "undefined" && user) {
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem("svms_user_role", newRole);
      localStorage.setItem("svms_user_data", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  return [role, changeRole, login, logout, user];
}
