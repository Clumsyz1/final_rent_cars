# 🚗 Final Rent Cars

[ลองใช้งานเว็บไซต์จริง](https://final-rent-cars.vercel.app)

Final Rent Cars คือเว็บแอปพลิเคชันสำหรับเช่ารถออนไลน์ พัฒนาโดยใช้ **Next.js** และเชื่อมต่อกับ **Firebase** รองรับทั้งผู้ใช้งานทั่วไปและผู้ดูแลระบบ (Admin) พร้อมระบบจองรถตามวันที่ว่างจริง และระบบจัดการหลังบ้านเต็มรูปแบบ

## 🔧 Tech Stack

* **Framework:** Next.js (React-based Full Stack Framework)
* **Styling:** Tailwind CSS
* **Authentication & Database:** Firebase Authentication, Firestore
* **Routing:** Built-in Next.js Routing
* **Date Handling:** Day.js
* **Deployment:** Vercel

## 🔑 Features

### 👤 ผู้ใช้งานทั่วไป

* สมัครสมาชิกด้วยอีเมล
* เข้าสู่ระบบ / รีเซ็ตรหัสผ่าน
* เลือกช่วงวันที่ต้องการเช่ารถ
* ดูเฉพาะรถที่ยังว่างในช่วงวันที่เลือก
* จองรถพร้อมบันทึกข้อมูลลง Firestore
* ดูประวัติการจองของตัวเอง
* แก้ไขข้อมูลโปรไฟล์ (ชื่อ เบอร์โทร ที่อยู่ ฯลฯ)

### 🛠️ ผู้ดูแลระบบ (Admin)

* เข้าสู่ระบบด้วยบัญชีแอดมิน (ตรวจสอบจาก Firebase) แก้ไขที่users/role (user,admin)
* เข้าถึงแดชบอร์ดจัดการข้อมูล
* เพิ่ม/ลบรถในระบบ พร้อมข้อมูล เช่น รุ่น, ปี, ราคา, จำนวนที่มีในสต็อก ฯลฯ
* ดูประวัติการจองของลูกค้าทุกคน

## ⚙️ วิธีติดตั้งและใช้งาน

### 1. Clone โปรเจกต์:

```bash
git clone https://github.com/Clumsyz1/final_rent_cars.git
cd final_rent_cars
```

### 2. ติดตั้ง dependencies:

```bash
npm install
```

### 3. ตั้งค่า Firebase:

* สร้างโปรเจกต์บน [Firebase Console](https://console.firebase.google.com/)
* เปิดใช้งาน Authentication (Email/Password)
* เปิดใช้งาน Firestore Database
* สร้างไฟล์ `.env` แล้วใส่ค่าตามนี้:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. เริ่มต้นแอปพลิเคชัน:

```bash
npm run dev
```

## ✍️ ผู้พัฒนา

* [@Clumsyz1](https://github.com/Clumsyz1)

หากพบปัญหาหรือข้อเสนอแนะ สามารถเปิด Issue หรือ Pull Request ได้เลย 🙌
