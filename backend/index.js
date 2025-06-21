require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_aqui';

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/docentes')
  .then(() => console.log('Conectado a MongoDB base docentes'))
  .catch(err => console.error('Error en conexión MongoDB:', err));

// Modelos
const teacherSchema = new mongoose.Schema({
  usuario: { type: String, unique: true, required: true },
  contraseña: { type: String, required: true }
}, { collection: 'teachers' });

const Teacher = mongoose.model('Teacher', teacherSchema);

const studentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: String,
}, { collection: 'students' });

const Student = mongoose.model('Student', studentSchema);

const testSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha: { type: Date, required: true }
}, { collection: 'tests' });

const Test = mongoose.model('Test', testSchema);

// Middleware para verificar token JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ error: 'No autorizado' });
  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.teacherId = payload.teacherId;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// Rutas

// Login
app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;
  try {
    const teacher = await Teacher.findOne({ usuario });
    if (!teacher || teacher.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ teacherId: teacher._id }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Obtener alumnos
app.get('/students', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

// Agregar alumno
app.post('/students', authMiddleware, async (req, res) => {
  const { nombre, email } = req.body;
  if(!nombre) return res.status(400).json({ error: 'Nombre es obligatorio' });
  try {
    const newStudent = new Student({ nombre, email });
    await newStudent.save();
    res.status(201).json({ message: 'Alumno agregado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar alumno' });
  }
});

// Obtener pruebas
app.get('/tests', authMiddleware, async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pruebas' });
  }
});

// Crear prueba
app.post('/tests', authMiddleware, async (req, res) => {
  const { nombre, descripcion, fecha } = req.body;
  if (!nombre || !fecha) return res.status(400).json({ error: 'Nombre y fecha son obligatorios' });
  try {
    const newTest = new Test({ nombre, descripcion, fecha });
    await newTest.save();
    res.status(201).json({ message: 'Prueba creada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear prueba' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Esquema y modelo de asistencia
const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  status: { type: String, enum: ['Presente', 'Ausente'], required: true }
}, { collection: 'attendances' });

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Ruta para obtener lista de asistencia por testId
app.get('/attendance/:testId', authMiddleware, async (req, res) => {
  const { testId } = req.params;
  try {
    const attendanceList = await Attendance.find({ testId })
      .populate('studentId', 'nombre email');
    res.json(attendanceList);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lista de asistencia' });
  }
});

// Ruta para guardar o actualizar asistencia
app.post('/attendance', authMiddleware, async (req, res) => {
  const { studentId, testId, status } = req.body;
  if (!studentId || !testId || !status) {
    return res.status(400).json({ error: 'Faltan datos para registrar asistencia' });
  }
  try {
    const existing = await Attendance.findOne({ studentId, testId });
    if (existing) {
      existing.status = status;
      await existing.save();
    } else {
      const attendance = new Attendance({ studentId, testId, status });
      await attendance.save();
    }
    res.json({ message: 'Asistencia registrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar asistencia' });
  }
});
