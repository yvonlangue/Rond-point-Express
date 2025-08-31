import express from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// POST /api/payments/initiate - Initiate payment
router.post('/initiate', async (req: AuthenticatedRequest, res) => {
  try {
    const { amount, paymentMethod, phoneNumber, description } = req.body;
    
    if (!amount || !paymentMethod || !phoneNumber) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Amount, payment method, and phone number are required' 
      });
    }

    // Validate payment method
    if (!['mtn', 'orange'].includes(paymentMethod)) {
      return res.status(400).json({ 
        error: 'Invalid payment method',
        message: 'Payment method must be either "mtn" or "orange"' 
      });
    }

    // Validate phone number format
    const phoneRegex = /^(\+237|237)?[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ 
        error: 'Invalid phone number',
        message: 'Please enter a valid Cameroonian phone number' 
      });
    }

    // Generate transaction reference
    const transactionRef = `RPE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // TODO: Integrate with actual mobile money APIs
    // For now, simulate payment initiation
    const paymentData = {
      transactionRef,
      amount,
      paymentMethod,
      phoneNumber,
      description: description || 'Rond-point Express Payment',
      status: 'pending',
      userId: req.user!._id,
      createdAt: new Date()
    };

    // Simulate API call to mobile money provider
    const mockResponse = {
      success: true,
      transactionRef,
      message: `Payment initiated. Please check your ${paymentMethod.toUpperCase()} for payment request.`,
      instructions: `Complete the payment on your ${paymentMethod.toUpperCase()} app to proceed.`
    };

    res.json({
      ...mockResponse,
      paymentData
    });

  } catch (error) {
    console.error('Initiate payment error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// POST /api/payments/verify - Verify payment status
router.post('/verify', async (req: AuthenticatedRequest, res) => {
  try {
    const { transactionRef } = req.body;
    
    if (!transactionRef) {
      return res.status(400).json({ 
        error: 'Transaction reference required' 
      });
    }

    // TODO: Verify payment with mobile money provider
    // For now, simulate verification
    const mockVerification = {
      success: true,
      transactionRef,
      status: 'completed', // or 'pending', 'failed'
      amount: 25000,
      paymentMethod: 'mtn',
      phoneNumber: '+237612345678',
      completedAt: new Date()
    };

    res.json(mockVerification);

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// GET /api/payments/history - Get payment history
router.get('/history', async (req: AuthenticatedRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // TODO: Get payment history from database
    // For now, return mock data
    const mockPayments = [
      {
        id: '1',
        transactionRef: 'RPE_1234567890_abc123',
        amount: 25000,
        paymentMethod: 'mtn',
        status: 'completed',
        description: 'Premium Subscription - Monthly',
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        transactionRef: 'RPE_1234567891_def456',
        amount: 5000,
        paymentMethod: 'orange',
        status: 'completed',
        description: 'Event Ticket Purchase',
        createdAt: new Date('2024-01-10'),
        completedAt: new Date('2024-01-10')
      }
    ];

    res.json({
      payments: mockPayments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: mockPayments.length,
        pages: 1
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

// POST /api/payments/webhook - Webhook for payment notifications
router.post('/webhook', async (req, res) => {
  try {
    const { transactionRef, status, amount, paymentMethod } = req.body;

    // TODO: Verify webhook signature for security
    // TODO: Update payment status in database
    // TODO: Trigger user upgrade if payment is for premium subscription

    console.log('Payment webhook received:', {
      transactionRef,
      status,
      amount,
      paymentMethod
    });

    res.json({ success: true });

  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /api/payments/methods - Get available payment methods
router.get('/methods', async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'mtn',
        name: 'MTN Mobile Money',
        logo: '/images/mtn-logo.png',
        description: 'Pay with MTN Mobile Money',
        supported: true
      },
      {
        id: 'orange',
        name: 'Orange Money',
        logo: '/images/orange-logo.png',
        description: 'Pay with Orange Money',
        supported: true
      }
    ];

    res.json({ paymentMethods });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

export default router;
