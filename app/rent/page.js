"use client";

import {
  Grid,
  Typography,
  Paper,
  Slider,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import MyAppBar from "@/components/Appbar";
import styles from "./Rentpage.module.css";

export default function RentPage() {
  const [cars, setCars] = useState([]); // เก็บข้อมูลรถ
  const [bookings, setBookings] = useState([]); // เก็บข้อมูลการจอง
  const [loading, setLoading] = useState(true); // การโหลดข้อมูล
  const [startDate, setStartDate] = useState(null); // วันที่เริ่มต้น
  const [endDate, setEndDate] = useState(null); // วันที่สิ้นสุด
  const [isClient, setIsClient] = useState(false); // เช็คว่าเป็น client หรือไม่
  const router = useRouter();

  // ตัวกรอง
  const [transmission, setTransmission] = useState("any"); // เลือกเกียร์ (Manual, Automatic, หรือ Any)
  const [fuelType, setFuelType] = useState("any"); // เลือกประเภทน้ำมัน (Gasoline, Electric, Hybrid)
  const [bodyType, setBodyType] = useState("any"); // เลือกรูปแบบรถ (SUV, Sedan, etc.)
  const [priceRange, setPriceRange] = useState([0, 5000]); // เลือกราคาที่ต้องการ
  const [yearRange, setYearRange] = useState([2000, 2025]); // เลือกปีรถที่ต้องการ

  // useEffect สำหรับดึงข้อมูล query string (start date, end date)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setStartDate(params.get("start"));
      setEndDate(params.get("end"));
      setIsClient(true); // เปลี่ยนเป็น true เมื่อ client โหลดเสร็จ

      // จัดการกับ DOM หรือ style
      const someElement = document.getElementById("someElement");
      if (someElement) {
        someElement.style.color = "blue"; // เปลี่ยนสีของ element
      }
    }
  }, []);

  // useEffect สำหรับดึงข้อมูลรถและการจอง
  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      // ดึงข้อมูลรถจาก Firestore
      const carSnap = await getDocs(collection(db, "cars"));
      const carsData = carSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ดึงข้อมูลการจองจาก Firestore ที่ตรงกับช่วงวันที่เลือก
      const bookingSnap = await getDocs(
        query(
          collection(db, "bookings"),
          where("startDate", "<=", endDate),
          where("endDate", ">=", startDate)
        )
      );
      const bookingsData = bookingSnap.docs.map((doc) => doc.data());

      setCars(carsData); // เซ็ตข้อมูลรถที่ดึงมา
      setBookings(bookingsData); // เซ็ตข้อมูลการจอง
      setLoading(false); // เปลี่ยนสถานะเป็นไม่โหลดแล้ว
    };

    fetchData();
  }, [startDate, endDate]);

  // ฟังก์ชันตรวจสอบจำนวนรถที่ว่าง
  const getAvailableStock = (carId, stock) =>
    stock - bookings.filter((b) => b.carId === carId).length;

  // ฟิลเตอร์ข้อมูลรถตามตัวกรองที่เลือก
  const filteredCars = cars.filter((car) => {
    const [minPrice, maxPrice] = priceRange;
    const [minYear, maxYear] = yearRange;
    return (
      car.pricePerDay >= minPrice &&
      car.pricePerDay <= maxPrice &&
      car.year >= minYear &&
      car.year <= maxYear &&
      (transmission === "any" || car.transmission === transmission) &&
      (fuelType === "any" || car.fuelType === fuelType) &&
      (bodyType === "any" || car.type === bodyType)
    );
  });

  if (!isClient) return null;

  return (
    <div>
      <MyAppBar />
      <Grid container>
        {/* Sidebar Filters */}
        <Grid item className={styles.filtersContainer} p={3}>
          <Paper className={styles.filtersPaper}>
            <Typography variant="h6">Filters</Typography>

            {/* ฟิลเตอร์ประเภทตัวถัง */}
            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Body Type</InputLabel>
              <Select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="SUV">SUV</MenuItem>
                <MenuItem value="Sedan">Sedan</MenuItem>
                <MenuItem value="Sports Car">Sports Car</MenuItem>
                <MenuItem value="Luxury Sedan">Luxury Sedan</MenuItem>
              </Select>
            </FormControl>

            {/* ฟิลเตอร์ช่วงราคา */}
            <Typography>Price Range (฿)</Typography>
            <Slider
              value={priceRange}
              onChange={(e, val) => setPriceRange(val)}
              min={0}
              max={5000}
              valueLabelDisplay="auto"
              className={styles.slider}
            />

            {/* ฟิลเตอร์ช่วงปี */}
            <Typography>Year</Typography>
            <Slider
              value={yearRange}
              onChange={(e, val) => setYearRange(val)}
              min={2000}
              max={2025}
              valueLabelDisplay="auto"
              className={styles.slider}
            />

            {/* ฟิลเตอร์เกียร์ */}
            <Typography>Transmission</Typography>
            <ToggleButtonGroup
              value={transmission}
              exclusive
              onChange={(e, val) => setTransmission(val)}
              fullWidth
              sx={{ my: 2 }}
            >
              <ToggleButton value="any">Any</ToggleButton>
              <ToggleButton value="manual">Manual</ToggleButton>
              <ToggleButton value="automatic">Automatic</ToggleButton>
            </ToggleButtonGroup>

            {/* ฟิลเตอร์ประเภทน้ำมัน */}
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="Gasoline">Gasoline</MenuItem>
                <MenuItem value="Electric">Electric</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Car List */}
        <Grid item xs p={3}>
          <Box className={styles.carListContainer}>
            <Typography variant="h4" className={styles.carListTitle}>
              🚗 เลือกรถที่คุณต้องการเช่า
            </Typography>
            <Typography variant="subtitle1" className={styles.carListSubtitle}>
              วันที่: {startDate} - {endDate}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Grid container className={styles.loading}>
                <CircularProgress />
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {filteredCars.map((car) => {
                  const available = getAvailableStock(car.id, car.stock);
                  const outOfStock = available <= 0;
                  return (
                    <Grid item xs={12} sm={6} lg={3} key={car.id}>
                      <Card className={styles.carCard}>
                        <CardMedia
                          component="img"
                          image={car.imageUrl}
                          alt={car.name}
                          className={styles.carImage}
                        />
                        <CardContent>
                          <Typography variant="h6">{car.name}</Typography>
                          <Typography variant="body2" gutterBottom>
                            {car.type}
                          </Typography>
                          <Box className={styles.carDetails}>
                            👥 {car.seats} | ⚙ {car.transmission} | ⛽{" "}
                            {car.fuelType} | {car.year}
                          </Box>
                          <Typography className={styles.carPrice}>
                            ฿{car.pricePerDay}/day
                          </Typography>
                          <Typography
                            className={styles.stockStatus}
                            color={outOfStock ? "error" : "primary"}
                          >
                            {outOfStock
                              ? "❌ Out of Stock"
                              : `✅ เหลือ ${available} คัน`}
                          </Typography>
                          <Button
                            variant="contained"
                            fullWidth
                            disabled={outOfStock}
                            className={styles.rentButton}
                            onClick={() =>
                              router.push(
                                `/confirm?carId=${car.id}&start=${startDate}&end=${endDate}`
                              )
                            }
                          >
                            Rent now
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
