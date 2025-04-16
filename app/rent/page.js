"use client";

import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";

export default function RentPage() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  useEffect(() => {
    if (!startDate || !endDate || startDate === "null" || endDate === "null") {
      alert("กรุณาเลือกวันที่เช่าให้ครบถ้วน");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      // ดึงข้อมูลรถทั้งหมด
      const carSnapshot = await getDocs(collection(db, "cars"));
      const carList = carSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ดึงการจองรถในช่วงวันเดียวกันหรือมี overlap
      const bookingSnapshot = await getDocs(
        query(
          collection(db, "bookings"),
          where("startDate", "<=", endDate),
          where("endDate", ">=", startDate)
        )
      );
      const bookingList = bookingSnapshot.docs.map((doc) => doc.data());

      setCars(carList);
      setBookings(bookingList);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate, router]);

  const getAvailableStock = (carId, stock) => {
    const booked = bookings.filter((b) => b.carId === carId).length;
    return stock - booked;
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" mt={10}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} p={4}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          🚗 เลือกรถที่คุณต้องการเช่า
        </Typography>
        <Typography variant="subtitle1">
          วันที่: {startDate} - {endDate}
        </Typography>
      </Grid>

      {cars.map((car) => {
        const available = getAvailableStock(car.id, car.stock);
        const isOutOfStock = available <= 0;

        return (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="160"
                image={car.imageUrl}
                alt={car.name}
              />
              <CardContent>
                <Typography variant="h6">{car.name}</Typography>
                <Typography>ประเภท: {car.type}</Typography>
                <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                <Typography color={isOutOfStock ? "error" : "primary"}>
                  {isOutOfStock
                    ? "❌ Out of Stock"
                    : `✅ เหลือ ${available} คัน`}
                </Typography>
                <br />
                <Button
                  fullWidth
                  variant="contained"
                  disabled={isOutOfStock}
                  onClick={() =>
                    router.push(
                      `/confirm?carId=${car.id}&start=${startDate}&end=${endDate}`
                    )
                  }
                >
                  เลือกรถคันนี้
                </Button>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
