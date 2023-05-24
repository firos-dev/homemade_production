const invoiceGenerator = (order: any) => {
  let itemTotal: any = 0,
    commission: any = 0,
    deliveryCharge: any = 0,
    discount: any = 0,
    offer: any = 0,
    taxes: any = 0,
    deductions: any = 0,
    grandTotal: any = 0;

  order.items.map((item: any) => {
    itemTotal += item.price;

    if (order.chef) {
      let commissionPercentage = order.chef.commission;
      let c = (item.price * commissionPercentage) / 100;
      commission += c;
    }
  });

  if (order.delivery_partner) {
    const d_charge = order.delivery_partner.delivery_charge;
    deliveryCharge += order.distance * d_charge;
  }

  deductions = offer + discount;

  grandTotal = itemTotal + deliveryCharge;
  grandTotal = grandTotal - discount - offer;
  grandTotal = grandTotal + taxes;

  itemTotal = itemTotal.toFixed(2);
  commission = commission.toFixed(2);
  deliveryCharge = deliveryCharge.toFixed(2);
  discount = discount.toFixed(2);
  offer = offer.toFixed(2);
  taxes = taxes.toFixed(2);
  grandTotal = grandTotal.toFixed(2);
  deductions = deductions.toFixed(2);

  return {
    itemTotal,
    commission,
    deliveryCharge,
    discount,
    offer,
    taxes,
    grandTotal,
    deductions,
  };
};

export default invoiceGenerator;
