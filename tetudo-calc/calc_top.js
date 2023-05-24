"use strict"; console.debug('calc_top.js');

function check_Value(input_Val, input_Max, input_Min, ROW_name, flag) {

	if (typeof input_Val !== 'number' && (isNaN(input_Val) || input_Val == '' || input_Val === null || input_Val === undefined) || input_Val.includes(' ')) {
		input_Val = '';
		if (flag != 1) { localStorage.removeItem(ROW_name); }// 指定されたROW_nameのローカルストレージアイテムを削除する
	}

	const dotIndex = input_Val.indexOf('.');// . のあと１桁のみ
	if (dotIndex !== -1 && input_Val.length - dotIndex > 2) {
		input_Val = parseFloat(input_Val.slice(0, dotIndex + 2));
	}

	if (input_Val > input_Max) { input_Val = input_Max; }// MAXを超えたときに修正
	if (input_Val < input_Min) { input_Val = ''; }		 // MINを超えたときに空白

	return input_Val;
}


function calc_Parsent(this_R_kilo, input_Max) {
	var result = (this_R_kilo / input_Max * 100).toFixed(2);

	return result;
}


// 各路線　乗車距離入力　 
$('.e_Kilo input').on('load change select keyup click', function () {
	// console.log('CHECK', this);

	const ROW_name 	= this.name; //DOM取得
	var input_Val 	= String($(this).val()), //入力値
		input_Max 	= parseFloat($(this).attr('max')), //最大値
		this_R_kilo = check_Value(input_Val, input_Max, 0,ROW_name); //表示用
	// console.log('ROW_name' , ROW_name,'input_Val' , input_Val,'input_Max' , input_Max);
	
	$(this).val(this_R_kilo);

	const one_Parsent = calc_Parsent(this_R_kilo, input_Max);
	const get_ROW 	  = $(this).parent().parent();
	// console.log('get_ROW' , get_ROW,	'input_Max: 	' + input_Max , 'this_R_kilo: 	' + this_R_kilo ,'one_Parsent:  	' + one_Parsent);

//合計を再計算
	get_ROW.children('.one_Parsent').each(function () {
		//row_position, RR, par, flag,row_position_this
		moji_color_Disp(this, this_R_kilo, one_Parsent, 1, ROW_name);
		sum_Riding_kilometer(); 
	});
});


// 会社合計　計算
function sum_Riding_kilometer() {
	const total_W_kilo = sessionStorage.getItem('co_Wo'), //乗車距離
		  co_No 	   = sessionStorage.getItem('co_No');
	var total_R_kilo   = 0, //営業キロ
		total_Parsent  = 0;

	$('.e_Kilo input').each(function (index) {
		const input_Field = document.querySelectorAll('.e_Kilo input[type="text"]');
		const data_TF 	  = input_Field[index].getAttribute('data_TF');
		var input_Fields  = parseFloat($(this).val()) || 0;
		
		if (data_TF == 0) { return } //廃線のときやめる
		else{
			total_R_kilo += input_Fields;
			total_Parsent = total_R_kilo / total_W_kilo * 100;

			// 不正値のときは　0
			if ((typeof total_Parsent != 'number') 	&&
				(isNaN(total_Parsent)) 				||
				(total_Parsent === "") 				|| 
				(total_Parsent === null) 			||
				(total_Parsent === undefined)) {
					total_Parsent = 0;
					console.warn('ERRER: total_Parsent');
			}

		
			if (total_R_kilo == 0) { // 会社単位で項目なしのときすべて消す
				['total_Wo_', 'total_Ro_', 'total_Za_'].forEach(key => localStorage.removeItem(key + co_No));
			} else if (total_R_kilo > 0 && (/\d{1,2}$/.test(co_No))) { // ＜＞０、co_No ２ケタで営業キロ・乗車距離せっと
				localStorage.setItem('total_Wo_' + co_No, total_W_kilo); // 営業キロ
				localStorage.setItem('total_Ro_' + co_No, parseFloat(total_R_kilo).toFixed(1)); // 乗車距離
				localStorage.setItem('total_Za_' + co_No, parseFloat(total_W_kilo - total_R_kilo).toFixed(1)); // 残距離
			} else {
				console.warn('ERROR: Not get co_No');
				toastr["error"]("キーが取得できないため、計算できません。", "");
			}

			summary_disp(total_W_kilo, total_R_kilo, total_Parsent);
		}
	});
}