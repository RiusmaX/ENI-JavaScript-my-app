const { parentPort, workerData } = require('worker_threads')
const HID = require('node-hid')

const { vendorId, productId } = workerData

try {
  const device = new HID.HID(vendorId, productId)

  parentPort.postMessage(`Connected to device ${vendorId}:${productId}`)

  device.on('data', (data) => {
    // Decode device data
    const hex = data.toString('hex')
    parentPort.postMessage(`Received data : ${hex}`)
  })

  device.on('error', (error) => {
    parentPort.postMessage(`HID Error : ${error.message}`)
  })
} catch (error) {
  parentPort.postMessage(`Device connection error : ${error.message}`)
}
