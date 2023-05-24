"use strict"; console.debug('csv_process.js');
toastr.options = { "timeOut": "3000", "closeButton": true }

function csv_Export() {
    // console.log('csv_Export');

    const filteredKeys = Object.keys(localStorage).filter(key => key.startsWith('REC_No_'));
    const lineNumbers  = filteredKeys.map(key => {
        return { no: key.replace('REC_No_', ''), value: localStorage.getItem(key) }
    });

    if (lineNumbers.length == 0) {
        Command: toastr["error"]("出力対象がありません。", "");
        return;
    }
    
    const min = 0,
          nam = ['はやぶさ', 'ときわ', 'ひたち', 'かにカニはまかぜ',
              'おどりこ', 'くさつ', 'かいじ', 'つばさ', 'こまち',
              'はくさん', 'のぞみ', 'ひかり', 'こだま', 'さくら'],
          max = nam.length - 1;
    var   iti = Math.floor(Math.random() * (max + 1 - min)) + min; //min から始めるように変更

    let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "\uFEFF"; // BOMマークを追加
        csvContent += "no,value\n";

    lineNumbers.forEach(line => {
        csvContent += `${line.no} , ${line.value}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link       = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", (nam[iti]) + ".csv");
    document.body.appendChild(link);
    link.click();
    link.remove();

    Command: toastr["info"]("書き出ししました。<br>ファイルをご確認ください。", "");
};

 // console.warn('');
let reader = null;

function handleFiles(event) {
  const files = event.target.files;
  const file = files[0];

  Command: toastr["info"]("読み込み中...", "");

  if (!file.type.match('csv')) {
    Command: toastr["error"]("このファイルは、CSV形式ではありません。", "");
    return;
  }

  reader        = new FileReader();
  reader.onload = function (event) {

    const csv   = event.target.result;
    const lines = csv.split("\n");

    if (lines.length <= 2) {
      Command: toastr["error"]("ファイルが空です。", "");
      return;
    } else if (lines.length >= 185) {
      Command: toastr["error"]("ファイルが大きいです。", "");
      return;
    } else {
      for (let i = 1; i < lines.length - 1; i++) {
        const values = lines[i].split(",");
        const lineNo = values[0];
        const value  = values[1];
        const regex  = (/^[1-6]_/);

        if (lineNo.includes(' ') || !(regex.test(lineNo))) {
          Command: toastr["error"](`不正な値があります。<br>処理を中止しました。<br>行数：${i}`);
          return;
        } else { localStorage.setItem(`REC_No_${lineNo}`, value); }
    }

      Command: toastr["info"]('読み込みました。', "");
      setTimeout(function () { 
        $('#mes_csv_import').text("　"); 
        modal_Close(); 
        location.reload(); 
      }, 1500);
    }

  };
  reader.readAsText(file);
};

