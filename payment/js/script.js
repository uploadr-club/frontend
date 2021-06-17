var stripe, customer, setupIntent, plan;
var signupForm = document.getElementById("signup-form");
var paymentForm = document.getElementById("payment-form");


function reqHandler() {
    let req = fetch("https://api.uploadr.club/api/v1/session/check", {
        method: "POST",
        body: JSON.stringify({
            token: localStorage.getItem("token")
        })
    })
    if (req.ok) {
        return req;
    } else {
        return req;
    }
}

function checkIfLoggedIn() {
    let exp_ts = localStorage.getItem("expire_timestamp");
    let c_ts = Math.round(new Date() / 1000);
    if (exp_ts < c_ts) {
        window.location = "/login.html"
    } else {
        reqHandler().then(req => {
            if (!req.ok) {
                window.location = "/login.html"
            }
        })
    }

}

checkIfLoggedIn()

var stripeElements = function(publishableKey) {
    stripe = Stripe(publishableKey,);
    var elements = stripe.elements();

    var style = {
        base: {
            fontSize: "16px",
            color: "#32325d",
            fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
            fontSmoothing: "antialiased",
            "::placeholder": {
                color: "rgba(0,0,0,0.4)"
            }
        }
    };

    var card = elements.create("card", {
        style: style,
        hidePostalCode: true
    });

    card.mount("#card-element");
    card.on("focus", function() {
        var el = document.getElementById(`${card._componentName}-element`);
        el.classList.add("focused");
    });

    card.on("blur", function() {
        var el = document.getElementById(`${card._componentName}-element`);
        el.classList.remove("focused");
    });

    card.on("change", function(event) {
        var displayError = document.getElementById("error-message");
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = "";
        }
    });

    signupForm.addEventListener("submit", function(evt) {
        evt.preventDefault();

        document.getElementById("signup-view").classList.add("hidden");
        document.getElementById("payment-view").classList.remove("hidden");

        createCustomer().then(result => {
            if (result.error) {
                document.getElementById("errorDisplay").hidden = false;
                document.getElementById("errorDisplay").innerText = result.error;
            } else {
                customer = result.customer;
                setupIntent = result.setupIntent;

                paymentForm.addEventListener("submit", function (evt) {
                    evt.preventDefault();
                    changeLoadingState(true);

                    var payment = paymentForm.querySelector("input[name=payment]:checked")
                        .value;
                    setupPaymentMethod(setupIntent.client_secret, payment, {
                        card: card,
                    });
                });
            }
        });
    });
};

var setupPaymentMethod = function(setupIntentSecret, paymentMethod, element) {
    var billingName = document.querySelector("#name").value;
    var billingEmail = document.querySelector("#email").value;

    switch (paymentMethod) {
        case "card":
            stripe
                .confirmCardSetup(setupIntentSecret, {
                    payment_method: {
                        card: element[paymentMethod],
                        billing_details: {
                            name: billingName,
                            email: billingEmail
                        }
                    }
                })
                .then(handleResult);
            break;
        default:
            console.warn("Unhandled Payment Method!");
            break;
    }

    function handleResult(result) {
        if (result.error) {
            showCardError(result.error);
        } else {
            createSubscription(customer.id, result.setupIntent.payment_method);
        }
    }
};

function createCustomer() {
    var billingName = document.querySelector("#name").value;
    var billingEmail = document.querySelector("#email").value;

    return fetch("https://api.uploadr.club/api/v1/billing/v1/create-customer", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("token")
        },
        body: JSON.stringify({
            name: billingName,
            email: billingEmail
        })
    })
        .then(response => {
            return response.json();
        })
        .then(result => {
            return result;
        });
}

function createSubscription(customerId, paymentMethodId) {
    return fetch("https://api.uploadr.club/api/v1/billing/v1/subscription", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            customerId: customerId,
            paymentMethodId: paymentMethodId
        })
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(subscription) {
            orderComplete(subscription);
        });
}

function showCardError(error) {
    changeLoadingState(false);
    var errorMsg = document.querySelector(".sr-field-error");
    errorMsg.textContent = error.message;
    setTimeout(function() {
        errorMsg.textContent = "";
    }, 8000);
}

function showPriceDetails(plan) {
    var amount = plan.amount;
    var numberFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: plan.currency,
        currencyDisplay: "symbol"
    });
    var parts = numberFormat.formatToParts(amount);
    var zeroDecimalCurrency = true;
    for (var part of parts) {
        if (part.type === "decimal") {
            zeroDecimalCurrency = false;
        }
    }
    amount = zeroDecimalCurrency ? amount : amount / 100;
    var formattedAmount = numberFormat.format(amount);

    document.querySelector(
        ".order-amount"
    ).innerText = `${formattedAmount} per ${plan.interval}`;
}

function getConfig() {
    return fetch(`https://api.uploadr.club/api/v1/billing/v1/config?plan=${localStorage.getItem('plan')}`, {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            showPriceDetails(response.plan);
            stripeElements(response.publishableKey);
        });
}

getConfig();


var orderComplete = function(subscription) {
    changeLoadingState(false);
    var subscriptionJson = JSON.stringify(subscription, null, 2);
    document.querySelectorAll(".sr-form").forEach(function(view) {
        view.classList.add("hidden");
    });
    document.querySelectorAll(".completed-view").forEach(function(view) {
        view.classList.remove("hidden");
    });
    document.querySelector(".order-status").textContent = subscription.status;
};

var changeLoadingState = function(isLoading) {
    if (isLoading) {
        document.querySelector("#payment-form button").disabled = true;
        document.querySelector("#spinner").classList.add("loading");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#payment-form button").disabled = false;
        document.querySelector("#spinner").classList.remove("loading");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};

var showPaymentMethods = function() {
    for (let input of document.querySelectorAll("input[name=payment]")) {
        input.addEventListener("change", event => {
            event.preventDefault();
            var payment = paymentForm.querySelector("input[name=payment]:checked")
                .value;

            paymentForm
                .querySelector(".payment-info.card")
                .classList.toggle("visible", payment === "card");
        });
    }
};
showPaymentMethods();