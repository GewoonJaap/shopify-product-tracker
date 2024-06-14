# Shopify Product Tracker

A Cloudflare Worker that tracks new products on Shopify stores and sends a notification to NTFY.

## Usage

- Create a `.dev.vars` file based on the contents of `.dev.vars.example` and fill in the required values, also set these variables on the Cloudflare Worker page.
- Create a D1 database on Cloudflare Workers that has the `/src/util/interface/ProductDb.ts` schema.
- Deploy the worker to Cloudflare using Wrangler. `yarn deploy`.

## NTFY.SH

This Cloudflare Worker uses NTFY.SH to send notifications. You can sign up for a free account at [NTFY.SH](https://ntfy.sh/) or host your own NTFY.SH instance.

## Alerting rules

This Worker will send a notifcation once a new product has been added to the Shopify store. It will also send a notification if the product has been updated.
A direct link to the product will be included in the NTFY.SH notification.

## Adding more stores

To add more stores to track, add the store URL to the `stores` array in the `config.ts` file.
