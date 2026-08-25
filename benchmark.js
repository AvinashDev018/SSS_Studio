const orders = Array.from({ length: 10000 }, (_, i) => ({
  orderId: i,
  status: ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "SHIPPED", "PICKED_UP", "DELIVERED"][Math.floor(Math.random() * 6)]
}));
const activeStatuses = ["PENDING", "PROCESSING", "READY_FOR_PICKUP", "SHIPPED", "PICKED_UP", "DELIVERED"];

// Baseline: filtering for each status
console.time('baseline');
for(let k = 0; k < 1000; k++) {
  activeStatuses.forEach(status => {
    const count = orders.filter(o => o.status === status).length;
    const items = orders.filter(o => o.status === status);
  });
}
console.timeEnd('baseline');

// Optimized: grouping once
console.time('optimized');
for(let k = 0; k < 1000; k++) {
  const grouped = activeStatuses.reduce((acc, s) => { acc[s] = []; return acc; }, {});
  orders.forEach(o => {
    if (grouped[o.status]) grouped[o.status].push(o);
  });
  activeStatuses.forEach(status => {
    const count = grouped[status].length;
    const items = grouped[status];
  });
}
console.timeEnd('optimized');
