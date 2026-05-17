import { useState, useEffect } from "react";

export function useRole() {
  const [role, setRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("svms_user_role") || "admin";
    }
    return "admin";
  });

  useEffect(() => {
    const handleRoleChange = () => {
      setRole(localStorage.getItem("svms_user_role") || "admin");
    };
    if (typeof window !== "undefined") {
      window.addEventListener("role-change", handleRoleChange);
      return () => window.removeEventListener("role-change", handleRoleChange);
    }
  }, []);

  const changeRole = (newRole) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("svms_user_role", newRole);
      window.dispatchEvent(new Event("role-change"));
    }
  };

  return [role, changeRole];
}
