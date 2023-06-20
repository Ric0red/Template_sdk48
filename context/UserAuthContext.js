import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../config/firebase";
import { query, onSnapshot, collection } from "firebase/firestore";

const userAuthContext = createContext();
// Admin token --DB
const dbAdm = query(collection(db, "ADMIN"));

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState();

  // Read USER session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
      console.log("current user: ", currentuser);
    });

    const unsubscribe_AdminToken = onSnapshot(dbAdm, (querySnapshot) => {
      let token;
      querySnapshot.forEach((doc) => {
        token = doc.data().adminNotificationToken;
      });
      setAdminToken(token);
      console.log("ADM TOKEN: ", token);
    });

    return () => {
      unsubscribe();
      unsubscribe_AdminToken();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
