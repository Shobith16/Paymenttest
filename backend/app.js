const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_j6KWJ17yYlWYl7',
  key_secret: 'HdmPvLO3lpyDjldCI1qfmuLI'
});

// Route to create an order
app.post('/createOrder', (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  razorpayInstance.orders.create({ amount, currency, receipt, notes }, (err, order) => {
    if (!err) {
      res.json(order);
    } else {
      res.send(err);
    }
  });
});

// Route to verify payment
app.post('/verifyOrder', (req, res) => {
  const { order_id, payment_id } = req.body;
  const razorpay_signature = req.headers['x-razorpay-signature'];
  const key_secret = 'HdmPvLO3lpyDjldCI1qfmuLI'; // replace with your key_secret

  const generated_signature = crypto.createHmac('sha256', key_secret)
    .update(order_id + "|" + payment_id)
    .digest('hex');

  if (razorpay_signature === generated_signature) {
    res.json({ success: true, message: "Payment verified!" });
  } else {
    res.json({ success: false, message: "Payment verification failed!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
