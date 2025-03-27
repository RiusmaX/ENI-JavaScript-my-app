import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import { Worker } from 'worker_threads'

const HID = require('node-hid')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

let mainWindow = null

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

ipcMain.handle('connect-to-device', (_, vendorId, productId) => {
  const worker = new Worker(path.join(__dirname, 'hid-worker.js'), {
    workerData: { vendorId, productId }
  })

  worker.on('message', (data) => {
    mainWindow.webContents.send('hid-data', data)
  })

  return { success: true }
})

ipcMain.handle('get-hid-devices', () => {
  const devices = HID.devices()
  return devices.map(d => ({
    vendorId: d.vendorId,
    productId: d.productId,
    product: d.product || 'Inconnu'
  }))
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

/*
* WORKERS
*/

// Worker unidirectionnel - Invoke > Execute > Exit

// console.log('Main thread started')

// const worker = new Worker('./src/workers/worker-cpu.js', {
//   workerData: 1000000 // Search for 100 000th first number
// })

// worker.on('message', (message) => {
//   console.log('Message from worker : ', message)
// })

// worker.on('error', (error) => {
//   console.error('Worker error : ', error)
// })

// worker.on('exit', (code) => {
//   console.log('Worker ended with code : ', code)
// })

// Worker bidirectionnel - Invoke > Wait (Idle) > Execute

// const tasksWorker = new Worker('./src/workers/worker-tasks.js')

// tasksWorker.on('message', (msg) => {
//   console.log('Message from worker : ', msg)
// })

// let taskId = 1

// setInterval(() => {
//   const task = {
//     taskId,
//     payload: Math.floor(Math.random() * 100)
//   }

//   console.log(`Send task #${taskId} to worker`)
//   tasksWorker.postMessage(task)
//   taskId++
// }, 2000)
