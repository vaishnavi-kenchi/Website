let products = [];

function fetchProducts() {
  fetch("http://localhost:5000/api/products")
    .then(res => res.json())
    .then(data => {
      products = data;
      renderStats();
      renderTable();
      renderChart();
    })
    .catch(err => {
      console.error("Failed to load products:", err);
    });
}

function renderStats() {
  const total = products.length;
  const lowStock = products.filter(p => p.qty < 5);
  document.getElementById("totalProducts").innerText = total;
  document.getElementById("lowStockCount").innerText = lowStock.length;

  if (lowStock.length > 0) {
    const names = lowStock.map(p => p.name).join(", ");
    const alertBox = document.getElementById("lowStockAlert");
    alertBox.innerText = `⚠️ Low Stock: ${names}`;
    alertBox.classList.remove("hidden");
  }
}

function renderTable() {
  const table = document.getElementById("productTable");
  table.innerHTML = "";
  products.forEach(p => {
    table.innerHTML += `
      <tr>
        <td class="border p-2">${p.name}</td>
        <td class="border p-2">${p.qty}</td>
      </tr>
    `;
  });
}

function renderChart() {
  const ctx = document.getElementById("inventoryChart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map(p => p.name),
      datasets: [{
        label: "Stock",
        data: products.map(p => p.qty),
        backgroundColor: "rgba(59, 130, 246, 0.6)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function exportCSV() {
  let csv = "Product,Quantity\n";
  products.forEach(p => {
    csv += `${p.name},${p.qty}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "inventory.csv";
  link.click();
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Inventory Report", 10, 10);
  products.forEach((p, i) => {
    doc.text(`${p.name}: ${p.qty}`, 10, 20 + i * 10);
  });
  doc.save("inventory-report.pdf");
}

window.onload = fetchProducts;
