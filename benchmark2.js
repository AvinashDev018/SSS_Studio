const { performance } = require('perf_hooks');

const slots = 4;
const iterations = 1000000;

function usingArrayFrom() {
  for (let iter = 0; iter < iterations; iter++) {
    const arr = Array.from({ length: slots }).map((_, i) => i);
  }
}

function usingArrayFill() {
  for (let iter = 0; iter < iterations; iter++) {
    const arr = Array(slots).fill(null).map((_, i) => i);
  }
}

function usingForLoop() {
  for (let iter = 0; iter < iterations; iter++) {
    const arr = Array(slots);
    for (let i = 0; i < slots; i++) {
      arr[i] = i;
    }
  }
}

console.log("Measuring Array.from...");
const start1 = performance.now();
usingArrayFrom();
const end1 = performance.now();
console.log(`Array.from took ${end1 - start1} ms`);

console.log("Measuring Array(n).fill...");
const start2 = performance.now();
usingArrayFill();
const end2 = performance.now();
console.log(`Array(n).fill took ${end2 - start2} ms`);

console.log("Measuring For Loop with preallocated...");
const start3 = performance.now();
usingForLoop();
const end3 = performance.now();
console.log(`For Loop took ${end3 - start3} ms`);
