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
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(to right,rgb(27, 96, 193),rgb(0, 53, 128))", // ขาว -> เทาอ่อน
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          onClick={() => router.push("/")}
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#f5f5f5", // น้ำเงินเข้ม
            cursor: "pointer",
            transition: "opacity 0.2s ease-in-out",
            "&:hover": {
              opacity: 0.7,
            },
          }}
        >
          Rent Car Rent Jai
        </Typography>

        <Box>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
