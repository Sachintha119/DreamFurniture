package com.furniture.services;

public class PaymentService {

    // Process payment
    public static boolean processPayment(String orderId, String cardNumber, double amount, String paymentMethod) {
        try {
            // Basic validation
            if (cardNumber == null || cardNumber.length() != 16) {
                return false;
            }

            if (amount <= 0) {
                return false;
            }

            // Simulate payment processing
            System.out.println("Processing payment of $" + amount + " for order: " + orderId);
            System.out.println("Payment Method: " + paymentMethod);

            // In a real app, this would connect to a payment gateway (Stripe, PayPal, etc.)
            boolean paymentSuccess = simulatePaymentGateway(cardNumber, amount);

            if (paymentSuccess) {
                // Update order status
                OrderService.updateOrderStatus(orderId, "processing");
                System.out.println("Payment successful for order: " + orderId);
                return true;
            }

            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Validate card details
    public static boolean validateCard(String cardNumber, String expiry, String cvv) {
        if (cardNumber == null || cardNumber.length() != 16)
            return false;
        if (!cardNumber.matches("\\d+"))
            return false;

        if (expiry == null || !expiry.matches("\\d{2}/\\d{2}"))
            return false;

        if (cvv == null || !cvv.matches("\\d{3}"))
            return false;

        return true;
    }

    // Simulate payment gateway (would be actual integration with Stripe, PayPal,
    // etc.)
    private static boolean simulatePaymentGateway(String cardNumber, double amount) {
        // Simulate 95% success rate
        return Math.random() < 0.95;
    }

    // Get payment status
    public static String getPaymentStatus(String orderId) {
        // This would check payment status from gateway
        return "completed";
    }

    // Refund payment
    public static boolean refundPayment(String orderId, double amount) {
        try {
            System.out.println("Processing refund of $" + amount + " for order: " + orderId);
            // In a real app, this would connect to payment gateway
            boolean refundSuccess = simulateRefund(amount);
            if (refundSuccess) {
                OrderService.updateOrderStatus(orderId, "refunded");
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Simulate refund
    private static boolean simulateRefund(double amount) {
        return Math.random() < 0.95;
    }
}
