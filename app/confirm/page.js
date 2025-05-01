"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import MyAppBar from "@/components/Appbar";

export default function ConfirmPage() {
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [carId, setCarId] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCarId(params.get("carId"));
    setStartDate(params.get("start"));
    setEndDate(params.get("end"));
  }, []);

  useEffect(() => {
    if (!carId || !startDate || !endDate) return;

    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchCar = async () => {
      if (!carId || !startDate || !endDate) {
        alert("ข้อมูลไม่ครบ กรุณาเลือกวันที่ใหม่");
        router.push("/");
        return;
      }

      const carRef = doc(db, "cars", carId);
      const carSnap = await getDoc(carRef);
      if (carSnap.exists()) {
        const carData = { id: carSnap.id, ...carSnap.data() };
        setCar(carData);

        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        setDays(diffDays);
        setTotal(carData.pricePerDay * diffDays);
      }
      setLoading(false);
    };

    fetchCar();
  }, [carId, startDate, endDate]);

  const handleConfirmBooking = async () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      carId,
      userId: user.uid,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    });

    alert("การจองเสร็จสิ้น");
    router.push("/");
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" mt={10}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div>
      <MyAppBar />

      <Grid container justifyContent="center" mt={5}>
        <Grid item xs={12} sm={10} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              ยืนยันการจองรถ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {car ? (
              <>
                <Typography variant="h6">{car.name}</Typography>
                <img
                  src={car.imageUrl}
                  alt={car.name}
                  style={{
                    width: "450px",
                    height: "290px",
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                />
                <Box mt={2}>
                  <Typography>วันที่เช่า: {startDate}</Typography>
                  <Typography>วันคืนรถ: {endDate}</Typography>
                  <Typography>จำนวนวัน: {days} วัน</Typography>
                  <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                  <Typography fontWeight="bold">
                    ราคารวม: ฿{total.toLocaleString()}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  fullWidth
                  onClick={handleConfirmBooking}
                >
                  ✅ ยืนยันการจอง
                </Button>
              </>
            ) : (
              <Typography>ไม่พบข้อมูลรถ</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
