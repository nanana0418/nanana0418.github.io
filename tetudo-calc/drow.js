"use strict"; console.debug('drow.js');

const json         = sessionStorage.getItem('company_Info'),
      company_Info = JSON.parse(json);
console.log(company_Info);


// ローカルストレージ　取り出し
var total_W_kilo   = 0,
    total_R_kilo   = 0,
    total_Z_kilo   = 0;

const array_R_kilo = [],
      array_W_kilo = [],
      array_Z_kilo = [];

const array_Co_Na  = [];//会社名
    array_Co_Na[0] = '未乗距離';

const array_Co_Co  = [];//会社ｲﾛ
    array_Co_Co[0] = '#ccc';

var chack_T = 0;
// データ取得
for (let c = 1; c < 7; c++) {
    // とる
    const get_R_kilo = parseFloat(localStorage.getItem('total_Ro_' + c))|| 0,
          get_W_kilo = parseFloat(company_Info[c]["cc_WO"]).toFixed(1) || 0,
          get_Z_kilo = parseFloat(get_W_kilo - get_R_kilo).toFixed(1);
    // console.log('   get_R_kilo:' + c    + ' ' + get_R_kilo + 
    //             '   get_W_kilo:' + c    + ' ' + get_W_kilo +
    //             '   get_Z_kilo:' + c    + ' ' + get_Z_kilo);

    // はいれつ
    [array_R_kilo[c], array_W_kilo[c], array_Z_kilo[c]] = [get_R_kilo, get_W_kilo, get_Z_kilo];
    // console.warn('  array_R_kilo:' + c + ' ' + array_R_kilo[c] + 
    //              '  array_W_kilo:' + c + ' ' + array_W_kilo[c] +
    //              '  array_Z_kilo:' + c + ' ' + array_Z_kilo[c] );

    // 総キロ
    total_W_kilo += parseFloat(get_W_kilo);
    total_R_kilo += parseFloat(get_R_kilo);
    total_Z_kilo =  parseFloat(total_W_kilo - total_R_kilo).toFixed(1);
    // console.log('   total_W_kilo:' + ' ' + total_W_kilo + 
    //             '   total_R_kilo:' + ' ' + total_R_kilo +
    //             '   total_Z_kilo:' + ' ' + total_Z_kilo );
    
    array_Co_Na[c] = String(company_Info[c]["cc_NA"]);//会社名
    array_Co_Co[c] = String(company_Info[c]["cc_CO"]);//会社ｲﾛ
    chack_T        += parseFloat(company_Info[c]["cc_WO"]);//総距離チェック

}
    [array_R_kilo[0], array_W_kilo[0], array_Z_kilo[0]] = [total_Z_kilo, total_W_kilo, total_Z_kilo];

    console.log(array_R_kilo);
    console.log(array_W_kilo);
    console.log(array_Z_kilo);
    console.info(array_Co_Na);
    console.info(array_Co_Co);
    console.warn(total_W_kilo-chack_T);

//　ぜんたいーーーーーーーーーーー
var ctx = document.getElementById('chart_main');
let chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: array_Co_Na,
        datasets: [{
            data: array_R_kilo,
            backgroundColor: array_Co_Co,
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
//　ぜんたいーーーーーーーーーーー
//　個別ーーーーーーーーーーーー
for (let c = 1; c < 7; c++) {
var ctx = document.getElementById('Chart_' + c);
let chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [array_Co_Na[c], array_Co_Na[0]],
        datasets: [{
            data:            [array_R_kilo[c],array_Z_kilo[c]],
            backgroundColor: [array_Co_Co[c] ,array_Co_Co[0] ],
            // hoverBackgroundColor:['#313131'],
        }],},
    options: {
      plugins: {
        legend: {
            position: 'right',
            labels: { usePointStyle: true, }
        },
      }
     }
  });
}
//　個別ーーーーーーーーーーーー
//　各ページーーーーーーーーーーー

// //　各ページーーーーーーーーーーー