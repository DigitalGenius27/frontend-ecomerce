import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount }) => {
    return(
        <PayPalScriptProvider options={{ "client-id": "Afw7d2U6y6O5igHr3yE2tZZCxxXmhWMhxsFbq8N5oDgVl7HZvjavotnMAWzpgUvoGxVo2fsiidtSfS8j" }}>
            <PayPalButtons style={{layout: "vertical"}}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    actions.order.capture().then((datails) =>{
                        console.log("pago aprobado:", datails);
                        alert(`gracias por tu compra, ${datails.payer.name.given_name}`);
                    });
                }}
                onError={(err) => {
                    console.error("error en el pago:", err);
                    alert("hubo un error al procesar el pago")
                }}
            />
        </PayPalScriptProvider >
    );
}

export default PaypalButton