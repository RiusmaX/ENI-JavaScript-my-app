import { useEffect, useState } from 'react'

function HIDReader () {
  const [devices, setDevices] = useState([])
  const [logs, setLogs] = useState([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const fetchDevices = async () => {
      const _devices = await window.electronAPI.getHidDevices()
      console.log(_devices)
    }
    fetchDevices()
  }, [])

  return (
    <div className='flex flex-col w-full h-full items-center'>
      <h1 className='flex w-full justify-center items-center text-2xl font-bold my-4 text-center'>Reading HID Device</h1>

      <h2 className='text-lg font-semibold mb-2'>Devices available : </h2>
    </div>
  )
}

export default HIDReader
