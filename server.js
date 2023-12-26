const express = require('express')
const bodyParser = require('body-parser')
const ADODB = require('node-adodb');
const path = require('path');

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const connection = ADODB.open('Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:\\Users\\vishw\\Desktop\\trucks.mdb;');


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/home.html")
})

app.post('/', (req, res) => {
  const ticket = req.body.ticketnumber
  console.log(ticket)
  // let query1 = `SELECT * FROM Tickets WHERE TicketNumber=${ticket} AND Closed=True`
  let query1=`SELECT *, FORMAT(LoadWeightTime, 'HH:nn:ss') AS FormattedLoadTime, FORMAT(EmptyWeightTime, 'HH:nn:ss') AS FormattedEmptyTime,
  FORMAT(LoadWeightDate,'dd-mm-yyyy') AS FormattedLoadDate, FORMAT(EmptyWeightDate,'dd-mm-yyyy') AS FormattedEmptyDate 
  FROM Tickets
  WHERE TicketNumber = ${ticket} AND Closed = True
  `
  connection.query(query1).then(data => {
    if (data.length == 0) {
      res.redirect('/')
    }
    else {
      // console.log(data);

      const result = data[0];
      const vehicleNumber = result.VehicleNumber;
      const material = result.Materialname;
      const supplier = result.SupplierName;
      const amount = result.AMOUNT;
      const grosswt = result.LoadedWeight.toLocaleString();
      const tarewt = result.EmptyWeight.toLocaleString();
      const netwt = result.NetWeight.toLocaleString();
      const loaddate = result.FormattedLoadDate;
      const emptydate = result.FormattedEmptyDate;
      const loadtime = result.FormattedLoadTime;
      const emptytime = result.FormattedEmptyTime;

      // console.log(vehicleNumber)
      // console.log(material)
      // console.log(supplier)
      // console.log(amount)
      // console.log(grosswt)
      // console.log(tarewt)
      // console.log(netwt)
      // console.log(loaddate)
      // console.log(emptydate)
      // console.log(loadtime)
      // console.log(emptytime)


      // res.sendFile(__dirname + '/views/index.html')
      res.send(`<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Slip</title>
          <link rel="stylesheet" href="/css/bootstrap.min.css">
          <link rel="stylesheet" href="/css/styles.css">
      
      </head>
      
      <body style="-webkit-print-color-adjust: exact">
          <div class="box mt-2 m-auto">
              <div class="header">
                  <div class="text-center">
                      <h4 class="heading">APPAJI WEIGH BRIDGE</h4>
                      <h6 class="subHeading">AT, ILKAL KUSTAGI SERVICE ROAD, NEAR DARGA</h6>
                      <h6 class="subHeading">ILKAL-587125</h6>
                      <img src="/images/Essae-HR-Logo.png" alt="logo" class="image">
                  </div>
                  <div class="firm">
                        <img src="/images/qrcode.png" alt="qrcode"class="qrcode">
                  </div>
                  <div class="contact">
                      <h6 class="subHeading mb-1">MOB:9448137893</h6>
                  </div>
                  <div class="contact2">
                      <h6 class="subHeading">9449810993</h6>
                  </div>
              </div>
              <div class="exceptHeading">
                  <div class="vehicle ">
                      <h6 class="exceptHeading">TICKET NO: ${ticket}</h6>
                      <h6 class="exceptHeading">VEHICLE NO: ${vehicleNumber}</h6>
                      <h6 class="exceptHeading">MATERIAL: ${material}</h6>
                  </div>
                  <img src="/images/paid.png" alt="paid" class="paidImage">
                  <div class="supplier">
                      <h6 class="exceptHeading">SUPPLIER: ${supplier}</h6>
                      <h6 class="exceptHeading">AMOUNT: ${amount}</h6>
                  </div>
                  <hr class="wide-line">
              </div>
              <div>
                  <div>
                      <img src="/images/TRUCK2.png" alt="truck" class="icons loadedTruck">
                      <img src="/images/truck.png" alt="truck" class="icons emptyTruck">
                      <img src="/images/boxes.png" alt="load" class="icons load">
                  </div>
                  <div class="weight">
                      <h6 class="exceptHeading">GROSS WT : ${grosswt} KG</h6>
                      <h6 class="exceptHeading mt-4">TARE WT : ${tarewt} KG</h6>
                      <h6 class="exceptHeading mt-4"><u>NET WT : ${netwt} KG</u></h6>
                  </div>
                  <div class="dates">
                      <h6 class="exceptHeading">DATE: ${loaddate}</h6>
                      <h6 class="exceptHeading mt-4">DATE: ${emptydate}</h6>
                  </div>
                  <div class="times">
                      <h6 class="exceptHeading">TIME: ${loadtime}</h6>
                      <h6 class="exceptHeading mt-4">TIME: ${emptytime}</h6>
                  </div>
                  <div class="thankNote text-center">
                      <h6 class="exceptHeading">THANK YOU</h6>
                      <h6 class="exceptHeading">Weighed on Essae Electronic Truck Scale</h6>
                  </div>
                  <div class="operatorSign">
                      <h6 class="exceptHeading">Operator Sign</h6>
                  </div>
              </div>
          </div>
          <script src="/js/bootstrap.bundle.min.js"></script>
      </body>
      </html>`)
    }
  }).catch(err => {
    console.error(err); // Handle errors
  });
})

app.listen(3000, () => {
  console.log("server running on port 3000")
})