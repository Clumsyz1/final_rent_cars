"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import styles from "./SignUp.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import MyAppBar from "@/components/Appbar";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign up success:", res.user);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/auth/sign-in");
    } catch (e) {
      console.error("Sign up error:", e.message);
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }
    handleSignUp();
  };

  return (
    <div>
      <MyAppBar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              สมัครสมาชิก
            </button>
          </form>
          <p className={styles.switch}>
            มีบัญชีอยู่แล้ว?{" "}
            <a href="/auth/sign-in" className={styles.link}>
              เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}