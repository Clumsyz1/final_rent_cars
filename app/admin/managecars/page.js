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
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { db } from "@/app/firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    pricePerDay: "",
    stock: "",
    imageUrl: "",
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

  const handleAddCar = async () => {
    await addDoc(collection(db, "cars"), {
      ...form,
      pricePerDay: Number(form.pricePerDay),
      stock: Number(form.stock),
    });
    setForm({ name: "", type: "", pricePerDay: "", stock: "", imageUrl: "" });
    fetchCars();
  };

  const handleDeleteCar = async (id) => {
    await deleteDoc(doc(db, "cars", id));
    fetchCars();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Paper sx={{ p: 4, m: 3 }}>
      <Typography variant="h4" gutterBottom>
        ➕➖ จัดการรถ
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
            label="ประเภท"
            name="type"
            value={form.type}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="ราคา/วัน"
            name="pricePerDay"
            value={form.pricePerDay}
            onChange={handleChange}
            fullWidth
            required
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="จำนวนคงเหลือ"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            required
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="รูปภาพ (URL)"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAddCar}>
            ➕ เพิ่มรถ
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        รายการรถทั้งหมด
      </Typography>
      <Grid container spacing={2}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                width={450}
                image={car.imageUrl}
              />
              <CardContent>
                <Typography variant="h6">{car.name}</Typography>
                <Typography>ประเภท: {car.type}</Typography>
                <Typography>ราคา/วัน: ฿{car.pricePerDay}</Typography>
                <Typography>คงเหลือ: {car.stock}</Typography>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteCar(car.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
