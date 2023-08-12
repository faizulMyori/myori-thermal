document.addEventListener('DOMContentLoaded', e => {
let { app, remote, BrowserWindow } = require("electron");

const {PosPrinter} = remote.require("./electron-pos-printer")
const path = require("path");

let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters(); //list the printers


// window.onload= setTimeout(waitLoad, 5000)


// function waitLoad() {
  fetch('https://ssstaging.myori.my/api/getQR').then(res => res.json())
  // fetch('http://127.0.0.1:8000/api/getQR').then(res => res.json())
  .then(json => {
    const fileUrl = json.data.b64;
    console.log(fileUrl)
    if (fileUrl) {
      const options = {
        preview: false,
        margin: '0 0 0 0',
        copies: 1,
        printerName: 'Xprinter XP-420B',
        timeOutPerLine: 1000,
        landscape: true,
        silent: true,
        pageSize: { height: 66, width: 100 },
      }
      const data = [
        { type: 'text', value: 'SCAN TO RECEIVE', style: {textAlign:'center',fontSize: '10px',fontFamily:'Arial'} },
        {
          type: 'image',
          b64: fileUrl,
          height: '80px',
          width: '80px',
        }
      ];
      PosPrinter.print(data, options)
      .then(res => {
        remote.getCurrentWindow().close()
      })
      .catch((error) => {
          console.error(error);
        });
    }
  })
// }

//   request.on('response', (response) => {
//     console.log(`STATUS: ${response.statusCode}`)
//     response.on('data', (chunk) => {
//       const d = chunk.toString('utf8');
//       const parseData = JSON.parse(d);
//       const fileUrl = parseData.data.b64;
//       console.log(fileUrl)
//       if (fileUrl) {
//         const data = [
//           { type: 'text', value: 'SCAN TO RECEIVE', style: {textAlign:'center',fontSize: '10px',fontFamily:'Arial'} },
//           {
//             type: 'image',
//             url: fileUrl,
//             height: '80px',
//             width: '80px',
//           }
//         ];
//         PosPrinter.print(data, options)
//         .then()
//         .catch((error) => {
//            console.error(error);
//          });
//       }
//     })
//     response.on('end', () => {
//       console.log('No more data in response.')
//     })
//   })
// request.end()\
})