var btnInvoicesRefresh = document.getElementById("invoices-refresh");
var invoicesHTML = document.getElementById("invoices");

refreshButtonHandler();
btnInvoicesRefresh.onclick = refreshButtonHandler;

function refreshButtonHandler() {
    fetchInvoices();
}

//fait la requete HTTP GET localhost:3000/invoices
function fetchInvoices() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("responseText: ", xhr.responseText);
                var invoices = JSON.parse(xhr.responseText);
                showResults(invoices);
            } else {
                console.error("fetchInvoices: Fail", xhr);
            }
        }
    };

    //xhr.onload = responseHandlerCB;
    xhr.open("GET", "http://localhost:3000/invoices ", true);
    xhr.send();
}

const showResults = (invoices) => {
    let total = 0;
     
    let html = `
    <table class="table table-hover">
        <thead>
            <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Discount</th>
            </tr>
        </thead>
        <tbody>
`;

    invoices.forEach(function (invoice, i) {
        total += (invoice.quantity * invoice.unitPrice)*((100-invoice.discount)/100);
        
        html += `     
      <tr> 
        <td>${invoice.client}</td>
        <td>${invoice.date}</td>
        <td>${invoice.product}</td>
        <td>${invoice.quantity}</td>
        <td>${invoice.unitPrice}</td>
        <td>${invoice.discount}</td>
      </tr>
      `;
    });

    html += `
            <tr> 
                <td>total</td>            
                <td colspan="5">${total}</td>
            </tr>
        </tbody>
    </table> 
    `;

    invoicesHTML.innerHTML = html;
};
