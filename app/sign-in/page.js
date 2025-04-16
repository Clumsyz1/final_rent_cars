"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import styles from "./SignIn.module.css";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in success:", res.user);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error("Sign in error:", e.message);
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignIn();
  };

  return (
    <div className={styles.container}>
      <h2>เข้าสู่ระบบ - เว็บเช่ารถ</h2>
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
        <button type="submit" className={styles.button}>
          เข้าสู่ระบบ
        </button>
      </form>ƒ
      <p>
      ForgotPassword? <a href="/forgot-password">ForgotPassword</a>
      </p>
      <p>
        ยังไม่มีบัญชี? <a href="/sign-up">สมัครสมาชิก</a>
      </p>
    </div>
  );
}
