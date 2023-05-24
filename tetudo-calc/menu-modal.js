"use strict"; console.debug('menu-modal.js');

const modal_Gra = document.getElementById('M_Graf'),
    modal_Det = document.getElementById('M_del_th'),
    modal_Del = document.getElementById('M_del_Al'),
    modal_Csi = document.getElementById('M_csv_in'),
    modal_Cso = document.getElementById('M_csv_ou'),
    modal_Ugi = document.getElementById('M_use_gi');

// ボタンがクリックされた時
$("#mo_Open_M_Graf").on("click", function () { modal_Open_id(modal_Gra); modal_Graf(); });
// delete-----------
// $("#mo_Open_M_del_th").on("click", function () { modal_Open_id(modal_Det); del_Call(2); });
// $("#mo_Open_M_del_Al").on("click", function () { modal_Open_id(modal_Del); del_Call(1); });
// delete-----------
// csv-----------
$("#mo_Open_M_csv_in").on("click", function () { modal_Open_id(modal_Csi); $("#csv_inport").on("change", handleFiles); });
$("#mo_Open_M_csv_ou").on("click", function () { modal_Open_id(modal_Cso); $("#csv_export").on("click", csv_Export); });
// csv-----------
$("#mo_Open_M_use_gi").on("click", function () { modal_Open_id(modal_Ugi); });
// -----------

function modal_Open_id(modalElement) {
    let nav = document.querySelector("#navArea");
    nav.classList.toggle("open");
    
    modalElement.style.display = 'block';
}

//ーーーーーーーーとじるーーーーーーーー
$(".btn_Cancel").on("click", modal_Close);


$("#M_Graf"  ).click(function (event) { if (event.target.id == "M_Graf"  ) { $(this).fadeOut(); }});
$("#M_del_th").click(function (event) { if (event.target.id == "M_del_th") { $(this).fadeOut(); }});
$("#M_del_Al").click(function (event) { if (event.target.id == "M_del_Al") { $(this).fadeOut(); }});
$("#M_csv_in").click(function (event) { if (event.target.id == "M_csv_in") { $(this).fadeOut(); }});
$("#M_csv_ou").click(function (event) { if (event.target.id == "M_csv_ou") { $(this).fadeOut(); }});
$("#M_use_gi").click(function (event) { if (event.target.id == "M_use_gi") { $(this).fadeOut(); }});

function modal_Close(flag) {
    modal_Gra.style.display = 'none';
    modal_Det.style.display = 'none';
    modal_Del.style.display = 'none';
    modal_Csi.style.display = 'none';
    modal_Cso.style.display = 'none';
    modal_Ugi.style.display = 'none';
    

    if (flag == 1) { $('.del_Data_check input[type="checkbox"]').prop('checked', false); }
}