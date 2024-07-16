let html5QrcodeScanner;

function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned = ${decodedText}`, decodedResult);
    fetchProductInfo(decodedText);
    stopScanner();
}

document.getElementById('barcode-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const barcode = document.getElementById('barcode-input').value;
    if (barcode) {
        fetchProductInfo(barcode);
        stopScanner();
    }

});

function stopScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
    }
    document.getElementById('qr-reader').style.display = 'none';
    document.getElementById('barcode-form').style.display = 'none';
}

function fetchProductInfo(barcode) {
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                displayProductInfo(data.product);
            } else {
                document.getElementById('product-info').innerHTML = "Product not found.";
            }
        })
        .catch(error => {
            console.error('Error fetching product info:', error);
            document.getElementById('product-info').innerHTML = "Error when retrieving product information.";
        });
}

function displayProductInfo(product) {
    const productInfoDiv = document.getElementById('product-info');
    const vegan = product.ingredients_text.includes("vegan") || product.ingredients_analysis_tags.includes("en:vegan");
    const vegetarian = product.ingredients_text.includes("vegetarian") || product.ingredients_analysis_tags.includes("en:vegetarian");

    productInfoDiv.innerHTML = `
        <img src="${product.image_url}" alt="${product.product_name}" class="max-w-xs mx-auto pb-2" width="80px">
        <h2 class="text-xl font-bold">${product.product_name}</h2>
        <p><strong>Brand:</strong> ${product.brands}</p>
        <p><strong>Category:</strong> ${product.categories}</p>
        <p><strong>Ingredients:</strong> ${product.ingredients_text_en || product.ingredients_text}</p>
        <p><strong>Nutrient:</strong> ${product.nutriments['energy-kcal']} kcal</p>
        <div class="my-2">
            <span class="${vegan ? 'text-green-500' : 'text-red-500'}">
                ${vegan ? '✔️ Vegan' : '❌ no vegan'}
            </span>
            <span class="${vegetarian ? 'text-green-500' : 'text-red-500'} ml-4">
                ${vegetarian ? '✔️ vegetarian' : '❌ no vegetarian'}
            </span>
        </div>
      
    `;
}

document.getElementById('close-button').addEventListener('click', () => {
    document.getElementById('product-info').innerHTML = "";
    document.getElementById('barcode-input').value = "";
    document.getElementById('qr-reader').style.display = 'block';
    document.getElementById('barcode-form').style.display = 'block';
    startScanner();
});

function startScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { 
            fps: 10, 
            qrbox: { width: 250, height: 250 } 
        });
    html5QrcodeScanner.render(onScanSuccess);
}

function redirectToGitHub() {
    window.location.href = 'https://github.com/DevelLight/portfolio-Website/tree/main/minihackathon';
}

startScanner();
