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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const open = Boolean(anchorEl);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRole(data.role || "user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    handleClose();
    router.push("/");
  };

  const handleOpenConfirm = () => {
    handleClose(); // ปิดเมนูก่อน
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleConfirmLogout = () => {
    setOpenConfirm(false);
    handleLogout();
  };

  if (!user) {
    return (
      <IconButton onClick={() => router.push("/auth/sign-in")} color="inherit">
        <PersonIcon />
      </IconButton>
    );
  }

  return (
    <div>
      <IconButton onClick={handleClick} color="inherit">
        <Avatar sx={{ width: 32, height: 32, bgcolor: "transparent" }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>
          {user.email}
        </Typography>
        <Divider />
        <MenuItem
          onClick={() => {
            router.push("/account/profile");
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
            router.push("/account/bookings");
            handleClose();
          }}
        >
          <ListItemIcon>
            <DriveEtaIcon fontSize="small" />
          </ListItemIcon>
          Bookings
        </MenuItem>
        {role === "admin" && (
          <MenuItem
            onClick={() => {
              router.push("/admin");
              handleClose();
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Admin Panel
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleOpenConfirm}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* 🔐 Confirm Logout Dialog */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>ยืนยันการออกจากระบบ</DialogTitle>
        <DialogContent>
          <Typography>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>ยกเลิก</Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            color="error"
          >
            ออกจากระบบ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
