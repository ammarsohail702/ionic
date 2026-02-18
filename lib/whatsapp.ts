import { siteConfig } from '@/config/settings'

interface OrderSummary {
  shirtOrder: { size: string; quantity: number }[]
  pantsOrder: { size: string; quantity: number }[]
  deliveryAddress: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postcode: string
    country: string
    notes: string
  }
  shirtDetails?: {
    primaryColor: string
    pattern: string
    collarType: string
    sleeveType: string
    teamName?: string
    number?: string
  }
  pantsDetails?: {
    primaryColor: string
    pattern: string
    pantsType: string
  }
}

export function generateWhatsAppMessage(order: OrderSummary): string {
  const totalShirts = order.shirtOrder.reduce((sum, o) => sum + o.quantity, 0)
  const totalPants = order.pantsOrder.reduce((sum, o) => sum + o.quantity, 0)

  let message = `🏆 *NEW ORDER - IONIC UNIFORMS*\n\n`
  message += `📋 *Order ID:* ORD-${Date.now().toString(36).toUpperCase()}\n\n`

  // Customer info
  message += `👤 *Customer Details:*\n`
  message += `Name: ${order.deliveryAddress.name}\n`
  message += `Email: ${order.deliveryAddress.email}\n`
  message += `Phone: ${order.deliveryAddress.phone}\n`
  message += `Address: ${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postcode}, ${order.deliveryAddress.country}\n`

  if (order.deliveryAddress.notes) {
    message += `Notes: ${order.deliveryAddress.notes}\n`
  }

  message += `\n`

  // Shirt order
  if (totalShirts > 0) {
    message += `👕 *SHIRTS (${totalShirts} total):*\n`
    order.shirtOrder.forEach((o) => {
      message += `  ${o.size}: ${o.quantity}\n`
    })
    if (order.shirtDetails) {
      message += `  Color: ${order.shirtDetails.primaryColor}\n`
      message += `  Pattern: ${order.shirtDetails.pattern}\n`
      message += `  Collar: ${order.shirtDetails.collarType}\n`
      message += `  Sleeves: ${order.shirtDetails.sleeveType}\n`
      if (order.shirtDetails.teamName) {
        message += `  Team Name: ${order.shirtDetails.teamName}\n`
      }
      if (order.shirtDetails.number) {
        message += `  Number: ${order.shirtDetails.number}\n`
      }
    }
    message += `\n`
  }

  // Pants order
  if (totalPants > 0) {
    message += `👖 *PANTS (${totalPants} total):*\n`
    order.pantsOrder.forEach((o) => {
      message += `  ${o.size}: ${o.quantity}\n`
    })
    if (order.pantsDetails) {
      message += `  Color: ${order.pantsDetails.primaryColor}\n`
      message += `  Pattern: ${order.pantsDetails.pattern}\n`
      message += `  Type: ${order.pantsDetails.pantsType}\n`
    }
    message += `\n`
  }

  message += `📎 *PDF with full design details attached separately*\n\n`
  message += `Thank you for choosing Ionic! 🙏`

  return message
}

export function openWhatsApp(message: string): void {
  // Remove the + from the phone number for WhatsApp URL
  const phone = siteConfig.whatsappNumber.replace(/[^0-9]/g, '')
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
  window.open(whatsappUrl, '_blank')
}

export function validateOrder(order: OrderSummary): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const totalShirts = order.shirtOrder.reduce((sum, o) => sum + o.quantity, 0)
  const totalPants = order.pantsOrder.reduce((sum, o) => sum + o.quantity, 0)

  if (totalShirts === 0 && totalPants === 0) {
    errors.push('Please add at least one item to your order')
  }

  if (!order.deliveryAddress.name.trim()) {
    errors.push('Name is required')
  }

  if (!order.deliveryAddress.email.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.deliveryAddress.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!order.deliveryAddress.phone.trim()) {
    errors.push('Phone number is required')
  }

  if (!order.deliveryAddress.address.trim()) {
    errors.push('Address is required')
  }

  if (!order.deliveryAddress.city.trim()) {
    errors.push('City is required')
  }

  if (!order.deliveryAddress.postcode.trim()) {
    errors.push('Postcode is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
