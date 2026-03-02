import jsPDF from 'jspdf'
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
  // Design images
  shirtFrontImage?: string
  shirtBackImage?: string
  pantsFrontImage?: string
  pantsBackImage?: string
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
  pdf.text('AICONZ', 20, 25)
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

  // Add design images on a new page
  const hasShirtImages = orderData.shirtFrontImage || orderData.shirtBackImage
  const hasPantsImages = orderData.pantsFrontImage || orderData.pantsBackImage

  if (hasShirtImages || hasPantsImages) {
    pdf.addPage()
    yPos = 20

    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Design Preview', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Shirt images
    if (hasShirtImages) {
      pdf.setFontSize(14)
      pdf.text('Shirt Design', 20, yPos)
      yPos += 10

      const imgWidth = 80
      const imgHeight = 80

      if (orderData.shirtFrontImage) {
        try {
          pdf.addImage(orderData.shirtFrontImage, 'PNG', 20, yPos, imgWidth, imgHeight)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Front View', 20 + imgWidth / 2, yPos + imgHeight + 5, { align: 'center' })
        } catch (e) {
          console.warn('Failed to add front shirt image to PDF')
        }
      }

      if (orderData.shirtBackImage) {
        try {
          pdf.addImage(orderData.shirtBackImage, 'PNG', 110, yPos, imgWidth, imgHeight)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Back View', 110 + imgWidth / 2, yPos + imgHeight + 5, { align: 'center' })
        } catch (e) {
          console.warn('Failed to add back shirt image to PDF')
        }
      }

      yPos += imgHeight + 20
    }

    // Pants images
    if (hasPantsImages) {
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Pants Design', 20, yPos)
      yPos += 10

      const imgWidth = 80
      const imgHeight = 80

      if (orderData.pantsFrontImage) {
        try {
          pdf.addImage(orderData.pantsFrontImage, 'PNG', 20, yPos, imgWidth, imgHeight)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Front View', 20 + imgWidth / 2, yPos + imgHeight + 5, { align: 'center' })
        } catch (e) {
          console.warn('Failed to add front pants image to PDF')
        }
      }

      if (orderData.pantsBackImage) {
        try {
          pdf.addImage(orderData.pantsBackImage, 'PNG', 110, yPos, imgWidth, imgHeight)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.text('Back View', 110 + imgWidth / 2, yPos + imgHeight + 5, { align: 'center' })
        } catch (e) {
          console.warn('Failed to add back pants image to PDF')
        }
      }
    }
  }

  // Footer on last page
  pdf.setFillColor(30, 30, 40)
  pdf.rect(0, pdf.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8)
  pdf.text('Aiconz Custom Uniforms | Contact: ' + siteConfig.whatsappNumber, 20, pdf.internal.pageSize.getHeight() - 10)
  pdf.text('Thank you for your order!', pageWidth - 50, pdf.internal.pageSize.getHeight() - 10)

  return pdf.output('blob')
}

export async function captureCanvasImage(): Promise<string | null> {
  // Find the WebGL canvas inside the canvas container
  const container = document.querySelector('.canvas-container')
  if (!container) return null

  const canvas = container.querySelector('canvas') as HTMLCanvasElement
  if (!canvas) return null

  try {
    return canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Error capturing canvas:', error)
    return null
  }
}

// Capture design images for both front and back views
export async function captureDesignImages(
  setViewAngle: (angle: 'front' | 'back' | 'free') => void
): Promise<{ front: string | null; back: string | null }> {
  const container = document.querySelector('.canvas-container')
  if (!container) return { front: null, back: null }

  const canvas = container.querySelector('canvas') as HTMLCanvasElement
  if (!canvas) return { front: null, back: null }

  // Capture front view
  setViewAngle('front')
  await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for render
  let frontImage: string | null = null
  try {
    frontImage = canvas.toDataURL('image/png')
  } catch (e) {
    console.warn('Failed to capture front view')
  }

  // Capture back view
  setViewAngle('back')
  await new Promise((resolve) => setTimeout(resolve, 500)) // Wait for render
  let backImage: string | null = null
  try {
    backImage = canvas.toDataURL('image/png')
  } catch (e) {
    console.warn('Failed to capture back view')
  }

  // Return to front view
  setViewAngle('front')

  return { front: frontImage, back: backImage }
}

// Download image as file
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
