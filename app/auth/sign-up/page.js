"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import styles from "./SignUp.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import MyAppBar from "@/components/Appbar";

export default function SignUp() {
  const router = useRouter(); // ใช้สำหรับเปลี่ยนเส้นทางหลังจากสมัครสมาชิก
  const [email, setEmail] = useState(""); // สถานะของอีเมลที่ผู้ใช้กรอก
  const [password, setPassword] = useState(""); // สถานะของรหัสผ่านที่ผู้ใช้กรอก
  const [confirmPassword, setConfirmPassword] = useState(""); // สถานะของรหัสผ่านยืนยัน

  // ฟังก์ชันสำหรับการสมัครสมาชิก
  const handleSignUp = async () => {
    try {
      // เรียก Firebase เพื่อสร้างผู้ใช้ใหม่
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign up success:", res.user);
      setEmail(""); // รีเซ็ตอีเมลหลังจากสมัครสมาชิกสำเร็จ
      setPassword(""); // รีเซ็ตรหัสผ่านหลังจากสมัครสมาชิกสำเร็จ
      setConfirmPassword(""); // รีเซ็ตรหัสผ่านยืนยันหลังจากสมัครสมาชิกสำเร็จ
      router.push("/auth/sign-in"); // เปลี่ยนเส้นทางไปที่หน้าล็อกอิน
    } catch (e) {
      console.error("Sign up error:", e.message);
      alert("เกิดข้อผิดพลาด: " + e.message); // แสดงข้อความผิดพลาดหากสมัครสมาชิกไม่สำเร็จ
    }
  };

  // ฟังก์ชันจัดการเมื่อผู้ใช้ส่งฟอร์ม
  const handleSubmit = (e) => {
    e.preventDefault(); // ป้องกันการโหลดหน้าใหม่เมื่อส่งฟอร์ม
    if (password !== confirmPassword) {
      // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกันหรือไม่
      alert("รหัสผ่านไม่ตรงกัน"); // แจ้งเตือนหากรหัสผ่านไม่ตรงกัน
      return;
    }
    handleSignUp(); // เรียกฟังก์ชัน handleSignUp เพื่อสมัครสมาชิก
  };

  return (
    <div>
      <MyAppBar /> {/* แสดงแถบเมนูด้านบน */}
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>สมัครสมาชิก</h2>{" "}
          {/* หัวข้อสำหรับการสมัครสมาชิก */}
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
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่าน"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // อัปเดตรหัสผ่านยืนยันเมื่อมีการเปลี่ยนแปลง
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
              {" "}
              {/* ลิงก์ไปยังหน้าเข้าสู่ระบบ */}
              เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
