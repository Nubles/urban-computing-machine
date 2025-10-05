const recipes = [
    {
        name: "Prayer Potion",
        level: 38,
        xp: 87.5,
        product: "Prayer potion (4)",
        ingredients: [
            { name: "Clean ranarr", quantity: 1 },
            { name: "Snape grass", quantity: 1 }
        ],
        notes: "Requires an unfinished ranarr potion."
    },
    {
        name: "Super Attack Potion",
        level: 45,
        xp: 100,
        product: "Super attack (4)",
        ingredients: [
            { name: "Clean irit", quantity: 1 },
            { name: "Eye of newt", quantity: 1 }
        ],
        notes: "Requires an unfinished irit potion."
    },
    {
        name: "Super Strength Potion",
        level: 55,
        xp: 125,
        product: "Super strength (4)",
        ingredients: [
            { name: "Clean kwuarm", quantity: 1 },
            { name: "Limpwurt root", quantity: 1 }
        ],
        notes: "Requires an unfinished kwuarm potion."
    },
    {
        name: "Super Defence",
        level: 66,
        xp: 150,
        product: "Super defence (4)",
        ingredients: [
            { name: "Clean cadantine", quantity: 1 },
            { name: "White berries", quantity: 1 }
        ],
        notes: "Requires an unfinished cadantine potion."
    },
    {
        name: "Ranging Potion",
        level: 72,
        xp: 162.5,
        product: "Ranging potion (4)",
        ingredients: [
            { name: "Clean dwarf weed", quantity: 1 },
            { name: "Wine of Zamorak", quantity: 1 }
        ],
        notes: "Requires an unfinished dwarf weed potion."
    },
    {
        name: "Magic Potion",
        level: 76,
        xp: 172.5,
        product: "Magic potion (4)",
        ingredients: [
            { name: "Clean lantadyme", quantity: 1 },
            { name: "Potato cactus", quantity: 1 }
        ],
        notes: "Requires an unfinished lantadyme potion."
    }
];

// We can export this data if we use modules later
// export default recipes;