import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Bill {
  id: string;
  billNumber?: string;
  userId: string;
  consumerNumber: string;
  consumerName?: string;
  month: string;
  unitsConsumed: number;
  billAmount: number;
  dueDate: string;
  billStatus: 'Paid' | 'Pending' | 'overdue';
  paidDate?: string;
  paidAmount?: number;
}

export interface Payment {
  id: string;
  transactionId: string;
  userId: string;
  billId: string;
  billNumber: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Net Banking' | 'Wallet';
  status: 'success' | 'failed' | 'pending';
  dateTime: string;
  consumerNumber: string;
}

export interface ConsumptionData {
  month: string;
  units: number;
  amount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bill' | 'payment' | 'reminder' | 'alert' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  requestNumber: string;
  type: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  rating?: number;
  feedback?: string;
}

interface DataContextType {
  bills: Bill[];
  payments: Payment[];
  consumption: ConsumptionData[];
  notifications: Notification[];
  serviceRequests: ServiceRequest[];
  unreadCount: number;
  payBill: (billId: string, method: Payment['method'], amount: number) => Promise<Payment>;
  addServiceRequest: (data: Omit<ServiceRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  rateService: (requestId: string, rating: number, feedback: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function generateBills(userId: string, consumerNumber: string): Bill[] {
  const months = [
    'January 2025', 'February 2025', 'March 2025', 'April 2025',
    'May 2025', 'June 2025', 'July 2025', 'August 2025',
    'September 2025', 'October 2025', 'November 2025', 'December 2025',
  ];
  return months.map((month, idx) => {
    const units = 150 + Math.floor(Math.random() * 250);
    const amount = units * 7.5 + 120;
    const isPaid = idx < 10;
    const dueDay = 15;
    const monthNum = (idx + 1).toString().padStart(2, '0');
    return {
      id: `bill-${userId}-${idx}`,
      billNumber: `BILL${new Date().getFullYear()}${monthNum}${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      consumerNumber,
      month: month,
      unitsConsumed: units,
      billAmount: Math.round(amount),
      dueDate: `2025-${monthNum}-${dueDay}`,
      billStatus: isPaid ? 'Paid' : 'Pending',
      paidDate: isPaid ? `2025-${monthNum}-${Math.floor(5 + Math.random() * 8)}` : undefined,
      paidAmount: isPaid ? Math.round(amount) : undefined,
    };
  });
}

function generatePayments(bills: Bill[], userId: string, consumerNumber: string): Payment[] {
  const methods: Payment['method'][] = ['UPI', 'Card', 'Net Banking', 'Wallet'];
  return bills
    .filter((b) => b.billStatus === 'Paid' && b.paidDate)
    .map((bill) => ({
      id: `pay-${bill.id}`,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 9999)}`,
      userId,
      billId: bill.id,
      billNumber: bill.billNumber,
      amount: bill.paidAmount!,
      method: methods[Math.floor(Math.random() * methods.length)],
      status: 'success' as const,
      dateTime: `${bill.paidDate}T${String(Math.floor(9 + Math.random() * 12)).padStart(2,'0')}:${String(Math.floor(Math.random() * 59)).padStart(2,'0')}:${String(Math.floor(Math.random() * 59)).padStart(2,'0')}`,
      consumerNumber,
    }));
}

function generateConsumption(bills: Bill[]): ConsumptionData[] {
  return bills.map((b) => ({
    month: (b.month || '').split(' ')[0].slice(0, 3) || 'Jan',
    units: b.unitsConsumed || 0,
    amount: b.billAmount || 0,
  }));
}

export function DataProvider({
  children,
  userId,
  consumerNumber,
  connectionStatus = 'active',
  isFirstLogin = false,
}: {
  children: ReactNode;
  userId: string;
  consumerNumber: string;
  connectionStatus?: 'pending' | 'active';
  isFirstLogin?: boolean;
}) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [consumption, setConsumption] = useState<ConsumptionData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    // New users / pending connection: no bills, payments, or consumption
    if (connectionStatus === 'pending') {
      setBills([]);
      setPayments([]);
      setConsumption([]);
      // Keep only non-billing notifications (e.g. application status)
      setNotifications((prev) => prev.filter((n) => n.type === 'info'));
      return;
    }

    // First successful login for this user: no bills or notifications yet
    if (isFirstLogin) {
      setBills([]);
      setPayments([]);
      setConsumption([]);
      setNotifications([]);
      setServiceRequests([]);
      return;
    }

    // Fetch bills from backend API
    const fetchBills = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
        const response = await fetch(`${apiUrl}/api/users/bills/${consumerNumber || userId}`);
        const data = await response.json();

        if (data.success && data.bills) {
          setBills(data.bills);
          // Generate consumption data from bills
          const consumptionData = data.bills.map((bill: Bill) => ({
            month: (bill.month || '').split(' ')[1]?.slice(0, 3) || 'Jan',
            units: bill.unitsConsumed || 0,
            amount: bill.billAmount || 0,
          }));
          setConsumption(consumptionData);

          // Create notifications for unpaid bills
          const billNotifications: Notification[] = data.bills
            .filter((bill: Bill) => bill.billStatus === 'Pending')
            .map((bill: Bill) => ({
              id: `bill-${bill.id || bill.month}`,
              userId,
              type: 'bill' as const,
              title: 'Bill Generated',
              message: `Your ${bill.month} bill of ₹${bill.billAmount.toLocaleString()} has been generated. Due date: ${new Date(bill.dueDate).toLocaleDateString('en-IN')}.`,
              isRead: false,
              createdAt: new Date().toISOString(),
            }));

          setNotifications(billNotifications);
        } else {
          // Fallback to mock data if API fails
          console.warn("Failed to fetch bills from API, using mock data");
          const newBills = generateBills(userId, consumerNumber);
          const newPayments = generatePayments(newBills, userId, consumerNumber);
          const newConsumption = generateConsumption(newBills);
          setBills(newBills);
          setPayments(newPayments);
          setConsumption(newConsumption);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        // Fallback to mock data
        const newBills = generateBills(userId, consumerNumber);
        const newPayments = generatePayments(newBills, userId, consumerNumber);
        const newConsumption = generateConsumption(newBills);
        setBills(newBills);
        setPayments(newPayments);
        setConsumption(newConsumption);
      }
    };

    const fetchPayments = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
        const response = await fetch(`${apiUrl}/api/payment/history/${consumerNumber || userId}`);
        const data = await response.json();
        if (data.success && data.payments) {
          const formattedPayments = data.payments.map((p: any) => ({
            id: p.id,
            transactionId: p.paymentId || p.transactionId,
            userId: p.userId,
            billId: p.billId,
            billNumber: p.billNumber || '',
            amount: p.amount,
            method: p.method,
            status: 'success' as const,
            dateTime: p.date,
            consumerNumber: p.consumerNumber
          }));
          setPayments(formattedPayments);
        }
      } catch (error) {
        console.error("Error fetching payments history:", error);
      }
    };

    fetchBills().then(() => fetchPayments());
  }, [userId, consumerNumber, connectionStatus, isFirstLogin]);

  const saveData = (newBills: Bill[], newPayments: Payment[], newNotifs: Notification[], newReqs: ServiceRequest[]) => {
    if (connectionStatus === 'pending') return; // Don't persist billing data for new connections
    const storageKey = `esyasoft_data_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify({
      bills: newBills,
      payments: newPayments,
      consumption: generateConsumption(newBills),
      notifications: newNotifs,
      serviceRequests: newReqs,
    }));
  };

  const payBill = async (billId: string, method: Payment['method'], amount: number): Promise<Payment> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      
      // Step 1: Create Order on Backend
      const orderResponse = await fetch(`${apiUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, billId }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Step 2: Open Razorpay Checkout
      return new Promise((resolve, reject) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SOm16fzaZX7qFh", // Enter the Key ID generated from the Dashboard
          amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: orderData.currency,
          name: "Esyasoft Electricity Portal",
          description: `Payment for Bill: ${billId}`,
          order_id: orderData.orderId, // This is the order_id created in the backend
          handler: async function (response: any) {
            try {
              // Step 3: Verify Payment on Backend
              const verifyResponse = await fetch(`${apiUrl}/api/payment/verify-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  billId: billId,
                  method: method
                }),
              });

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok || !verifyData.success) {
                reject(new Error(verifyData.error || 'Payment verification failed'));
                return;
              }

              const payment = verifyData.payment;

              // Step 4: Update local state on successful verification
              const updatedBills = bills.map((b) =>
                b.id === billId
                  ? { ...b, billStatus: 'Paid' as const, paidDate: new Date().toISOString().split('T')[0], paidAmount: amount }
                  : b
              );

              const newNotif: Notification = {
                id: crypto.randomUUID(),
                userId,
                type: 'payment',
                title: 'Payment Successful',
                message: `Payment of ₹${amount.toLocaleString()} received successfully. Transaction ID: ${payment.transactionId}`,
                isRead: false,
                createdAt: new Date().toISOString(),
              };

              // Ensure the payment object fits our interface
              const completePayment: Payment = {
                ...payment,
                id: crypto.randomUUID(),
                dateTime: new Date().toISOString(),
                amount: amount,
                billNumber: updatedBills.find(b => b.id === billId)?.billNumber || "",
                consumerNumber: consumerNumber,
                userId: userId
              }

              const updatedPayments = [completePayment, ...payments];
              const updatedNotifs = [newNotif, ...notifications];

              setBills(updatedBills);
              setPayments(updatedPayments);
              setNotifications(updatedNotifs);
              setConsumption(generateConsumption(updatedBills));
              saveData(updatedBills, updatedPayments, updatedNotifs, serviceRequests);

              resolve(completePayment);
            } catch (error) {
              console.error('Verification error:', error);
              reject(error);
            }
          },
          prefill: {
            // Ideally pass user details from auth state if available
            contact: consumerNumber
          },
          theme: {
            color: "#16a34a" // Matches energy-green
          },
          modal: {
            ondismiss: function() {
              reject(new Error("Payment cancelled by user"));
            }
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
           console.error("Payment Failed", response.error);
           reject(new Error(response.error.description || "Payment failed"));
        });
        rzp1.open();
      });

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  };

  const addServiceRequest = (data: Omit<ServiceRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const req: ServiceRequest = {
      ...data,
      id: crypto.randomUUID(),
      requestNumber: `SR${Date.now()}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [req, ...serviceRequests];
    setServiceRequests(updated);
    saveData(bills, payments, notifications, updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveData(bills, payments, updated, serviceRequests);
  };

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveData(bills, payments, updated, serviceRequests);
  };

  const rateService = (requestId: string, rating: number, feedback: string) => {
    const updated = serviceRequests.map((r) =>
      r.id === requestId ? { ...r, rating, feedback } : r
    );
    setServiceRequests(updated);
    saveData(bills, payments, notifications, updated);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: crypto.randomUUID(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    saveData(bills, payments, updated, serviceRequests);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DataContext.Provider value={{
      bills,
      payments,
      consumption,
      notifications,
      serviceRequests,
      unreadCount,
      payBill,
      addServiceRequest,
      markNotificationRead,
      markAllRead,
      rateService,
      addNotification,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
