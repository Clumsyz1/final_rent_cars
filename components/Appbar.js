"use client";

import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import UserMenu from "./UserMenu";

export default function MyAppBar() {
  const [user, setUser] = useState(null); // ใช้สถานะ user เพื่อเก็บข้อมูลของผู้ใช้
  const router = useRouter(); // ใช้ router สำหรับนำทางไปยังหน้าอื่น

  // useEffect สำหรับตรวจสอบการเปลี่ยนแปลงสถานะการเข้าสู่ระบบของผู้ใช้
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // เมื่อสถานะผู้ใช้เปลี่ยน จะอัพเดตสถานะใน state
    });
    return () => unsubscribe(); // ทำการยกเลิกการติดตามเมื่อ component ถูกลบ
  }, []);

  return (
    <AppBar
      position="static"
      sx={{
        background:
          "linear-gradient(to right,#1b60c1,#003580)", // สีพื้นหลังแบบไล่สี
        boxShadow: "none", // ไม่มีเงา
      }}
    >
      <Toolbar
        sx={{
          px: 3, // ระยะห่างจากขอบด้านซ้ายและขวา
          display: "flex", // ใช้ Flexbox สำหรับจัดตำแหน่ง
          justifyContent: "space-between", // จัดให้อยู่ทางซ้ายและขวา
          alignItems: "center", // จัดให้อยู่กลางในแนวตั้ง
        }}
      >
        {/* ชื่อเว็บไซต์ที่สามารถคลิกเพื่อกลับไปหน้าแรก */}
        <Typography
          variant="h6"
          onClick={() => router.push("/")} // คลิกเพื่อกลับไปหน้าแรก
          sx={{
            fontWeight: 700, // ตัวหนา
            fontSize: "1.25rem", // ขนาดตัวอักษร
            color: "#f5f5f5", // สีตัวอักษรขาว
            cursor: "pointer", // เปลี่ยนเคอร์เซอร์เป็นมือเมื่อเอาเมาส์ไปเหนือข้อความ
            transition: "opacity 0.2s ease-in-out", // การเปลี่ยนแปลงความโปร่งใส
            "&:hover": {
              opacity: 0.7, // เมื่อเอาเมาส์ไปเหนือข้อความ ความโปร่งใสจะลดลง
            },
          }}
        >
          Rent Car Rent Jai
        </Typography>

        {/* เมนูของผู้ใช้ */}
        <Box>
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
