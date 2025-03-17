# Migrating from v3.×.× to v4.0.0

## Raised Node.js requirement

Node.js 14+ is officially supported, although we believe Node.js 8+ should work.

## Removed `withParent`

`withParent` has been removed, eliminating state from the client:
```diff
- const payments = mollieClient.customerPayments.withParent(customer).iterate();
+ const payments = mollieClient.customerPayments.iterate({ customerId: customer.id });
  for await (const payment of payments) {
    …
  }
```

## Removed snake case properties (e.g. `payments_refunds`)

Snake case properties have been removed in favour of camel case ones. Please use `paymentRefunds` instead of `payments_refunds`, `orderShipments` instead of `orders_shipments`, et cetera:
```diff
- mollieClient.customers_subscriptions.get('sub_PCN3U3U27K', { customerId: 'cst_pzhEvnttJ2' })
+ mollieClient.customerSubscriptions.get('sub_PCN3U3U27K', { customerId: 'cst_pzhEvnttJ2' });
```

## Removed endpoint aliases (e.g. `payments.delete`)

Endpoint aliases have been removed. Please use `mollieClient.payments.cancel` instead of `mollieClient.payments.delete`, `mollieClient.refunds.page` instead of `mollieClient.refunds.list`, et cetera:
```diff
- mollieClient.subscriptions.list({ limit: 10 })
+ mollieClient.subscriptions.page({ limit: 10 })
```

## Removed predictable helper functions

Helper functions which do not provide a significantly simpler API have been removed:
```diff
- if (payment.isOpen()) {
+ if (payment.status == PaymentStatus.open) {
```
```diff
- if (payment.hasSequenceTypeFirst()) {
+ if (payment.sequenceType == SequenceType.first)
```

## Removed functions from `ApiError`

`getMessage`, `getField`, `getStatusCode` have been removed from `ApiError`. Please use `message`, `field`, and `statusCode` instead:
```diff
  try {
    const payment = await mollieClient.payments.get(…);
  } catch (error) {
-   console.warn(error.getMessage())
+   console.warn(error.message)
  }
```

## Removed Giropay and SOFORT

