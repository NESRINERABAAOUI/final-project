import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Synchroniser l'état initial avec le localStorage
    const user = localStorage.getItem("Profile_User");
    return user ? true : false;
  });

  useEffect(() => {
    // Valider si le token existe et est encore valide
    const token = localStorage.getItem("token");
    if (token) {
      // Optionnel : logiques pour vérifier si le token est expiré
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (userData) => {
    try {
      if (userData && userData.token) {
        localStorage.setItem("Profile_User", JSON.stringify(userData));
        localStorage.setItem("Role_User", userData.roleUser);
        localStorage.setItem("token", userData.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des informations utilisateur : ",
        error
      );
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("Profile_User");
      localStorage.removeItem("Role_User");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  };

  const value = {
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
