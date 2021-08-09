const { ipcRenderer } = require("electron");

const splitItemstable = document.querySelector("#splitItem")
const splitDropdwn = document.querySelector("#number-of-sub-order")
const subOrderDiv = document.querySelector("#show_suborder")
const subOrderTable = document.querySelector("#split_tablebody")

ipcRenderer.on("splitItemsAreSent", (e, splitItems) => {
    console.log("splitItems", splitItems);

    //  table split left start here
    let content = "";
    splitItemstable.innerHTML = ""
    let sumOfQty = 0;

    splitItems.map((item) => {
        let foodName = item.row.ProductName
        let varientName = item.row.variantName
        let price = item.row.price
        let foodId = item.row.ProductsID
        let qty = item.qty
        let intQty = parseInt(qty)
        sumOfQty += intQty

        content += `<tr onclick="addItemsIntoSuborder(this)">
                    <td>${foodName}</td>
                    <td>${qty}</td>
                    <td style="display:none">${varientName}</td>
                    <td style="display:none">${price}</td>
                    <td style="display:none">${foodId}</td>

              </tr>`
    })
    splitItemstable.innerHTML = content
    //  table split left end here


    //select number of split dropdown start here
    let option = "";
    for (let i = 2; i <= sumOfQty; i++) {
        const element = i;
        option += ` <option value="${element}">${element}</option>`;

    }
    splitDropdwn.innerHTML += option;
    //select number of split dropdown  end here
})

//creating suborder div based on
function showSubOrder(selectedObj) {
    let chosenSplitNumber = selectedObj.value
    let subOrderContent = ""

    for (let index = 0; index < chosenSplitNumber; index++) {
        subOrderContent += `<div class="col-md-6">
        <div class="info_part split-item " onclick="selectedSplit(this)" id="splitOrder${index}">
         
            <table class="table table-bordered  table-info text-center" id="split">
                <thead>
                    <tr>
                        <th>Item </th>
                        <th>Variant Name</th>
                        <th>Unit price </th>
                        <th>Qty </th>
                        <th class="text-center">Total price </th>
                    </tr>
                </thead>
                <tbody id="subOrder_table_data">
                </tbody>
                <tfoot id="subOrder_table_footer">
                </tfoot>
                <input type="hidden" id="service-1334" value="0">
            </table>
            <div class=" d-flex justify-content-between mb-2">
                <label for="customer" class=" me-3 customer-label">Customer</label>
                <select name="customer_name[]" class="form-control " id="customer-1335" required="">
                    <option value="">Select Customer</option>
                    <option value="1" selected="selected">Walkin</option>
                </select>
            </div>
            <div class="submit_area">
                <button class=" btn btn-clear " id="subpay-1334" onclick="paySuborder(this)"
                    data-url="https://restaurant.bdtask.com/demo/ordermanage/order/paysuborder">Pay Now &amp; Print
                    Invoice</button>
            </div>
        </div>
    </div>
    `
    }
    subOrderDiv.innerHTML = subOrderContent

}
// creating suborder div based on the number of split selected from dropdown  end here 



//action when the split suborder div is clicked  or unclicked
let arrayName;
function selectedSplit(chosenSplit) {
    arrayName = chosenSplit.id;
    console.log("arrayName",arrayName);
    let items, i
    items = document.getElementsByClassName("split-item"); // get the current class in the suborder div


    for (i = 0; i < items.length; i++) {
        //items[i].removeAttribute("id") // remove id when the cursor is removed from the div
        items[i].className = items[i].className.replace("split-selected", ""); // remove the new cls when the cursor is removed from the div
    }

    chosenSplit.classList.add("split-selected"); // add new class and style the border to that calass while  clicking on  current suborder div
    //chosenSplit.setAttribute("id", "splitSuborder") //adding id to the sliptsuborder div

}
//adding the  items into suborder table when clicked
let ratio = 1
const decrement = 1

