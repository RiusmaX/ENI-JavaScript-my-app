import Clock from '../components/Clock'

function Home () {
  return (
    <section className='flex flex-col'>
      <h1>HOME</h1>
      <Clock timeZone='Europe/Paris' />
      <Clock timeZone='Asia/Bangkok' />
      <Clock timeZone='America/New_York' />
    </section>
  )
}

export default Home
