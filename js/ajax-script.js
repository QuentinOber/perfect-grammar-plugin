fetch(my_ajax_obj.ajax_url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
        action: 'my_ajax_hook',
        nonce: my_ajax_obj.nonce,
        // Include other parameters you might need
    }),
})
.then(response => response.json())
.then(data => {
    // Process the response
})
.catch((error) => {
    console.error('Error:', error);
});
