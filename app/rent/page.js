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
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const [transmission, setTransmission] = useState("any");
  const [fuelType, setFuelType] = useState("any");
  const [bodyType, setBodyType] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [yearRange, setYearRange] = useState([2000, 2025]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setStartDate(params.get("start"));
      setEndDate(params.get("end"));
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      const carSnap = await getDocs(collection(db, "cars"));
      const carsData = carSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bookingSnap = await getDocs(
        query(
          collection(db, "bookings"),
          where("startDate", "<=", endDate),
          where("endDate", ">=", startDate)
        )
      );
      const bookingsData = bookingSnap.docs.map((doc) => doc.data());

      setCars(carsData);
      setBookings(bookingsData);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate]);

  const getAvailableStock = (carId, stock) =>
    stock - bookings.filter((b) => b.carId === carId).length;

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

  return (
    <div>
      <MyAppBar />
      <Grid container>
        <Grid item className={styles.filtersContainer} p={3}>
          <Paper className={styles.filtersPaper}>
            <Typography variant="h6">Filters</Typography>
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
            <Typography>Price Range (฿)</Typography>
            <Slider
              value={priceRange}
              onChange={(e, val) => setPriceRange(val)}
              min={0}
              max={5000}
              valueLabelDisplay="auto"
              className={styles.slider}
            />
            <Typography>Year</Typography>
            <Slider
              value={yearRange}
              onChange={(e, val) => setYearRange(val)}
              min={2000}
              max={2025}
              valueLabelDisplay="auto"
              className={styles.slider}
            />
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
                    <Grid item xs={12} sm={6} md={4} lg={3} key={car.id}>
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
