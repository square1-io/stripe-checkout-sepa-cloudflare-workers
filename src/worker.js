const Stripe = require("stripe");

export default {
  fetch: handleRequest
};

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);

  // Don't burn checkout sessions on browsers looking for a favicon automatically
  if (url.pathname == '/favicon.ico') {
    return;
  }
  if (url.searchParams.get('success') === '1') {
    return showSuccess();
  } else if (url.searchParams.get('retry') === '1') {
    return showRetry(url);
  } else {
    return redirectToCheckout(env.STRIPE_API_KEY, url);
  }
};

async function showSuccess() {
  const page_title = 'Thank you!';
  const heading = 'Details saved successfully!';
  const message = 'Thank you - your payment details have been submitted successfully! We\'ll be in touch soon.';

  const content = '<!doctype html><html><head><title>'+page_title+'</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head>'
    +'<body><div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true"><div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div><div class="fixed inset-0 z-10 overflow-y-auto"><div class="flex min-h-full justify-center p-4 text-center items-center sm:p-0"><div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-sm sm:p-6"><div><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"><svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>'
    +'<div class="mt-3 text-center sm:mt-5"><h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">'+heading+'</h3><div class="mt-2"><p class="text-sm text-gray-500">'+message+'</p></div></div></div></div></div></div></div></body></html>';

  return new Response(content, {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function showRetry(url) {
  const page_title = 'Please try again';
  const heading = 'Sign up unsuccessful';
  const message = 'Please click the button below to try again.';
  const button_text = 'Try again';
  const try_again_link = `${url.origin}${url.pathname}`;

  const content = '<!doctype html><html><head><title>'+page_title+'</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.tailwindcss.com"></script></head>'
    +'<body><div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true"><div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div><div class="fixed inset-0 z-10 overflow-y-auto"><div class="flex min-h-full justify-center p-4 text-center items-center sm:p-0"><div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-sm sm:p-6"><div><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path></svg></div>'
    +'<div class="mt-3 text-center sm:mt-5"><h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">'+heading+'</h3><div class="mt-2"><p class="text-sm text-gray-500">'+message+'</p><div class="mt-5 sm:mt-4 justify-center"><a href="'+try_again_link+'"><button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">'+button_text+'</button></a></div></div></div></div></div></div></div></div></body></html>';

  return new Response(content, {
    headers: { 'Content-Type': 'text/html' },
  });
}

async function redirectToCheckout(key, url) {
  const stripe = Stripe(key, {
    httpClient: Stripe.createFetchHttpClient()
  });

  // Get our current path
  const baseUrl = `${url.origin}${url.pathname}`;

  /**
   * Create a checkout session to set up our payment method
   */
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['sepa_debit'],

    mode: 'setup',
    // Ensure that a customer record is created. This is key! This is what
    // allows us to later charge this payment method.
    customer_creation: 'always',
    success_url: baseUrl+'?success=1',
    cancel_url: baseUrl+'?retry=1'
  });

  return Response.redirect(session.url, 303);
};
