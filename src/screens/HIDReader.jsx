import { useEffect, useState } from 'react'

function HIDReader () {
  const [devices, setDevices] = useState([])
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const fetchDevices = async () => {
      const _devices = await window.electronAPI.getHidDevices()
      setDevices(_devices)
    }
    fetchDevices()

    window.electronAPI.onHidData(data => {
      setLogs((prev) => [...prev.slice(-500), data])
    })
  }, [])

  const connect = async (vendorId, productId) => {
    const result = await window.electronAPI.connectToDevice(vendorId, productId)
    if (result.success) {
      setConnected(true)
      setLogs((prev) => [...prev, `🔌 Connected to ${vendorId}:${productId}`])
    }
  }

  return (
    <div className='flex flex-col w-full h-full items-center gap-8'>
      <h1 className='flex w-full justify-center items-center text-2xl font-bold my-4 text-center'>Reading HID Device</h1>

      <h2 className='text-lg font-semibold'>Devices available : </h2>
      <div className='flex w-full flex-col max-h-80 overflow-y-auto'>
        <table className='w-full h-full overflow border-collapse border-1'>
          <thead>
            <tr>
              <th className='text-left border-collapse border-1'>Vendor ID</th>
              <th className='text-left border-collapse border-1'>Product ID</th>
              <th className='text-left border-collapse border-1'>Product</th>
              <th className='text-left border-collapse border-1'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              devices.map((device, index) => (
                <tr key={index}>
                  <td className='border-collapse border-1 p-2'>{device.vendorId}</td>
                  <td className='border-collapse border-1 p-2'>{device.productId}</td>
                  <td className='border-collapse border-1 p-2'>{device.product}</td>
                  <td className='border-collapse border-1 p-2'>
                    <button
                      className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-lg'
                      onClick={() => connect(device.vendorId, device.productId)}
                    >
                      🔌
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <h2 className='text-lg font-semibold'>Logs : </h2>
      <div className='w-full bg-gray-100 p-4 rounded h-64 overflow-y-scroll text-sm font-mono border border-gray-300'>
        {
          logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))
        }
      </div>
    </div>
  )
}

export default HIDReader
