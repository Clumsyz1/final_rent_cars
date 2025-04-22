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
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import MyAppBar from "@/components/Appbar";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    date: "",
    gender: "Male",
    phone: "",
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/sign-in");
      } else {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (_, value) => {
    if (value) setForm({ ...form, gender: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      firstName: form.firstName,
      lastName: form.lastName,
      date: form.date,
      gender: form.gender,
      phone: form.phone,
      email: user.email,
    });

    alert("บันทึกข้อมูลสำเร็จแล้ว!");
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
