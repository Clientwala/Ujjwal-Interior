const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Lead = require('./models/Lead');
const Chat = require('./models/Chat');
const { sendInquiryNotification } = require('./services/telegramService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI Setup
// Raw password: Kamlesh@#2005 -> Encoded password: Kamlesh%40%232005
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://kamleshsharmathink:Kamlesh%40%232005@cluster0.lpwxhp7.mongodb.net/Ujjwalinterior?appName=Cluster0';

let cachedConnection = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', resolve);
    });
    return mongoose.connection;
  }

  console.log('Connecting to MongoDB...');
  cachedConnection = mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000
  });

  try {
    await cachedConnection;
    console.log('Successfully connected to MongoDB (Database: Ujjwalinterior)');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    cachedConnection = null;
    throw err;
  }
  return mongoose.connection;
}

// Middleware to ensure DB connection
const connectDbMiddleware = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('Failed to connect to database in middleware:', err);
    res.status(500).json({ error: 'Database connection failed. Please try again later.' });
  }
};

app.use(connectDbMiddleware);

// --- API ROUTES ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, email, password, project } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, phone, email, password) are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email or phone number already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      project: project || 'Residential'
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        phone: savedUser.phone,
        email: savedUser.email,
        project: savedUser.project
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/Phone and password are required.' });
    }

    const queryVal = emailOrPhone.toLowerCase().trim();
    
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: queryVal }, { phone: queryVal }]
    });

    if (!user) {
      return res.status(400).json({ error: 'No account found with this email or phone number.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    res.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        project: user.project
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
});

// Save Lead Enquiry
app.post('/api/leads/enquiry', async (req, res) => {
  try {
    const { name, phone, email, locality, service, propertyType, budget, message } = req.body;

    if (!name || !phone || !service) {
      return res.status(400).json({ error: 'Name, phone, and service are required.' });
    }

    const newLead = new Lead({
      name,
      phone,
      email,
      locality,
      service,
      propertyType,
      budget,
      message
    });

    const savedLead = await newLead.save();
    
    // Send Telegram notification (awaited to ensure completion in serverless environments)
    // Internal try/catch inside sendInquiryNotification guarantees it will not interrupt lead saving
    await sendInquiryNotification(savedLead);

    res.status(201).json({
      message: 'Enquiry saved successfully to MongoDB.',
      leadId: savedLead._id
    });
  } catch (err) {
    console.error('Lead save error:', err);
    res.status(500).json({ error: 'Internal Server Error. Failed to save lead.' });
  }
});

// Log AI Chat
app.post('/api/chats/log', async (req, res) => {
  try {
    const { userQuery, botResponse, userId } = req.body;

    if (!userQuery || !botResponse) {
      return res.status(400).json({ error: 'User query and bot response are required.' });
    }

    const newChat = new Chat({
      userQuery,
      botResponse,
      userId: userId || 'guest'
    });

    await newChat.save();

    res.status(201).json({ message: 'Chat log saved successfully.' });
  } catch (err) {
    console.error('Chat log error:', err);
    res.status(500).json({ error: 'Internal Server Error. Failed to log chat.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
