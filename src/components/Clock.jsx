import { useEffect, useState } from 'react'

function Clock ({ timeZone = 'Europe/Paris' }) {
  const [date, setDate] = useState(new Date())

  // date = new Date() Interdit
  // setDate(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date())
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <h2>{timeZone} : {date.toLocaleTimeString('fr-FR', { timeZone })}</h2>
  )
}

export default Clock
