const payBtn = document.getElementById("payBtn");

payBtn.addEventListener("click", async () => {
  try {

    const amount = document.getElementById("amount").value;

    if (!amount) {
      return alert("Please enter amount");
    }

    // ==============================
    // CREATE ORDER
    // ==============================
    const orderResponse = await fetch(
      "http://localhost:5000/api/payments/create-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // PUT JWT TOKEN HERE
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmYyNzliYzUwN2FlOGNmOGQ3Y2RkNSIsImlhdCI6MTc3ODM4MTU4OSwiZXhwIjoxNzc4OTg2Mzg5fQ.Pgl8MwZt8fOYpA5VbHxp1P3_qvMIlouHEMyjlXglTdc",
        },
        body: JSON.stringify({
          amount,
        }),
      }
    );

    const orderData = await orderResponse.json();

    console.log(orderData);

    if (!orderData.success) {
      return alert(orderData.message);
    }

    const order = orderData.order;

    // ====================================
    // OPEN RAZORPAY CHECKOUT
    // ====================================
    const options = {
      key: "rzp_test_SZHSoOij6hBxel",

      amount: order.amount,

      currency: order.currency,

      name: "Food Delivery App",

      description: "Order Payment",

      order_id: order.id,

      handler: async function (response) {

        console.log(response);

        // ==========================
        // VERIFY PAYMENT
        // ==========================
        const verifyResponse = await fetch(
          "http://localhost:5000/api/payments/verify",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",

              Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmYyNzliYzUwN2FlOGNmOGQ3Y2RkNSIsImlhdCI6MTc3ODM4MTU4OSwiZXhwIjoxNzc4OTg2Mzg5fQ.Pgl8MwZt8fOYpA5VbHxp1P3_qvMIlouHEMyjlXglTdc",
            },

            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,

              // YOUR REAL ORDER ID FROM DB
              orderId: "69ff58184258edb52ead34a6",
            }),
          }
        );

        const verifyData = await verifyResponse.json();

        console.log(verifyData);

        if (verifyData.success) {
          window.location.href = "../success.html";
        } else {
          window.location.href = "../failed.html";
        }
      },

      prefill: {
        name: "Jeevan",
        email: "jeevan@gmail.com",
        contact: "9999999999",
      },

      theme: {
        color: "#3399cc",
      },
    };

    const razor = new Razorpay(options);

    razor.open();

    // ==============================
    // PAYMENT FAILED
    // ==============================
    razor.on("payment.failed", async function () {

      await fetch(
        "http://localhost:5000/api/payments/failed",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZmYyNzliYzUwN2FlOGNmOGQ3Y2RkNSIsImlhdCI6MTc3ODM4MTU4OSwiZXhwIjoxNzc4OTg2Mzg5fQ.Pgl8MwZt8fOYpA5VbHxp1P3_qvMIlouHEMyjlXglTdc",
          },

          body: JSON.stringify({
            orderId: "69ff58184258edb52ead34a6",
          }),
        }
      );

      window.location.href = "../failed.html";
    });

  } catch (error) {
    console.log(error);
    alert(error.message);
  }
});