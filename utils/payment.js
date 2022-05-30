require('dotenv').config()


const getInvoice = (id, invoiceTitle, InvoiceDescription, amount) => {
  const invoice = {
    chat_id: id, 
    provider_token: process.env.PROVIDER_TOKEN,
    start_parameter: 'get_access', 
    title: invoiceTitle,
    description: InvoiceDescription, 
    currency: 'USD',
    prices: [{ label: invoiceTitle, amount: amount * 100 }], 
    payload: { 
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN 
    }
  }
  return invoice
}


module.exports = {
    getInvoice
}