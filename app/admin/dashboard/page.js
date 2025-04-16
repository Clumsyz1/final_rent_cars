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
import { db } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const carSnapshot = await getDocs(collection(db, "cars"));
      const bookingSnapshot = await getDocs(collection(db, "bookings"));

      const carList = carSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bookingList = bookingSnapshot.docs.map((doc) => doc.data());

      setCars(carList);
      setBookings(bookingList);
    };

    fetchData();
  }, []);

  const getAvailableStock = (carId, stock) => {
    const booked = bookings.filter((b) => b.carId === carId).length;
    return stock - booked;
  };

  return (
    <Paper sx={{ p: 4, m: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => router.push("/admin")}
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
          const available = getAvailableStock(car.id, car.stock);
          return (
            <Grid item xs={12} sm={6} md={4} key={car.id}>
              <Card>
                <CardMedia component="img" height="300"  image={car.imageUrl} />
                <CardContent>
                  <Typography variant="h6">{car.name}</Typography>
                  <Typography>ประเภท: {car.type}</Typography>
                  <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                  <Typography color={available <= 0 ? "error" : "primary"}>
                    คงเหลือ: {available} คัน
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}