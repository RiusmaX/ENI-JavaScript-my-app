/* global AudioContext requestAnimationFrame cancelAnimationFrame */

import { useEffect, useRef, useState } from 'react'

function MicVolumeMeter () {
  const [devices, setDevices] = useState([])
  const [selectedId, setSelectedId] = useState('')

  const [volume, setVolume] = useState(0)
  const [isListening, setIsListening] = useState(false)

  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((list) => {
      const inputs = list.filter((d) => d.kind === 'audioinput')
      setDevices(inputs)
      if (inputs[0]) setSelectedId(inputs[0].deviceId) // auto-sélection
    })
  }, [])

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedId }
      })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      source.connect(analyser)

      analyserRef.current = analyser
      audioContextRef.current = audioContext

      setIsListening(true)

      const updateVolume = () => {
        analyser.getByteTimeDomainData(dataArray)

        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128
          sum += normalized * normalized
        }
        const rms = Math.sqrt(sum / dataArray.length)
        const db = Math.min(1, rms)

        setVolume(db)
        animationRef.current = requestAnimationFrame(updateVolume)
      }

      updateVolume()
    } catch (error) {
      console.error(error)
    }
  }

  const stopMic = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (audioContextRef.current) audioContextRef.current.close()
    setIsListening(false)
    setVolume(0)
  }

  return (
    <div className='flex flex-col w-full h-full items-center justify-center'>
      <h1 className='text-2xl font-bold my-4'>🎙️ Affichage du volume du micro</h1>

      <div className='mb-4'>
        <label className='block mb-1 font-medium'>Sélectionner un micro :</label>
        <select
          className='border rounded px-3 py-2 w-full'
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || '(Micro non autorisé)'}
            </option>
          ))}
        </select>
      </div>

      <div className='flex gap-4 mb-6'>
        {
          !isListening
            ? (
              <button
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700'
                onClick={startMic}
              >
                Activer le micro
              </button>
              )
            : (
              <button
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700'
                onClick={stopMic}
              >
                Arrêter
              </button>
              )
        }
      </div>

      <div className='h-6 w-[500px] bg-gray-300 rounded overflow-hidden'>
        <div
          className='h-full bg-amber-500'
          style={{ width: `${volume * 100}%` }}
        />
      </div>

      <div className='text-right text-xs mt-1 text-gray-500'>
        Niveau : {(volume * 100).toFixed(1)}%
      </div>
    </div>
  )
}

export default MicVolumeMeter
