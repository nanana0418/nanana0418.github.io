"use strict"; console.debug('index.js');

// ローカルストレージ　取得
function get_localStorage() {

	const inputFields = document.querySelectorAll('.e_Kilo input[type="text"]');
	const onePercentFields = document.querySelectorAll('.one_Parsent');

	inputFields.forEach((inputField, index) => {
		// inputField.addEventListener('input', (event) => { localStorage.setItem(inputField.name, inputField.value); });
		// とる
		const ROW_name = inputField.name,
			input_Max = parseFloat(inputFields[index].getAttribute("max")) || 0,
			input_Val = localStorage.getItem(ROW_name);

		inputField.value = check_Value(input_Val, input_Max, 0, ROW_name);//表示

		const this_R_kilo = parseFloat(inputFields[index].value) || 0,
			one_Parsent = calc_Parsent(this_R_kilo, input_Max);

		//row_position, RR, par, flag,row_position_this
		moji_color_Disp(onePercentFields[index], this_R_kilo, one_Parsent, 0);

	});
	return true;
}
// PHP → JS　CONVERT
$(document).ready(function () {

	if (get_localStorage()) { PHPtoJavaScript(); }
	else {
		console.warn('ERROR: STORAGE NOT USE');
		toastr.options = { "timeOut": "60000", "closeButton": true }
		Command: toastr["error"]("ローカルストレージが使えません。<br>または、ローカルストレージから記録を取得する際にエラー", "");
		$('#cc_na').text('Cookie を受け入れる設定にしてください。');
		$('#cc_da').text('有効後、再読み込みしてください。');
		$('.container').hide();
		$('#select_type_per').hide();
		$('.summary').hide();
		return;
	}
});


function error_Disp(position, position_en) {
	console.warn('ERRER: DB to JS error');
	toastr.options = { "timeOut": "60000", "closeButton": true }
	Command: toastr["error"](position + "の取得に失敗<br>" + position_en + " No Data.", "");

	$('.container').hide();
	$('#select_type_per').hide();
	$('.summary').hide();
}


function PHPtoJavaScript() {
	const regex = (/^[1-9][0-9]?$|^0[1-9]$/);  //パターン

	if ((in_COMPANY.length >= 0) && (in_ROSEN.length >= 0) && (regex.test(in_PASE_NO))) {

		try {
			const pase_No = Number(in_PASE_NO);

			if (pase_No >= 1 && pase_No <= 6) {
				var company_Info = [];
				company_Info[0] = null;// 添字修正
				for (var i = 0; i < in_COMPANY.length; i++) { company_Info[i + 1] = in_COMPANY[i]; }
				// セッションストレージにデータを直接保存
				sessionStorage.setItem('pase_No', Number(pase_No));
				sessionStorage.setItem('company_Info', JSON.stringify(company_Info));
				sessionStorage.setItem('co_No', company_Info[pase_No]["cc_NO"]);
				sessionStorage.setItem('co_Na', company_Info[pase_No]["cc_NA"]);
				sessionStorage.setItem('co_Wo', company_Info[pase_No]["cc_WO"]);
				sessionStorage.setItem('co_Co', company_Info[pase_No]["cc_CO"]);
				// console.log(company_Info);

				sum_Riding_kilometer();
				pase_add(company_Info[pase_No]["cc_CO"], company_Info[pase_No]["cc_NA"], company_Info[pase_No]["cc_DA"]);
				search_Box();
			} else {
				console.warn('ERRER: sessionStorage set');
				window.location.href = '../500.html';
			}

		} catch (err) {
			console.warn('ERRER: STORAGE NOT USE');
			toastr.options = { "timeOut": "3000", "closeButton": true }
			Command: toastr["error"]("ローカルストレージ<br>セッションストレージ使用不可。<br>有効にしてください。", "😕");

			$('#cc_na').text('Cookie を受け入れる設定にしてください。');
			$('#cc_da').text('有効後、再読み込みしてください。');
			error_Disp('情報', '');
		}

	} else if (in_COMPANY.length == 0) {
		error_Disp('会社情報', 'COMPANY');
	} else if (in_ROSEN.length == 0) {
		error_Disp('路線情報', 'LINE');
	} else if (!regex.test(in_PASE_NO)) {
		error_Disp('ページ番号', 'PASE Number');
	} else { window.location.href = '../500.html'; }
}

// var url = new URL(location);
// var params1 = url.searchParams.get('');
// var params1_ = encodeURIComponent(params1);

// location.href ='./index.php?' + '&params1' + params1_;


  // var windowWidth = $(window).width();
  // $('#Wid').text(windowWidth);
  // const { NO } = company_Info[0];
  // console.log(company_Info[0]["cc_NA"]);
  // console.log ({ NO } = company_Info[0]);