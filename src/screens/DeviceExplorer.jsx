import { useEffect, useState } from 'react'
import MicVolumeMeter from '../components/MicVolumeMeter'

function DeviceExplorer () {
  const [devices, setDevices] = useState([])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(setDevices)
  }, [])

  return (
    <div className='flex flex-col w-full'>
      <MicVolumeMeter />
      <h1>DEVICES EXPLORER</h1>
      <div className='flex w-full flex-col max-h-full overflow-y-auto'>
        <table className='w-full h-full overflow border-collapse border-1'>
          <thead>
            <tr>
              <th className='text-left border-collapse border-1'>Device ID</th>
              <th className='text-left border-collapse border-1'>Group ID</th>
              <th className='text-left border-collapse border-1'>Kind</th>
              <th className='text-left border-collapse border-1'>Label</th>
              <th className='text-left border-collapse border-1'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              devices.map((device, index) => (
                <tr key={index}>
                  <td className='border-collapse border-1 p-2'>{device.deviceId}</td>
                  <td className='border-collapse border-1 p-2'>{device.groupId}</td>
                  <td className='border-collapse border-1 p-2'>{device.kind}</td>
                  <td className='border-collapse border-1 p-2'>{device.label}</td>
                  <td className='border-collapse border-1 p-2'>
                    <button
                      className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-lg'
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

    </div>
  )
}

export default DeviceExplorer
