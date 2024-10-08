document.addEventListener('DOMContentLoaded', e => {
  let { app, remote, BrowserWindow, dialog } = require("electron");

  const {PosPrinter} = remote.require("./electron-pos-printer")
  const path = require("path");

  let webContents = remote.getCurrentWebContents();
  let printers = webContents.getPrinters(); //list the printers


  function isOnline(){
    if (navigator.onLine) {
      getQR()
    } else {
      d_box()
    }
  }

  async function d_box () {
    const resp = await remote.dialog.showMessageBox({
      title:"There's no internet",
      message:"No internet available, do you want to try again?",
      type:'warning',
      buttons:["Try again please","Close"],
      defaultId: 0
    })

    if (!resp.response) {
      isOnline()
    } else {
      remote.getCurrentWindow().close()
    }
  }

  isOnline();


  function getQR() {
    fetch('https://smartsecure.myori.my/api/getQR').then(res => res.json())
    // fetch('http://127.0.0.1:8000/api/getQR').then(res => res.json())
    .then(json => {
      const data_b64 = JSON.parse(json.data.b64);
      const fileUrl = data_b64.b64;
      let copies = data_b64.copies;
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

        let i = 0;
        for (let index = 0; index < parseInt(copies); index++) {
          PosPrinter.print(data, options)
          .then(res => {
            i++;
            if (i == parseInt(copies)) {
              setTimeout(function () {
                remote.getCurrentWindow().close()
              }, (copies+1).padEnd(4,"0"))
            }
          })
          .catch((error) => {
            console.error(error);
          });
        }
      }
    })
  }
})