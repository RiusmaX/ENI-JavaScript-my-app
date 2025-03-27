/* global AudioContext */

import { useRef, useState } from 'react'

function MicVolumeMeter () {
  const [volume, setVolume] = useState(0)
  const [isListening, setIsListening] = useState(false)

  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
    <div className='flex w-full h-full items-center justify-center'>
      <h1 className='text-2xl font-bold my-4'>🎙️ Affichage du volume du micro</h1>

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

      <div className='h-6 w-full bg-gray-300 rounded overflow-hidden'>
        <div
          className='h-full bg-amber-500 transition-all duration-100'
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
