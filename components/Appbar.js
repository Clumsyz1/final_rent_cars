"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import UserMenu from "./UserMenu";

export default function MyAppBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#ADB2D4" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
            onClick={() => router.push("/")}
            color="#EEF1DA"
          >
            🚗 Rent Car Rent Jai
          </Typography>

          <Box>
            <UserMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}
