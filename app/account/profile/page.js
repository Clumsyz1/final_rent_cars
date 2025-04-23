"use client";

import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config"; // เชื่อมต่อกับ Firebase
import { doc, getDoc, setDoc } from "firebase/firestore"; // ฟังก์ชันที่ใช้ในการดึงและอัปเดตข้อมูล Firestore
import { onAuthStateChanged } from "firebase/auth"; // ฟังก์ชันตรวจสอบสถานะผู้ใช้
import { useRouter } from "next/navigation";
import MyAppBar from "@/components/Appbar";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null); // สถานะผู้ใช้ที่ล็อกอิน
  const [form, setForm] = useState({
    // สถานะของข้อมูลฟอร์ม
    firstName: "",
    lastName: "",
    date: "",
    gender: "Male",
    role: "user",
    phone: "",
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // ตรวจสอบสถานะการล็อกอิน
      if (!currentUser) {
        router.push("/sign-in"); // ถ้าไม่มีผู้ใช้ล็อกอิน ให้ไปหน้าเข้าสู่ระบบ
      } else {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid); // สร้างอ้างอิงไปยังเอกสารผู้ใช้ใน Firestore
        const docSnap = await getDoc(docRef); // ดึงข้อมูลจาก Firestore
        if (docSnap.exists()) {
          // ถ้าข้อมูลผู้ใช้มีอยู่
          const data = docSnap.data();
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            date: data.date || "",
            gender: data.gender || "Male",
            phone: data.phone || "",
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (_, value) => {
    // ฟังก์ชันจัดการการเปลี่ยนแปลงเพศ
    if (value) setForm({ ...form, gender: value });
  };

  const handleSubmit = async (e) => {
    // ฟังก์ชันเมื่อผู้ใช้ส่งฟอร์ม
    e.preventDefault();
    if (!user) return;

    const userRef = doc(db, "users", user.uid); // อ้างอิงไปยังเอกสารของผู้ใช้
    await setDoc(userRef, {
      // อัปเดตข้อมูลผู้ใช้ใน Firestore
      firstName: form.firstName,
      lastName: form.lastName,
      date: form.date,
      gender: form.gender,
      role: form.role,
      phone: form.phone,
      email: user.email,
    });

    alert("บันทึกข้อมูลสำเร็จแล้ว!"); // แจ้งเตือนเมื่อข้อมูลถูกบันทึก
  };

  return (
    <div className={styles.container}>
      <MyAppBar />
      <Grid container spacing={3} p={4}>
        {/* Sidebar */}
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} className={styles.sidebar}>
            <Typography variant="h6" gutterBottom>
              บัญชีของฉัน
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button fullWidth variant="contained" sx={{ mb: 1 }}>
              👤 โปรไฟล์
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => router.push("/account/bookings")}
            >
              🚗 การจอง
            </Button>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              sx={{ mt: 3 }}
              onClick={() => router.push("/")}
            >
              ⬅ ย้อนกลับ
            </Button>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} sm={9}>
          <Paper elevation={3} className={styles.content}>
            <Typography variant="h5" gutterBottom>
              ข้อมูลโปรไฟล์
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {/* ฟอร์มกรอกชื่อและนามสกุล */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ชื่อ"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="นามสกุล"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                {/* ฟอร์มกรอกเบอร์โทรศัพท์ */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="เบอร์โทรศัพท์"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                {/* ฟอร์มกรอกวันเกิด */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="วันเกิด"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                {/* การเลือกเพศ */}
                <Grid item xs={12}>
                  <Typography sx={{ mb: 1 }}>เพศ</Typography>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={form.gender}
                    onChange={handleGenderChange}
                  >
                    <ToggleButton value="Male">ชาย</ToggleButton>
                    <ToggleButton value="Female">หญิง</ToggleButton>
                    <ToggleButton value="Other">อื่น ๆ</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                {/* ปุ่มบันทึกข้อมูล */}
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary">
                      💾 บันทึกข้อมูล
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
