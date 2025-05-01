"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import MyAppBar from "@/components/Appbar";
import styles from "./ForgotPasswordPage.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setAlert("ส่งอีเมลรีเซ็ตรหัสผ่านแล้ว กรุณาตรวจสอบกล่องข้อความของคุณ");
      setEmail("");
    } catch (err) {
      setAlert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, message: "" });

  return (
    <div>
      <MyAppBar />
      <Box className={styles.container}>
        <Paper className={styles.paper}>
          <Typography variant="h5" className={styles.title}>
            ลืมรหัสผ่าน
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="อีเมลของคุณ"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              className={styles.textField}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className={styles.submitButton}
            >
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </Button>
          </form>

          <Typography variant="body2" className={styles.footer}>
            กลับไปหน้า
            <a href="/auth/sign-in" className={styles.link}>
              เข้าสู่ระบบ
            </a>
          </Typography>
        </Paper>
        <Snackbar
          open={!!alert.message}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <Alert
            onClose={handleCloseAlert}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}