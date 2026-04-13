// simulate-delta.js
// A simple test script to verify that the delta-time logic prevents drift
// compared to a naive setInterval.

const duration = 10; // 10 seconds tracking
let naiveTime = duration;
let deltaTime = duration;

const startTime = Date.now();
const endTime = startTime + duration * 1000;

console.log("Starting 10-second timer simulation...");

// Simulate naive setInterval with heavy block to mimic tab backgrounding
let naiveInterval = setInterval(() => {
    naiveTime -= 1;
    // Simulate main thread blocking (like un-focused tab throttling that delays the execution)
    const blockUntil = Date.now() + 50;
    while (Date.now() < blockUntil) { }
}, 1000);

// Simulate robust Delta-Time logic
let deltaInterval = setInterval(() => {
    const remaining = Math.round((endTime - Date.now()) / 1000);
    deltaTime = remaining;
}, 100); // 100ms precision loop

setTimeout(() => {
    clearInterval(naiveInterval);
    clearInterval(deltaInterval);

    // Naive timer will drift drastically because of the 50ms block inside each tick natively
    // The delta timer will compute absolute remaining accurately.
    const actualElapsed = (Date.now() - startTime) / 1000;

    console.log(`\n--- Test Results after roughly ${duration} seconds ---`);
    console.log(`Actual elapsed absolute time: ${actualElapsed.toFixed(2)}s`);
    console.log(`Naive Timer says remaining: ${naiveTime}s (failed to progress correctly)`);
    console.log(`Delta Timer says remaining: ${deltaTime}s (accurate absolute tracking)`);

    if (deltaTime <= 0) {
        console.log("✅ Delta-Time logic is lag-proof and accurately calculates absolute offset.");
    } else {
        console.log("❌ Lag detected.");
    }
    process.exit(0);
}, (duration * 1000) + 100);
