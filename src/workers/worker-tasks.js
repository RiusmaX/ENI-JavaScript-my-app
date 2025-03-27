const { parentPort } = require('worker_threads')

parentPort.on('message', (task) => {
  const { taskId, payload } = task
  const delay = Math.random() * 2000 + 500

  setTimeout(() => {
    const result = `Task #${taskId} finished : ${payload} -> ${payload * 2}`
    parentPort.postMessage(result)
  }, delay)
})
