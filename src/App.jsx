import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './screens/Home'
import Sidebar from './navigation/Sidebar'
// import Profile from './screens/Profile'
// import Options from './screens/Options'
import HIDReader from './screens/HIDReader'
import DeviceExplorer from './screens/DeviceExplorer'

function App () {
  return (
    <BrowserRouter>
      <main className='flex flex-row h-full w-full'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path='/profile' element={<Profile />} />
          <Route path='/options' element={<Options />} /> */}
          <Route path='/hid-reader' element={<HIDReader />} />
          <Route path='/device-explorer' element={<DeviceExplorer />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
