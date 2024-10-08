async function webAPI_getMaths(host, query, showResult) {
    return new Promise(resolve => {
        $.ajax({
            url: host + query,
            success: (data) => {
                console.log('Success:', data);
                showResult(data, true);
                resolve(data);
            },
            error: (xhr) => {
                console.log('Error:', xhr);
                showResult(xhr, false);
                resolve(null);
            }
        });
    });
}

