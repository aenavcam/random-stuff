/* 
Basket calculator 

Reads from commandline a list of items separated by commas.
Eg: node basket.njs Apple,Apple,Orange,Papaya,Garlic,Orange,Papaya,Papaya,Papaya
*/

// calculation for standard items
const PRICE_STANDARD = function (price, units) {
    return price * units
}
// calculation for 3x2 items
const PRICE_3X2 = function (price, units) {
    return Math.floor(units/3)*price*2 + units%3*price
}

// Product definition, acepts a custom calculation of total price
class Product {
    constructor(name, price, fn_calculation = PRICE_STANDARD) {
        this.name = name
        this.price = price
        this.calculation = fn_calculation
    }
    getTotal(units) {
        return this.calculation(this.price, units)
    }
}

// Basket definition
class Basket {
    constructor() {
        this.lines = new Map()
    }
    addItem(item) {
        let line = this.lines.get(item.name)
        if (line) {
            line.quantity++
        } else {
            this.lines.set(item.name, { product: item, quantity: 1 })
        }
    }
    printReceipt() {
        let basket_total = 0
        for (let line of this.lines.values()) {
            let line_total = line.product.getTotal(line.quantity)
            basket_total += line_total
            console.log(`${line.quantity} ${line.product.name} ${line_total}`)
        }
        console.log(`TOTAL: ${basket_total}`)
    }
}

// Create catalog of products
let catalog = new Map()
catalog.set("Apple", new Product("Apple", 0.25))
catalog.set("Orange", new Product("Orange", 0.30))
catalog.set("Garlic", new Product("Garlic", 0.15))
catalog.set("Papaya", new Product("Papaya", 0.50, PRICE_3X2))

let basket = new Basket()


// TODO: proper arguments/error handling
let input = process.argv[2]
if (!input){
    console.log("Example usage: node basket.njs Apple,Apple,Orange,Papaya,Garlic,Orange,Papaya,Papaya,Papaya")
    process.exit()
}

// main
for (item of input.split(",")) {
    let product = catalog.get(item)
    if (!product) {
        console.log(`Error: ${item} is not a valid product`)
    } else {
        basket.addItem(product)
    }
}

basket.printReceipt()
