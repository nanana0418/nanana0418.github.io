"use strict"; console.debug('menu-da.js');

$(document).ready(function () {
  // menu_main
  let nav = document.querySelector("#navArea");
  $('.toggle-btn').on('click', function () {
    nav.classList.toggle("open");
    modal_Close();
  });
  $('#mask').on('click', function () { nav.classList.toggle("open"); });
  $('.btn_Cancel').on('click', function () { nav.classList.toggle("open"); });
  // menu_main

  mojimoji();
});

// ボタンをクリックしたら、グラフを再描
function modal_Graf_C() {
  try {
    var chart = Chart.getChart("Chart_0");
    if (chart) { chart.destroy(); }
    modal_Graf();
  } catch (error) { console.warn("Chart_0 Not Found."); return }
}

function modal_Graf() {
  const json = sessionStorage.getItem('company_Info'),
    company_Info = JSON.parse(json);
  const co_No = sessionStorage.getItem('co_No'),
    do_C = String(company_Info[co_No]["cc_CO"]);
  // const do_W = parseFloat(company_Info[co_No]["cc_WO"]).toFixed(1) || 0;
  // const do_R = localStorage.getItem('total_Ro_' + co_No) || 0;
  // const do_Z = parseFloat(do_W - do_R).toFixed(1);

  const keyValuePairs = Object.keys(localStorage)
    .filter(key => key.startsWith("REC_No_" + co_No)) //REC_No_*　だけ 
    .sort((a, b) => localStorage.getItem(b) - localStorage.getItem(a)) //降順ソート
    .map(key => [key.replace("REC_No_" + co_No + '_', ""), localStorage.getItem(key)]);//REC_No_*消す

  if (keyValuePairs.length >= 1) {
    const recKeys = keyValuePairs.map(pair => pair[0]),
      recValues = keyValuePairs.map(pair => pair[1]);

    // console.log("keyValuePairs:", keyValuePairs + "recKeys:", recKeys + "recValues:", recValues);

    toastr.options = { "timeOut": "5000", "closeButton": true }
    Command: toastr["info"]("乗った距離の長い順です。<br>グラフをタップで距離を確認", "");

    var ctx = document.getElementById('Chart_0');
    Chart.defaults.color = '#FFF';
    let chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: recKeys,
        datasets: [{
          data: recValues,
          backgroundColor: [do_C, '#ccc'],

          // hoverBackgroundColor:['#313131'],
        }],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            labels: { usePointStyle: true, }
          },
        }
      }
    });
  } else {
    toastr.options = { "timeOut": "5000", "closeButton": true }
    Command: toastr["error"]("この会社に記録がないため、グラフを表示できません。<br>１つ以上の記録をつけてください。", "");
  };
};


$('#moji_range').on('click', mojimoji());
function mojimoji() {
  var mojimoji = sessionStorage.getItem('mojimoji') || 100;
  var range = $('#moji_range')[0];

  // 初期表示
  setZoom(mojimoji);

  // rangeが変更された場合の処理
  range.oninput = function () {
    mojimoji = this.value;
    setZoom(mojimoji);
    sessionStorage.setItem('mojimoji', mojimoji);
  };

  function setZoom(value) {
    $('.container').css("zoom", value + '%');
    $('#btn_moji_Now').html(value + ' %');
  }
  function init() {
    if (mojimoji) {
      range.value = mojimoji;
      setZoom(mojimoji);
    }
  }
  init();
};



$('#M_del_th_open').on('click', function del_Call() {
  $('.btn_Done').css('opacity', '1');
  $('.btn_Done').hide();
  $('.btn_Done').fadeIn(2500);
  const co_Na = sessionStorage.getItem('co_Na');
  if (co_Na != null) { $('.modal-mes').text(co_Na + ' の記録すべて'); }
});

$('#M_del_Al_open').on('click', function del_Call() {
  $('.btn_Done').css('opacity', '1');
  const keys = Object.keys(localStorage);
  const keyL = keys.length
  if (keyL == 0) {
    $(".btn_Done").prop("disabled", true);
    $('.btn_Done').css('opacity', '0.5');
    $('.modal-mes').text('記録がありません。');

  }
  else if (keyL >= 1) {
    $('.btn_Done').hide();
    $('.btn_Done').fadeIn(2500);
    $('.modal-mes').text(keyL + ' 件の記録');
  }
});


$('#btn_del_Al').on('click', function a() {
  var LoSt_Count = localStorage.length;

  if (LoSt_Count >= 1) {
    localStorage.clear(); sessionStorage.clear();
    Command: toastr["info"](LoSt_Count - 3 + " 件、削除しました。", "");
  } else {
    Command: toastr["error"]("exception.", "不正実行");
    console.warn('ERRER: del_Al');
  }
  setTimeout(function () { $('.modal-mes').text('ご利用ありがとうございました。'); }, 3000);
});


$('#btn_del_th').on('click', function a() {
  var input_Count = document.querySelectorAll('input[name^="REC_No_' + sessionStorage.getItem('co_No') + '"]');

  if (input_Count.length >= 1) {
    input_Count.forEach(input => { input.value = ''; localStorage.removeItem(input.name); });
    Command: toastr["info"]("削除しました。", "");
  } else {
    Command: toastr["error"]("exception.", "不正実行");
    console.warn('ERRER: del_th');
  }
  setTimeout(function () { modal_Close(); location.reload(); }, 3000);
});

// function del_Show() {
//   $('.modal-mes').css('justify-content','center');
//   $('#btn_del_Sa').on('click', function a() {
//     document.getElementById("btn_del_Sa").setAttribute("disabled", true);
//     $('.modal-mes').css('justify-content','flex-start');
//       const keys      = Object.keys(localStorage),// ローカルストレージのキーを取得
//             lineKeys  = keys.filter(key => key.startsWith('REC_No_')),
//             output    = document.getElementsByClassName('modal-mes')[1]; // HTMLに出力
//       lineKeys.forEach(key => {
//         const value = localStorage.getItem(key).replace('REC_', ''),//REC_~だけ
//               div   = document.createElement('p');//p要素生成
//         div.textContent = `${key.replace('REC_No_', '')}: ${value}`;
//         output.appendChild(div);
//       });});}