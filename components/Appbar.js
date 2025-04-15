"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function MyAppBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    router.push("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Rent Car Rent Jai
        </Typography>

        {user ? (
          <>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
              {user.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              ออกจากระบบ
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => router.push("/sign-in")}>
            เข้าสู่ระบบ
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
