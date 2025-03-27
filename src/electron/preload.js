// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getHidDevices: () => ipcRenderer.invoke('get-hid-devices'),
  connectToDevice: (vendorId, productId) => ipcRenderer.invoke('connect-to-device', vendorId, productId),
  // Connect an event handler between nodejs and electron web browser
  onHidData: (callback) => ipcRenderer.on('hid-data', (_event, data) => callback(data))
})
