import QRCode from 'qrcode'

export const generateQR = async (passCode) => {
  try {
    const PassCodeString = String(passCode)
    const url = await QRCode.toDataURL(PassCodeString)
    console.log(url)
  } catch (err) {
    console.error('Error generating QR Code:', err)
  }
}
