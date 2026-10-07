require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const passwordRecoveryRouter = require('./routes/passwordRecovery');
const dashboardRoutes = require('./routes/dashboard');
const noticesRouter = require('./routes/notices');
const uploadRoutes = require('./routes/uploadRoutes');
const viewResultRoutes = require('./routes/viewResultRoutes');
const courseRoutes = require('./routes/courseRoutes');
const uploadStudentListRoutes = require('./routes/uploadStudentList');
const paymentSlipRoutes = require('./routes/paymentSlip');
const history = require('./routes/history');
const enrollmentVerificationRoutes = require('./routes/enrollmentVerificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', authRoutes);
app.use('/api', passwordRecoveryRouter);
app.use('/api', uploadRoutes);
app.use('/api', viewResultRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notices', noticesRouter);
app.use('/api', enrollmentVerificationRoutes);
app.use('/api', courseRoutes);
app.use('/api', paymentSlipRoutes);
app.use('/api', uploadStudentListRoutes);
app.use('/api/history', history);
app.use('/api', paymentRoutes);
app.use('/api', teacherRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
