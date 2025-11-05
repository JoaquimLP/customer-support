import { Pool } from 'pg';

const databaseName = 'customer-chat';

const baseDbConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres'
};

const adminPool = new Pool({ ...baseDbConfig, database: databaseName });

async function getCustomerInfo(email) {
    const customer = await getCustomer(email);
    console.log(customer);

    if (!customer) {
        console.warn("Cliente não encontrado");
        return null; // ou você pode lançar um erro, dependendo do fluxo
    }

    const purchases = await getCustomerPurchases(customer);

    return {
        customer,
        purchases
    };
}

function getDaysSincePurchase(purchase){
    const today = new Date();
    const purchaseDate = new Date(purchase.date);
    const diffInMilis = today - purchaseDate;

    return Number.isNaN(diffInMilis) ? 0 : Math.floor(diffInMilis / 1000 / 60 / 60 / 24);
}

async function getCustomer(email) {
    console.log(email);

    const result = await adminPool.query(
        'SELECT * FROM customers WHERE email = $1',
        [email]
    );

    return result.rows[0];
}

async function getCustomerPurchases(customer) {
    const purchases =  (await adminPool.query(
        'SELECT * FROM purchases WHERE customer_id = $1',
        [customer.id]
    )).rows;

    console.log(purchases);
    
   
    let purchasesString = "";

    for(let purchase of purchases){
        purchasesString += `
        - ${purchase.product}:
            - Preço: ${purchase.price}
            - Status: ${purchase.status}
            - Dias desde a compra: ${getDaysSincePurchase(purchase)} 
        `
    }

    return purchasesString;
}

export { getCustomerInfo }
