"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "@/app/firebase/config"; // เชื่อมต่อกับ Firebase
import { collection, getDocs } from "firebase/firestore"; // ฟังก์ชันที่ใช้ดึงข้อมูลจาก Firestore
import MyAppBar from "@/components/Appbar"; // ใช้ AppBar ที่กำหนดเอง

export default function AdminDashboard() {
  const [cars, setCars] = useState([]); // สถานะของข้อมูลรถ
  const [bookings, setBookings] = useState([]); // สถานะของข้อมูลการจอง
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // ดึงข้อมูลจากคอลเล็กชัน 'cars' และ 'bookings' จาก Firestore
      const carSnapshot = await getDocs(collection(db, "cars"));
      const bookingSnapshot = await getDocs(collection(db, "bookings"));

      const carList = carSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bookingList = bookingSnapshot.docs.map((doc) => doc.data());

      setCars(carList); // อัปเดตข้อมูลรถยนต์
      setBookings(bookingList); // อัปเดตข้อมูลการจอง
    };

    fetchData(); // เรียกใช้งานฟังก์ชันดึงข้อมูล
  }, []);

  const getAvailableStock = (carId, stock) => {
    // ฟังก์ชันคำนวณจำนวนรถที่เหลือจากการจอง
    const booked = bookings.filter((b) => b.carId === carId).length;
    return stock - booked; // คำนวณจำนวนรถที่เหลือ
  };

  return (
    <div>
      <MyAppBar />

      <Paper sx={{ p: 4, m: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => router.push("/admin")} // ปุ่มย้อนกลับไปที่หน้าผู้ดูแลระบบ
          sx={{ mb: 2 }}
        >
          ย้อนกลับ
        </Button>

        <Typography variant="h4" gutterBottom>
          📦 รายการรถทั้งหมด (Stock)
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={2}>
          {cars.map((car) => {
            const available = getAvailableStock(car.id, car.stock); // คำนวณจำนวนรถที่เหลือ
            return (
              <Grid item xs={12} sm={6} md={4} key={car.id}>
                <Card>
                  <CardMedia
                    component="img"
                    image={car.imageUrl} // แสดงภาพรถ
                    alt={car.name}
                    sx={{
                      width: "380px", // กำหนดความกว้างของรูป
                      height: "290px", // กำหนดความสูงของรูป
                      objectFit: "fill", // ครอบตัดรูปให้พอดี
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{car.name}</Typography>
                    <Typography>ประเภท: {car.type}</Typography>
                    <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                    <Typography color={available <= 0 ? "error" : "primary"}>
                      {" "}
                      คงเหลือ: {available} คัน
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </div>
  );
}
