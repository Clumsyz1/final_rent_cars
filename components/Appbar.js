"use client";

import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";

export default function MyAppBar() {
  const router = useRouter();

  return (
    <AppBar
      sx={{
        position: "static",
        background: "linear-gradient(to right,#1b60c1,#003580)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          onClick={() => router.push("/")}
          sx={{
            fontWeight: 500,
            fontSize: "1.55rem",
            color: "#f5f5f5",
            cursor: "pointer",
            transition: "opacity 0.2s ease-in-out",
            "&:hover": {
              opacity: 0.6,
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
