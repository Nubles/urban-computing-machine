const ge = {
    // Cache to store prices and avoid spamming the API
    priceCache: new Map(),
    // How long to keep a price in the cache (in milliseconds)
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes

    /**
     * Fetches the price for a single item from the Weird Gloop API.
     * @param {string} itemName The name of the item to fetch the price for.
     * @returns {Promise<number|null>} The price of the item, or null if not found.
     */
    async getPrice(itemName) {
        // Check cache first
        const cachedItem = this.priceCache.get(itemName);
        if (cachedItem && Date.now() - cachedItem.timestamp < this.CACHE_DURATION) {
            console.log(`Returning cached price for ${itemName}: ${cachedItem.price}`);
            return cachedItem.price;
        }

        console.log(`Fetching price for ${itemName}...`);
        try {
            // The Weird Gloop API endpoint for the latest price data
            const response = await fetch(`https://api.weirdgloop.org/exchange/history/rs/latest?name=${encodeURIComponent(itemName)}`);

            if (!response.ok) {
                console.error(`Failed to fetch price for ${itemName}. Status: ${response.status}`);
                return null;
            }

            const data = await response.json();

            // The API returns an object where the key is the item name.
            if (data && data[itemName]) {
                const price = data[itemName].price;

                // Store in cache
                this.priceCache.set(itemName, { price: price, timestamp: Date.now() });

                console.log(`Fetched price for ${itemName}: ${price}`);
                return price;
            } else {
                console.warn(`Price not found for item: ${itemName}`);
                return null;
            }
        } catch (error) {
            console.error(`An error occurred while fetching the price for ${itemName}:`, error);
            return null;
        }
    }
};

// We can export this object if we use modules later
// export default ge;