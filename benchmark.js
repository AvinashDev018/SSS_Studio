const { performance } = require('perf_hooks');

const slots = 4;
const iterations = 1000000;

function usingArrayFrom() {
  for (let iter = 0; iter < iterations; iter++) {
    const arr = Array.from({ length: slots }).map((_, i) => i);
  }
}

function usingForLoop() {
  for (let iter = 0; iter < iterations; iter++) {
    const arr = [];
    for (let i = 0; i < slots; i++) {
      arr.push(i);
    }
  }
}

console.log("Measuring Array.from...");
const start1 = performance.now();
usingArrayFrom();
const end1 = performance.now();
console.log(`Array.from took ${end1 - start1} ms`);

console.log("Measuring for loop...");
const start2 = performance.now();
usingForLoop();
const end2 = performance.now();
console.log(`For loop took ${end2 - start2} ms`);
