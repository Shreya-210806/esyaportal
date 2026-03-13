# PortalPal - Consumer Portal

## 🚀 Quick Start

### 1. Setup Database with Dummy Users
```bash
cd backend
node seed.js
```

This will create 10 dummy users in MongoDB with 3 months of bills each.

### 2. Start Backend Server
```bash
cd backend
npm start
```

### 3. Start Frontend
```bash
npm run dev
```

## 👥 Dummy Users

All dummy users have the password: `password123`

| Consumer Number | Name | Email | Contact | Region |
|----------------|------|-------|---------|--------|
| CN-10001 | Rajesh Kumar | rajesh.kumar@gmail.com | 9876543210 | Thane, Maharashtra |
| CN-10002 | Priya Singh | priya.singh@gmail.com | 9876543211 | Mumbai, Maharashtra |
| CN-10003 | Amit Patel | amit.patel@gmail.com | 9876543212 | Pune, Maharashtra |
| CN-10004 | Neha Gupta | neha.gupta@gmail.com | 9876543213 | Thane, Maharashtra |
| CN-10005 | Vikram Shah | vikram.shah@gmail.com | 9876543214 | Mumbai, Maharashtra |
| CN-10006 | Anjali Desai | anjali.desai@gmail.com | 9876543215 | Pune, Maharashtra |
| CN-10007 | Rohit Verma | rohit.verma@gmail.com | 9876543216 | Thane, Maharashtra |
| CN-10008 | Sneha Joshi | sneha.joshi@gmail.com | 9876543217 | Mumbai, Maharashtra |
| CN-10009 | Arjun Reddy | arjun.reddy@gmail.com | 9876543218 | Pune, Maharashtra |
| CN-10010 | Kavya Nair | kavya.nair@gmail.com | 9876543219 | Thane, Maharashtra |

## 💡 Features

### Bill Generation
- **3 months of bills** are automatically generated for each user on first login
- Bills include: January, February, and Current month
- Each bill has a random amount between ₹800-₹3000

### Bill Payment
- Pay bills through the Bills page
- Mark bills as paid with payment confirmation
- Download bill receipts as JSON files

### User Registration
- Register with consumer number selection
- Automatic bill generation on first login
- Complete user profile management

## 🔧 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Bills
- `GET /api/users/bills/:userId` - Get user bills
- `POST /api/users/bills/:billId/pay` - Pay a bill
- `GET /api/users/bills/:billId/download` - Download bill

## 🧪 Testing

### Login Test
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"consumerNumber":"CN-10001","password":"password123"}'
```

### Pay Bill Test
```bash
curl -X POST http://localhost:5000/api/users/bills/{billId}/pay \
  -H "Content-Type: application/json" \
  -d '{"userId":"{userId}","paidAmount":1000}'
```

## 📱 Frontend Access

- **Frontend:** http://localhost:8084
- **Backend:** http://localhost:5000

## 🗃️ Database Schema

### User Fields
- name, email, password, contactNumber, region
- consumerNumber, meterNumber
- role, applicationStatus, isFirstLogin

### Bill Fields
- userId, billNumber, amount, dueDate, status
- paidDate, paidAmount, createdAt