"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DriveEtaIcon from "@mui/icons-material/DriveEta";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    handleClose();
    router.push("/");
  };

  if (!user) {
    return (
      <IconButton onClick={() => router.push("/sign-in")} color="inherit">
        <AccountCircleIcon />
      </IconButton>
    );
  }

  return (
    <>
      <IconButton onClick={handleClick} color="inherit">
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>
          {user.email}
        </Typography>
        <Divider />
        <MenuItem
          onClick={() => {
            router.push("/profile");
            handleClose();
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            router.push("/bookings");
            handleClose();
          }}
        >
          <ListItemIcon>
            <DriveEtaIcon fontSize="small" />
          </ListItemIcon>
          Bookings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
