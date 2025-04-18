"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  Grid,
  Card,
  Box,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
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

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [editId, setEditId] = useState(null); // <--- ใช้สำหรับบันทึก id ของรถที่จะแก้ไข
  const [form, setForm] = useState({
    name: "",
    type: "",
    pricePerDay: "",
    stock: "",
    imageUrl: "",
    fuelType: "",
    transmission: "",
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
      // แก้ไข
      await updateDoc(doc(db, "cars", editId), carData);
    } else {
      // เพิ่มใหม่
      await addDoc(collection(db, "cars"), carData);
    }

    // เคลียร์
    setForm({
      name: "",
      type: "",
      pricePerDay: "",
      stock: "",
      imageUrl: "",
      fuelType: "",
      transmission: "",
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
      type: car.type || "",
      pricePerDay: car.pricePerDay || "",
      stock: car.stock || "",
      imageUrl: car.imageUrl || "",
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      seats: car.seats || "",
      year: car.year || "",
    });
    setEditId(car.id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll ขึ้น
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Paper sx={{ p: 4, m: 3 }}>
      <Typography variant="h4" gutterBottom>
        {editId ? "✏️ แก้ไขรถ" : "➕➖ จัดการรถ"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

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
            label="ประเภทรถ"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            required
          />
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
            label="คงเหลือ"
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
            label="ระบบเกียร์"
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="เชื้อเพลิง"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
            fullWidth
            required
          />
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
          <Button
            variant="contained"
            onClick={handleAddOrUpdateCar}
            color={editId ? "warning" : "primary"}
          >
            {editId ? "✅ บันทึกการแก้ไข" : "➕ เพิ่มรถ"}
          </Button>
          {editId && (
            <Button
              sx={{ ml: 2 }}
              onClick={() => {
                setEditId(null);
                setForm({
                  name: "",
                  type: "",
                  pricePerDay: "",
                  stock: "",
                  imageUrl: "",
                  fuelType: "",
                  transmission: "",
                  seats: "",
                  year: "",
                });
              }}
            >
              ❌ ยกเลิก
            </Button>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        รายการรถทั้งหมด
      </Typography>
      <Grid container spacing={2}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="140"
                image={car.imageUrl}
                alt={car.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{car.name}</Typography>
                <Typography>ประเภท: {car.type}</Typography>
                <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                <Typography>ที่นั่ง: {car.seats}</Typography>
                <Typography>ปี: {car.year}</Typography>
                <Typography>เกียร์: {car.transmission}</Typography>
                <Typography>เชื้อเพลิง: {car.fuelType}</Typography>
                <Typography>คงเหลือ: {car.stock}</Typography>
                <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
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
