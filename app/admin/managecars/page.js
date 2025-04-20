"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  MenuItem,
  Grid,
  Card,
  Box,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import { db } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    type: "SUV",
    pricePerDay: "",
    stock: "",
    imageUrl: "",
    fuelType: "Gasoline",
    transmission: "manual",
    seats: "",
    year: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const snapshot = await getDocs(collection(db, "cars"));
    const carList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCars(carList);
  };

  const handleAddOrUpdateCar = async () => {
    const carData = {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      stock: Number(form.stock),
      seats: Number(form.seats),
      year: Number(form.year),
    };

    if (editId) {
      await updateDoc(doc(db, "cars", editId), carData);
    } else {
      await addDoc(collection(db, "cars"), carData);
    }

    setForm({
      name: "",
      type: "SUV",
      pricePerDay: "",
      stock: "",
      imageUrl: "",
      fuelType: "Gasoline",
      transmission: "manual",
      seats: "",
      year: "",
    });
    setEditId(null);
    fetchCars();
  };

  const handleDeleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
    fetchCars();
  };

  const handleEditCar = (car) => {
    setForm({
      name: car.name || "",
      type: car.type || "SUV",
      pricePerDay: car.pricePerDay || "",
      stock: car.stock || "",
      imageUrl: car.imageUrl || "",
      fuelType: car.fuelType || "Gasoline",
      transmission: car.transmission || "manual",
      seats: car.seats || "",
      year: car.year || "",
    });
    setEditId(car.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const BodyType = [
    { value: "SUV", label: "SUV" },
    { value: "Sedan", label: "Sedan" },
    { value: "Sports Car", label: "Sports Car" },
    { value: "Luxury Sedan", label: "Luxury Sedan" },
  ];

  const Transmission = [
    { value: "manual", label: "Manual" },
    { value: "automatic", label: "Automatic" },
  ];

  const FuelType = [
    { value: "Gasoline", label: "Gasoline" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <Paper sx={{ p: 4, m: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => router.push("/admin")}
        sx={{ mb: 3 }}
      >
        ย้อนกลับ
      </Button>

      <Typography variant="h4" gutterBottom>
        {editId ? "✏️ แก้ไขรถ" : "➕➖ จัดการรถ"}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="ชื่อรถ"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="ประเภทรถ"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            required
          >
            {BodyType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="ราคา/วัน"
            name="pricePerDay"
            type="number"
            value={form.pricePerDay}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="จำนวนคัน"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="ที่นั่ง"
            name="seats"
            type="number"
            value={form.seats}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField
            label="ปี"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="ระบบเกียร์"
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            fullWidth
            required
          >
            {Transmission.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="เชื้อเพลิง"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            fullWidth
            required
          >
            {FuelType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="URL รูปภาพ"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={handleAddOrUpdateCar}
              color={editId ? "warning" : "primary"}
            >
              {editId ? "✅ บันทึกการแก้ไข" : "➕ เพิ่มรถ"}
            </Button>
            {editId && (
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    name: "",
                    type: "SUV",
                    pricePerDay: "",
                    stock: "",
                    imageUrl: "",
                    fuelType: "Gasoline",
                    transmission: "manual",
                    seats: "",
                    year: "",
                  });
                }}
              >
                ❌ ยกเลิก
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        รายการรถทั้งหมด
      </Typography>

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <CardMedia
                component="img"
                image={car.imageUrl}
                alt={car.name}
                sx={{
                  height: "180px",
                  objectFit: "fill",
                  width: "250px",
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{car.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ประเภท: {car.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ราคา/วัน: ฿{car.pricePerDay}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ที่นั่ง: {car.seats}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ปี: {car.year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  เกียร์: {car.transmission}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  เชื้อเพลิง: {car.fuelType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  จำนวนคัน: {car.stock}
                </Typography>

                <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                  <Tooltip title="แก้ไข">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditCar(car)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="ลบ">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