[Giropay](https://help.mollie.com/hc/en-us/articles/19745480480786-Giropay-Depreciation-FAQ) and [SOFORT](https://help.mollie.com/hc/en-us/articles/20904206772626-SOFORT-Deprecation-30-September-2024) have been deprecated, and removed from the client. Please update your code accordingly.

## Changed type of `metadata` (from `any`) to `unknown`

The `metadata` property is now typed as `unknown`. Please check its type at runtime, or use `as any` to opt in to type issues.

This is part of a larger movement in the TypeScript universe to reduce usage of the `any` type. See [microsoft/TypeScript#41016](https://github.com/microsoft/TypeScript/issues/41016).

## Removed `count`

The `count` property has been removed from pages, please use `length` instead:
```diff
- mollieClient.payments.page({ limit: 10 }).count
+ mollieClient.payments.page({ limit: 10 }).length
```

## Changed return type of list functions

The return type of list functions now reflects whether the underlying endpoint is paginated. The following functions return (plain) arrays:

 * `mollieClient.methods.list`
 * `mollieClient.orderShipments.list`
 * `mollieClient.permissions.list`

The following functions return iterators:

 * `customer.getMandates()`
 * `customer.getSubscriptions()`
 * `customer.getPayments()`
 * `order.getRefunds()`
 * `payment.getRefunds()`
 * `payment.getChargebacks()`
 * `payment.getCaptures()`
 * `profile.getChargebacks()`
 * `profile.getPayments()`
 * `profile.getRefunds()`
 * `subscription.getPayments()`

## Removed `toPlainObject`

`toPlainObject` has been removed. The appropriate alternative depends on your motivation to use the now-removed function.

## Removed Axios-specific options

Previously, it was possible to provide options to Axios through `createMollieClient`. The client no longer uses Axios. The following options no longer have any effect:

 * `adapter`
 * `proxy`
 * `socketPath`
 * `timeout`

Please [create an issue](https://github.com/mollie/mollie-api-node/issues/new) if you rely on such an option.

## Note: network error messages may have changed

It is possible that network issues produce different values for the `message` property of the produced errors compared to previous versions of the client. If your integration relies on `message`, please update your error handling code accordingly.

# Migrating from v2.×.× to v3.0.0

## Initialization

The factory function which creates the client is now "named".

Initializing in the style of CommonJS should now be done like so:
```diff
- const mollieClient = require('@mollie/api-client')({
+ const mollieClient = require('@mollie/api-client').createMollieClient({
    apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM',
  })
```

Or like so:

```diff
- const mollieClient = require('@mollie/api-client')({
+ const { createMollieClient } = require('@mollie/api-client');
+
+ const mollieClient = createMollieClient({
    apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM',
  });
```

This alternative using JavaScript modules also works:

```javascript
import createMollieClient from '@mollie/api-client';

const mollieClient = createMollieClient({
  apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM',
});
```

### Rationale

The need for this change comes from the additional objects now available in the package, such as the `PaymentMethod` enum:

```javascript
const { createMollieClient, PaymentMethod } = require('@mollie/api-client');

const mollieClient = createMollieClient({
  apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM',
});

mollieClient.payments.create({
  amount: {
    currency: 'EUR',
    value: '10.00',
  },
  description: 'Order #478',
  method: PaymentMethod.ideal
});
```

The alternative using JavaScript modules would be to replace the first line of the example above with this:

```javascript
import createMollieClient, { PaymentMethod } from '@mollie/api-client';
```

# Migrating from v1.×.× to v2.0.0

Version 2.x of the Node client uses the v2 Mollie API. Please refer to  [Migrating from v1 to v2](https://docs.mollie.com/migrating-v1-to-v2) for a general overview of the changes introduced by the new Mollie API.

Code examples can be found in the [`/examples`](https://github.com/mollie/mollie-api-node/tree/master/examples) folder.

## Package renamed
We've renamed our NPM package to `@mollie/api-client`. To install:

```sh
npm install @mollie/api-client --save
```

Or using [yarn](https://yarnpkg.com/):

```sh
yarn add @mollie/api-client
```


## Initialization change

Changed the initialization of the client to a factory method:

```diff
-var Mollie = require('mollie-api-node');
-var mollie = new Mollie.API.Client;
-mollie.setApiKey("test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM");
+const mollie = require('@mollie/api-client')({
+  apiKey: 'test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM',
+});
```

## Callback signature change

```diff
-(response) => {
-  if (response.error) {
-    throw response.error;
+(error, response) => {
+  if (error) {
+    throw error;
  }
  return response;
}
```

## Amount changes

All amounts in the API are passed as a map containing both a currency and a value property. You need to pass both when creating a new payment:


```diff
mollie.payments.create({
-  amount: 10.00
+  amount: {
+    "currency": "EUR",
+    "value": "10.00"
+  }
});

```

This example object describes an amount of €10.00.

## Combined date and time fields

Formatting of fields such as `createdAt` has been updated to be strictly compliant to ISO-8601 formatting. Example value: `2018-03-05T12:30:10+00:00`.

## Status changes

- The statuses `paidout`, `refunded` and `charged_back` have been removed.
- The status `cancelled` has been renamed to `canceled` (US English spelling). You can use helper methods on the Payment model to check for the payment status.

We introduced the following methods on a Payment model:

- `payment.isOpen()`
- `payment.isPaid()`
- `payment.isCanceled()`
- `payment.isExpired()`
- `payment.isRefundable()`

## Recurring payment changes

`recurringType` has been renamed to `sequenceType`. This field is now always present. A one-off payment (not the start of a recurring sequence and not a recurring payment) will have the value `oneoff`.

```javascript
mollie.customers_payments
  .create({
    amount: { value: '0.01', currency: 'EUR' },
    description: 'A first payment for recurring',
    redirectUrl: `https://example.org/redirect`,
    webhookUrl: `http://example.org/webhook`,
    sequenceType: 'first',
    customerId: 'cst_2mVdVmuVq2',
  });
```

## Deprecated `withParent`

We decided to deprecate `withParent` in favor of passing the parent ID in the `params`. That means we will move from:

```javascript
mollie.customers.all(function(err, customers) {
  customers.forEach(function(err, customer) {
    if (err) {
      // handle error
    }
    mollie.customers_payments.withParent(customer).all(function(err, payments) {
      if (err) {
        // handle error
      }
      console.log(payments);
    });
  });
});
```

to:

```javascript
mollie.customers.all()
  .then(customers => (
    customers.forEach(customer =>
      mollie.customers_payments.all({
        customerId: customer.id,
      })
        .then(payments => console.log(payments))
        .catch(err => console.error(err))
    )
  ))
  .catch(err => console.error(err));
```

## Pagination

We improved support for accessing large sets of objects. We're now using cursor-based pagination instead of pagination based on counts and offsets.

```javascript
mollie.payments
  .all({
    limit: 15,
    from: 'tr_8WhJKGmgBy'
  })
  .then((payments) => {
    // Returns the list of 15 payments, starting with payment `tr_8WhJKGmgBy`
  });
```
