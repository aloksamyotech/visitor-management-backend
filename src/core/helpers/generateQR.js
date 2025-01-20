import QRCode from 'qrcode'
import { errorCodes, Message, statusCodes } from '../common/constant.js'
import CustomError from '../../utils/exception.js'

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
