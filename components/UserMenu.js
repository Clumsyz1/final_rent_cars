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
  const [anchorEl, setAnchorEl] = useState(null); // สำหรับการเปิด/ปิดเมนู
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  const [role, setRole] = useState(null); // เก็บข้อมูลบทบาทของผู้ใช้ (เช่น admin หรือ user)
  const [openConfirm, setOpenConfirm] = useState(false); // ใช้ควบคุมการแสดงกล่องยืนยันการออกจากระบบ
  const open = Boolean(anchorEl); // เช็คว่าเมนูเปิดอยู่หรือไม่
  const router = useRouter(); // สำหรับการนำทางไปยังหน้าอื่น

  // ฟังก์ชันตรวจสอบสถานะการเข้าสู่ระบบของผู้ใช้
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // หากมีผู้ใช้เข้าสู่ระบบ, เก็บข้อมูลผู้ใช้
        const docRef = doc(db, "users", currentUser.uid); // ดึงข้อมูลบทบาทของผู้ใช้จาก Firestore
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setRole(data.role || "user"); // หากพบบทบาท, กำหนดบทบาทให้กับผู้ใช้
        }
      } else {
        setUser(null); // หากไม่มีผู้ใช้เข้าสู่ระบบ, รีเซ็ตข้อมูลผู้ใช้และบทบาท
        setRole(null);
      }
    });
    return () => unsubscribe(); // ลบการติดตามเมื่อคอมโพเนนต์ถูกยกเลิก
  }, []);

  // ฟังก์ชันเปิดเมนู
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  // ฟังก์ชันปิดเมนู
  const handleClose = () => setAnchorEl(null);

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    await signOut(auth); // ออกจากระบบ Firebase
    setUser(null); // รีเซ็ตข้อมูลผู้ใช้
    handleClose(); // ปิดเมนู
    router.push("/"); // นำทางไปยังหน้าแรก
  };

  // ฟังก์ชันเปิดกล่องยืนยันการออกจากระบบ
  const handleOpenConfirm = () => {
    handleClose(); // ปิดเมนูก่อน
    setOpenConfirm(true); // เปิดกล่องยืนยัน
  };
  // ฟังก์ชันปิดกล่องยืนยันการออกจากระบบ
  const handleCloseConfirm = () => setOpenConfirm(false);
  // ฟังก์ชันยืนยันการออกจากระบบ
  const handleConfirmLogout = () => {
    setOpenConfirm(false); // ปิดกล่องยืนยัน
    handleLogout(); // เรียกฟังก์ชันออกจากระบบ
  };

  // หากไม่มีผู้ใช้เข้าสู่ระบบ, แสดงไอคอนสำหรับเข้าสู่ระบบ
  if (!user) {
    return (
      <IconButton onClick={() => router.push("/auth/sign-in")} color="inherit">
        <PersonIcon />
      </IconButton>
    );
  }

  return (
    <div>
      {/* ไอคอนสำหรับเปิดเมนูผู้ใช้ */}
      <IconButton onClick={handleClick} color="inherit">
        <Avatar sx={{ width: 32, height: 32, bgcolor: "transparent" }} />
      </IconButton>
      {/* เมนูผู้ใช้ */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* แสดงอีเมลของผู้ใช้ */}
        <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>
          {user.email}
        </Typography>
        <Divider />
        {/* เมนูสำหรับไปที่โปรไฟล์ */}
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
        {/* เมนูสำหรับไปที่รายการการจอง */}
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
        {/* เมนูสำหรับผู้ดูแลระบบ */}
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
        {/* เมนูออกจากระบบ */}
        <MenuItem onClick={handleOpenConfirm}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>

      {/* กล่องยืนยันการออกจากระบบ */}
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