function addItemsIntoSuborder(tr) {
    console.log("arrayName",arrayName);
    // this.arrayName = new Array();
    let splittedItems = [];

    let foodName = tr.getElementsByTagName("td")[0];
    let foodNameData = foodName.textContent

    let qty = tr.getElementsByTagName("td")[1];
    let qtyData = qty.textContent
    let quantity = parseInt(qtyData)

    let varient = tr.getElementsByTagName("td")[2];
    let varientData = varient.textContent

    let price = tr.getElementsByTagName("td")[3];
    let priceData = price.textContent
    let productPrice = parseInt(priceData)

    let foodId = tr.getElementsByTagName("td")[4];
    let foodIdData = foodId.textContent

    let subTotal = ratio * productPrice

    //checking quantity 
    if (quantity == 0) {
        return
    } else {
        // console.log("quantity", quantity);
        quantity -= decrement
            ;
        qty.innerHTML = quantity;
    }

    splittedItems.push({ foodNameData, ratio, varientData, priceData, subTotal, foodIdData })
    let splitNo = splitDropdwn.options[splitDropdwn.selectedIndex].text;
    console.log("splitNo", splitNo);
    let splittedItems1 = []
    let splittedItems2 = []

    if (arrayName == "splitOrder0") {
        splittedItems1.push({ foodNameData, ratio, varientData, priceData, subTotal, foodIdData })
        const insertSubOrder = document.querySelector(`#${arrayName}`)
        const subOrderTble = insertSubOrder.querySelector("#subOrder_table_data")

        let splitContent;
        splittedItems1.forEach(item => {
            if (item.foodIdData == foodIdData) {
                splittedItems1.map((item) => {
                    splitContent = `<tr>
                <td scope="row">${item.foodNameData}</td>
                <td>${item.varientData}</td>
                <td>${item.priceData}</td>
                <td>${item.ratio}</td>
                <td class="foodTotal">${item.subTotal}</td>
                </tr>`
                })
                subOrderTble.innerHTML += splitContent
                ratio++
            } else {
                splittedItems1.map((item) => {
                    splitContent = `<tr>
                <td scope="row">${item.foodNameData}</td>
                <td>${item.varientData}</td>
                <td>${item.priceData}</td>
                <td>${item.ratio}</td>
                <td class="foodTotal">${item.subTotal}</td>
                </tr>`
                })
                subOrderTble.innerHTML += splitContent
            }
        });


    } else if (arrayName == "splitOrder1") {
        console.log("Hawa");
        splittedItems2.push({ foodNameData, ratio, varientData, priceData, subTotal, foodIdData })
        const insertSubOrder = document.querySelector(`#${arrayName}`)
        const subOrderTble = insertSubOrder.querySelector("#subOrder_table_data")

        let splitContent1;

        splittedItems2.map((item) => {
            splitContent1 = `<tr>
            <td scope="row">${item.foodNameData}</td>
            <td>${item.varientData}</td>
            <td>${item.priceData}</td>
            <td>${item.ratio}</td>
            <td class="foodTotal">${item.subTotal}</td>
            </tr>`
        })
        subOrderTble.innerHTML += splitContent1
    } else {
        console.log("Splitted");
    }


    // ratio++


    const cartTotal = totalPrice()
    let vat = parseFloat((cartTotal / 100) * 15).toFixed(2);
    let grand = cartTotal * ((100 + 15) / 100);
    let grandWithTax = parseFloat(grand).toFixed(2);

    return
    const subOrderTbleFooter = insertSubOrder.querySelector("#subOrder_table_footer")
    let tblefooter = ""
    tblefooter = ` <tr>
                        <td colspan="2" class="text-right font-14" align="right">&nbsp; <b>Total </b></td>
                        <td  colspan="3" class="text-right"><b>${cartTotal} </b></td>
                    </tr>
                    <tr>
                        <td colspan="2" align="right" class="text-right font-14">&nbsp; <b>Vat </b></td>
                        <td  colspan="3" class="text-right"><b>${vat}</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" align="right" class="text-right font-14">&nbsp; <b>Service Charge </b></td>
                        <td  colspan="3" class="text-right"><b>0.000</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" align="right" class="text-right font-14">&nbsp; <b>Grand total </b></td>
                        <td  colspan="3" class="text-right"><b>${grandWithTax}</b></td>
                        <input type="hidden" id="total-sub-1371" value="400">
                        <input type="hidden" id="vat-1371" value="60">
                        <input type="hidden" id="service-1371" value="0">
                    </tr>
                `

    subOrderTbleFooter.innerHTML = tblefooter

}


function totalPrice() {

    let trs = [...document.querySelectorAll("#subOrder_table_data tr")];
    let total = 0
    trs.map((tr) => {
        const totalPriceElement = tr.getElementsByClassName("foodTotal")[0];
        let subTotalprice = parseInt(totalPriceElement?.textContent);
        total = total + subTotalprice;

    })
    total = Math.round((total + Number.EPSILON) * 100) / 100;
    return total
}

