import QRCode from 'qrcode'

export const generateQR = async (passCode) => {
  try {
    const PassCodeString = String(passCode)
    const url = await QRCode.toDataURL(PassCodeString)
    return url
  } catch (err) {
    throw new CustomError(
      statusCodes?.badRequest,
      Message?.notCreated,
      errorCodes?.bad_request
    )
  }
}
