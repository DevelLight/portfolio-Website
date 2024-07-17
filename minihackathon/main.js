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
    const apiUrl = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
    showLoadingSpinner();

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                displayProductInfo(data.product);
                JsBarcode("#barcode", barcode, {
                    width:2,
                    height:40,
                });
            } else {
                document.getElementById('product-info').innerHTML = "Produkt nicht gefunden.";
            }
        })
        .catch(error => {
            console.error('Error fetching product info:', error);
            document.getElementById('product-info').innerHTML = "Fehler beim Abrufen der Produktinformationen.";
        })
        .finally(() => hideLoadingSpinner());
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').classList.remove('hidden');
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').classList.add('hidden');
}


function displayProductInfo(product) {
    document.getElementById('barcode').style.display = '';
    document.getElementById('ingredients').style.display = "";
    const productInfoDiv = document.getElementById('product-info');
    const productInfoNr = document.getElementById('product-info-nr')
    const vegan = product.ingredients_text.includes("vegan") || product.ingredients_analysis_tags.includes("en:vegan") || product.ingredients_text.includes("egg") || product.ingredients_text.includes("gelatin") || product.ingredients_text.includes("lard");
    const vegetarian = product.ingredients_text.includes("vegetarian")  || product.ingredients_analysis_tags.includes("en:vegetarian") || product.ingredients_text.includes("egg") || product.ingredients_text.includes("gelatin") || product.ingredients_text.includes("lard");
    const productImage = product.image_url || 'undraw.png';
    productInfoDiv.innerHTML = `
        <h2 class="text-xl font-bold">${product.product_name}</h2>
        <p><strong>Marke:</strong> ${product.brands}</p>
         <img src="${productImage}" alt="${product.product_name}" class="max-w-xs mx-auto py-2" width="100px">

          <table class="min-w-full bg-white">
                    <thead>
                        <tr class="text-xs">
                            <th class="py-2">Nutrition facts</th>
                            <th class="py-2">100 g / 100 ml</th>
                            <th class="py-2">per serving (1 = 500 ml)</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        <tr>
                            <td class="border px-3 py-1">Energy</td>
                            <td class="border px-3 py-1">${product.nutriments['energy-kj']} kj (${product.nutriments['energy-kcal']} kcal)</td>
                            <td class="border px-3 py-1">${product.nutriments['energy-kj_serving']} kj (${product.nutriments['energy-kcal_serving']} kcal)</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Fat</td>
                            <td class="border px-3 py-1">${product.nutriments['fat']} g</td>
                            <td class="border px-3 py-1">${product.nutriments['fat_serving']} g</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Saturated fat</td>
                            <td class="border px-3 py-1">${product.nutriments['saturated-fat'] || '?'}</td>
                            <td class="border px-3 py-1">${product.nutriments['saturated-fat_serving'] || '?'}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Carbohydrates</td>
                            <td class="border px-3 py-1">${product.nutriments['carbohydrates']} g</td>
                            <td class="border px-3 py-1">${product.nutriments['carbohydrates_serving']} g</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Sugars</td>
                            <td class="border px-3 py-1">${product.nutriments['sugars']} g</td>
                            <td class="border px-3 py-1">${product.nutriments['sugars_serving']} g</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Fiber</td>
                            <td class="border px-3 py-1">${product.nutriments['fiber'] || '?'}</td>
                            <td class="border px-3 py-1">${product.nutriments['fiber_serving'] || '?'}</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Proteins</td>
                            <td class="border px-3 py-1">${product.nutriments['proteins']} g</td>
                            <td class="border px-3 py-1">${product.nutriments['proteins_serving']} g</td>
                        </tr>
                        <tr>
                            <td class="border px-3 py-1">Salt</td>
                            <td class="border px-3 py-1">${product.nutriments['salt'] || '?'}</td>
                            <td class="border px-3 py-1">${product.nutriments['salt_serving'] || '?'}</td>
                        </tr>
                    </tbody>
                </table>
            <div class="my-2">
                       <span class="${vegan ? 'text-green-500' : 'text-red-500'}">
                ${vegan ? '✔️ Vegan' : '❌ Not Vegan' }
            </span>
            <span class="${vegetarian ?  'text-green-500' : 'text-red-500' } ml-4">
                ${vegetarian ? '✔️ Vegetarian' : '❌ Not Vegetarian'}
            </span>
             </div>
    `;

    productInfoNr.innerHTML = `
        <p> ${product.ingredients_text_en || product.ingredients_text}</p>
    `;
}

document.getElementById('close-button').addEventListener('click', () => {
    document.getElementById('product-info').innerHTML = "";
    document.getElementById('barcode-input').value = "";
    document.getElementById('qr-reader').style.display = 'block';
    document.getElementById('barcode-form').style.display = 'block';
    document.getElementById('barcode').style.display = 'block';
    startScanner();
});


function startScanner() {
    html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { 
            fps: 10, 
            qrbox: { width: 250, height: 250 } 
        });
    html5QrcodeScanner.render(onScanSuccess);
    document.getElementById('barcode').style.display = 'none';
    document.getElementById('ingredients').style.display = "none";
}

function redirectToGitHub() {
    window.location.href = 'https://github.com/DevelLight/website-Hackathon/tree/main/minihackathon';
}



startScanner();
