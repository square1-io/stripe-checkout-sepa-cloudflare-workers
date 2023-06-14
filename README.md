# Streamline SEPA Bank Detail Collection: A Serverless Approach with Stripe and Cloudflare Workers

Collect SEPA payment details from users via Stripe Checkout, via Cloudflare Workers.

A full walkthrough is available [here](https://www.conroyp.com/articles/sepa-bank-details-stripe-cloudflare-workers-serverless).


## Install wrangler

[Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) is Cloudflare's toolkit for developing Workers. If it is not already set up on your system, install it.

It can be installed using either npm:

`npm install -g wrangler`

or yarn:

`yarn add -g wrangler`


## Link wrangler to your Cloudflare account

`wrangler login`

This will create an authentication session in your browser. Once you approve the connection in the browser, go back to the console. If you have more than one Cloudflare account under your login, you'll be asked to select the specific one to authorise.


## Local setup

Clone the repository:

`git clone git@github.com:square1-io/stripe-checkout-sepa-bank-details-cloudflare-workers-example.git`

Install dependencies:
`npm install`


## Add your Stripe secret to Cloudflare's vault

Get your secret key from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

`wrangler secret put STRIPE_API_KEY`

This will prompt you to save a value to Cloudflare's secret storage, using the key name `STRIPE_API_KEY`.


## Deploy to Cloudflare

`wrangler deploy`


## Link to a route within Cloudflare

To set up a route in the dashboard:

* Log in to the [Cloudflare dashboard](https://dash.cloudflare.com/) and select your account.
* Go to Workers & Pages and in Overview, select your Worker.
* Go to Triggers > Routes > Add route.
* Enter the route and select the zone it applies to.
* Select Add route.

Routes can be configured to have matching behaviour, rather than matching only a particular keyword. More information on matching behaviour can be found on the [Cloudflare docs](https://developers.cloudflare.com/workers/platform/triggers/routes/#matching-behavior).
