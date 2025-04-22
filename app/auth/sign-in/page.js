"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import styles from "./SignIn.module.css";
import MyAppBar from "@/components/Appbar";

export default function SignIn() {
  const router = useRouter(); // ใช้สำหรับเปลี่ยนเส้นทางหลังจากเข้าสู่ระบบ
  const [email, setEmail] = useState(""); // สถานะของอีเมลที่ผู้ใช้กรอก
  const [password, setPassword] = useState(""); // สถานะของรหัสผ่านที่ผู้ใช้กรอก

  // ฟังก์ชันสำหรับจัดการการเข้าสู่ระบบ
  const handleSignIn = async () => {
    try {
      // เรียก Firebase เพื่อเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in success:", res.user);
      setEmail(""); // รีเซ็ตอีเมลหลังจากเข้าสู่ระบบสำเร็จ
      setPassword(""); // รีเซ็ตรหัสผ่านหลังจากเข้าสู่ระบบสำเร็จ
      router.push("/"); // เปลี่ยนเส้นทางไปหน้าหลักหลังจากเข้าสู่ระบบ
    } catch (e) {
      console.error("Sign in error:", e.message);
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"); // แสดงข้อความผิดพลาดหากการเข้าสู่ระบบไม่สำเร็จ
    }
  };

  // ฟังก์ชันจัดการเมื่อผู้ใช้ส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault(); // ป้องกันการโหลดหน้าใหม่เมื่อส่งฟอร์ม
    handleSignIn(); // เรียกฟังก์ชัน handleSignIn
  };

  return (
    <div>
      <MyAppBar /> {/* แสดงแถบเมนูด้านบน */}
      <div className={styles.container}>
        <h2 className={styles.heading}>เข้าสู่ระบบ - เว็บเช่ารถ</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // อัปเดตอีเมลเมื่อมีการเปลี่ยนแปลง
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // อัปเดตรหัสผ่านเมื่อมีการเปลี่ยนแปลง
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            เข้าสู่ระบบ
          </button>
        </form>
        <p className={styles.link}>
          Forgot Password? <a href="/auth/forgot-password">Forgot Password</a>
        </p>
        <p className={styles.link}>
          ยังไม่มีบัญชี? <a href="/auth/sign-up">สมัครสมาชิก</a>
        </p>
      </div>
    </div>
  );
}
