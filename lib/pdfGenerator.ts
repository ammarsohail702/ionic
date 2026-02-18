import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { siteConfig } from '@/config/settings'

interface OrderData {
  shirt: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    pattern: string
    collarType: string
    sleeveType: string
    teamName: { content: string; position: string; color: string }
    playerNumber: { number: string; showFront: boolean; showBack: boolean; color: string }
    logo: { image: string | null; position: string; scale: number }
  }
  pants: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    pattern: string
    pantsType: string
    logo: { image: string | null; position: string; scale: number }
  }
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
}

export async function generateOrderPDF(orderData: OrderData): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPos = 20

  // Header
  pdf.setFillColor(99, 102, 241) // ionic-accent
  pdf.rect(0, 0, pageWidth, 40, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('IONIC', 20, 25)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Custom Team Uniforms', 20, 33)

  // Order ID
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`
  pdf.setFontSize(10)
  pdf.text(`Order ID: ${orderId}`, pageWidth - 60, 25)
  pdf.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 60, 32)

  yPos = 55

  // Customer Details
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Customer Details', 20, yPos)
  yPos += 8

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const customerDetails = [
    `Name: ${orderData.deliveryAddress.name}`,
    `Email: ${orderData.deliveryAddress.email}`,
    `Phone: ${orderData.deliveryAddress.phone}`,
    `Address: ${orderData.deliveryAddress.address}`,
    `${orderData.deliveryAddress.city}, ${orderData.deliveryAddress.postcode}`,
    `${orderData.deliveryAddress.country}`,
  ]
  customerDetails.forEach((line) => {
    pdf.text(line, 20, yPos)
    yPos += 5
  })

  if (orderData.deliveryAddress.notes) {
    yPos += 3
    pdf.text(`Notes: ${orderData.deliveryAddress.notes}`, 20, yPos, { maxWidth: pageWidth - 40 })
    yPos += 10
  }

  yPos += 10

  // Shirt Details
  if (orderData.shirtOrder.length > 0) {
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Shirt Customization', 20, yPos)
    yPos += 8

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    const shirtDetails = [
      `Primary Color: ${orderData.shirt.primaryColor}`,
      `Secondary Color: ${orderData.shirt.secondaryColor}`,
      `Accent Color: ${orderData.shirt.accentColor}`,
      `Pattern: ${orderData.shirt.pattern}`,
      `Collar: ${orderData.shirt.collarType}`,
      `Sleeves: ${orderData.shirt.sleeveType}`,
    ]

    if (orderData.shirt.teamName.content) {
      shirtDetails.push(`Team Name: "${orderData.shirt.teamName.content}" (${orderData.shirt.teamName.position})`)
    }
    if (orderData.shirt.playerNumber.number) {
      const numPos = []
      if (orderData.shirt.playerNumber.showFront) numPos.push('front')
      if (orderData.shirt.playerNumber.showBack) numPos.push('back')
      shirtDetails.push(`Number: ${orderData.shirt.playerNumber.number} (${numPos.join(' & ')})`)
    }
    if (orderData.shirt.logo.image) {
      shirtDetails.push(`Logo: Yes (Position: ${orderData.shirt.logo.position})`)
    }

    shirtDetails.forEach((line) => {
      pdf.text(line, 20, yPos)
      yPos += 5
    })

    // Shirt quantities table
    yPos += 5
    pdf.setFont('helvetica', 'bold')
    pdf.text('Quantities:', 20, yPos)
    yPos += 5

    pdf.setFont('helvetica', 'normal')
    const shirtSizes = orderData.shirtOrder.map((o) => `${o.size}: ${o.quantity}`).join('  |  ')
    pdf.text(shirtSizes, 20, yPos)
    yPos += 5

    const totalShirts = orderData.shirtOrder.reduce((sum, o) => sum + o.quantity, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Total Shirts: ${totalShirts}`, 20, yPos)
    yPos += 15
  }

  // Pants Details
  if (orderData.pantsOrder.length > 0) {
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Pants Customization', 20, yPos)
    yPos += 8

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    const pantsDetails = [
      `Primary Color: ${orderData.pants.primaryColor}`,
      `Secondary Color: ${orderData.pants.secondaryColor}`,
      `Accent Color: ${orderData.pants.accentColor}`,
      `Pattern: ${orderData.pants.pattern}`,
      `Type: ${orderData.pants.pantsType}`,
    ]

    if (orderData.pants.logo.image) {
      pantsDetails.push(`Logo: Yes`)
    }

    pantsDetails.forEach((line) => {
      pdf.text(line, 20, yPos)
      yPos += 5
    })

    // Pants quantities table
    yPos += 5
    pdf.setFont('helvetica', 'bold')
    pdf.text('Quantities:', 20, yPos)
    yPos += 5

    pdf.setFont('helvetica', 'normal')
    const pantsSizes = orderData.pantsOrder.map((o) => `${o.size}: ${o.quantity}`).join('  |  ')
    pdf.text(pantsSizes, 20, yPos)
    yPos += 5

    const totalPants = orderData.pantsOrder.reduce((sum, o) => sum + o.quantity, 0)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Total Pants: ${totalPants}`, 20, yPos)
    yPos += 15
  }

  // Footer
  pdf.setFillColor(30, 30, 40)
  pdf.rect(0, pdf.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.text('Ionic Custom Uniforms | Contact: ' + siteConfig.whatsappNumber, 20, pdf.internal.pageSize.getHeight() - 10)
  pdf.text('Thank you for your order!', pageWidth - 50, pdf.internal.pageSize.getHeight() - 10)

  return pdf.output('blob')
}

export async function captureCanvasImage(): Promise<string | null> {
  const canvas = document.getElementById('customizer-canvas') as HTMLCanvasElement
  if (!canvas) return null

  try {
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error capturing canvas:', error)
    return null
  }
}
