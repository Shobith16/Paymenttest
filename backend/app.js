const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: 'rzp_test_jML2HcCxuJ0XZV', // Replace with your actual key_id
    key_secret: 'X6wlucKdQ1Zqq5Va6ym3Ycnx' // Replace with your actual key_secret
});

app.post('/create-order', async (req, res) => {
    const { amount, currency, receipt, ...options } = req.body; // Extract order details from request
    try {
        const order = await instance.orders.create(options);
        res.json({
            id: order.id, // Send order ID as response
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            ...order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/verify-payment', async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const expectedSignature = crypto.createHmac('sha256', KEY_SECRET)
        .update(`<span class="math-inline">\{ORDER\_ID\}\|</span>{RAZORPAY_PAYMENT_ID}`)
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            const payment = await instance.payments.capture(razorpay_payment_id);
            // Handle successful payment (e.g., update order status, send confirmation email)
            res.json({ status: 'success', payment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    } else {
        console.error('Invalid signature');
        res.status(400).json({ error: 'Invalid signature' });
    }
});

const server = app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
