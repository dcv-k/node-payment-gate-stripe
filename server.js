require("dotenv").config()

const express = require("express")
const app = express()

app.request(express.json())

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const db = new Map([
    [1, {priceInCents: 1000, name: "Item 001"}],
    [2, {priceInCents: 3000, name: "Item 002"}]
])

app.post("/checkout", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.items.map(item => {
                const dbItem = db.get(item.id)
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: dbItem.name
                        },
                        unit_amount: dbItem.priceInCents
                    },
                    quantity: item.qty
                }
            }),
            success: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`
        })
        res.json({ url: session.url })   
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

app.listen(3000)