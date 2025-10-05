// Check if the alt1 API is available
if (window.alt1) {
    // Tells alt1 that this app is compatible with api version 1
    alt1.identifyApp("appconfig.json");
} else {
    // Error message if alt1 is not found
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Could not find Alt1! Please run this page in the Alt1 browser.";
}

// Get the button and results elements
const scanButton = document.getElementById("scan-bank-btn");
const resultsDiv = document.getElementById("results");

// Helper function to format names (e.g., "Prayer potion (4)" -> "prayer_potion_4")
const formatNameForImage = (name) => name.toLowerCase().replace(/ /g, '_').replace('(', '').replace(')', '');

// Pre-load all necessary item images into memory
const requiredImages = {};
function loadItemImages() {
    console.log("Loading required item images...");
    const allItems = new Set();
    // Gather all unique ingredients and products from recipes
    recipes.forEach(recipe => {
        allItems.add(recipe.product);
        recipe.ingredients.forEach(ing => allItems.add(ing.name));
    });

    // Load each unique image
    allItems.forEach(itemName => {
        const formattedName = formatNameForImage(itemName);
        const imgPath = `assets/images/${formattedName}.gif`;

        // a1lib.readImage gets the image data from a local file
        const imgData = a1lib.readImage(imgPath);
        if (imgData) {
            requiredImages[itemName] = imgData;
            console.log(`Successfully loaded image for: ${itemName}`);
        } else {
            console.error(`Failed to load image for: ${itemName} at path ${imgPath}`);
        }
    });
    console.log("Image loading complete.");
}


// Main function to run the calculation
async function runScanAndCalculate() {
    if (!window.alt1) {
        resultsDiv.innerHTML = "Alt1 not found. Please run in the Alt1 browser.";
        return;
    }

    resultsDiv.innerHTML = "Scanning your screen for ingredients... Please make sure your bank is open and visible.";
    await new Promise(resolve => setTimeout(resolve, 500)); // Short delay for UI update

    // 1. Scan for items
    const ownedItems = new Set();
    for (const [itemName, imageData] of Object.entries(requiredImages)) {
        // a1lib.findSubImg searches the entire game screen for a given image.
        const foundPosition = a1lib.findSubImg(imageData);
        if (foundPosition.length > 0) {
            console.log(`Found ${itemName}`);
            ownedItems.add(itemName);
        }
    }

    console.log("Bank scan complete. Owned items:", ownedItems);
    resultsDiv.innerHTML = "Bank scan complete. Fetching prices...";

    // 2. Loop through recipes and calculate profit
    let profitablePotions = [];
    for (const recipe of recipes) {
        // Check if user has all ingredients
        const hasAllIngredients = recipe.ingredients.every(ingredient => ownedItems.has(ingredient.name));

        if (hasAllIngredients) {
            console.log(`User can make ${recipe.name}. Calculating profit...`);
            let ingredientCost = 0;
            let pricesFound = true;

            // Calculate total ingredient cost
            for (const ingredient of recipe.ingredients) {
                const price = await ge.getPrice(ingredient.name);
                if (price !== null) {
                    ingredientCost += price * ingredient.quantity;
                } else {
                    pricesFound = false;
                    console.warn(`Could not find price for ingredient: ${ingredient.name}`);
                    break;
                }
            }

            // Get product price
            const productPrice = await ge.getPrice(recipe.product);
            if (productPrice === null) {
                pricesFound = false;
                console.warn(`Could not find price for product: ${recipe.product}`);
            }

            if (pricesFound) {
                const profit = productPrice - ingredientCost;
                profitablePotions.push({
                    name: recipe.name,
                    profit: profit,
                    xp: recipe.xp
                });
            }
        }
    }

    // 3. Display the results
    displayResults(profitablePotions);
}

// Function to display the results in the UI
function displayResults(potions) {
    if (potions.length === 0) {
        resultsDiv.innerHTML = "Could not find any potions you can make with the items on screen. Make sure your bank is visible and the items are not placeholders.";
        return;
    }

    // Sort potions by profitability
    potions.sort((a, b) => b.profit - a.profit);

    let html = "<h3>Potions you can make:</h3><ul>";
    potions.forEach(potion => {
        const profitClass = potion.profit >= 0 ? 'profit' : 'loss';
        html += `<li>${potion.name} - <span class="${profitClass}">Profit: ${potion.profit.toLocaleString()} gp</span> - XP: ${potion.xp}</li>`;
    });
    html += "</ul>";

    resultsDiv.innerHTML = html;
}

// Add event listener to the scan button
scanButton.addEventListener("click", runScanAndCalculate);

// Initialize the app by loading images on startup
loadItemImages();