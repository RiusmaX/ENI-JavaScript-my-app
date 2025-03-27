const { parentPort, workerData } = require('worker_threads')

/**
 * Check if a given number is a prime number
 * @param {Number} n the numer to check
 * @returns true if n is prime number
 */
function isPrime (n) {
  for (let i = 2, sqrt = Math.sqrt(n); i <= sqrt; i++) {
    if (n % i === 0) return false
  }
  return n > 1
}

function findNthPrime (n) {
  let count = 0
  let current = 1
  while (count < n) {
    current++
    if (isPrime(current)) {
      count++
    }
  }
  return current
}

const result = findNthPrime(workerData)
parentPort.postMessage(result)
