"use strict"; console.debug('calc_top_disp.js');

//フォーカス時にValueをけす
$('.e_Kilo input').focusin(function () {
	if ($(this).val() != '') {
		const val =$(this).val();
		$(this).val('');
		$(this).attr('placeholder', val);
		localStorage.removeItem(this.name);
		console.warn('removeItem：' + this.name);
	}
});


// 情報　表示
function pase_add(co_Co, cc_Na, cc_Da) {
	$('#cc_na').text(cc_Na);
	var last_access = localStorage.getItem('last_access');
	if (last_access == null ) { last_access = '' }
	$('#cc_da').text(('表示データ：' + cc_Da.substr(0, 7)) + '・前回のアクセス：' + last_access);
	
	const co_Co_02 = document.querySelector("#summary");
	co_Co_02.style.backgroundColor = co_Co; // 画面下部

	var timestamp = Date.now();
	var date 	  = new Date(timestamp);
	var last_access = (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
	localStorage.setItem('last_access', last_access);
}



//チェックボックス　対象の路線種別がないとき無効
var selected_Values = [];
var count_1 = 0,
	count_2 = 0;
	
for (let i  = 0; i < in_ROSEN.length; i++) {
	if (in_ROSEN[i].kubun == 1) { count_1++; }
	if (in_ROSEN[i].kubun == 2) { count_2++; }
}

if(count_1 == 0){
	$('input[name="select_type_1"]').prop('checked', false);
	$('input[name="select_type_1"]').prop('disabled', true);
}else{
	$('input[name="select_type_1"]').prop('checked', true);
	selected_Values =['1'];
}

if(count_2 == 0){
	$('input[name="select_type_2"]').prop('checked', false);
	$('input[name="select_type_2"]').prop('disabled', true);
}else{
	$('input[name="select_type_2"]').prop('checked', true);
	selected_Values =['1','2'];
}


// searchBox
function search_Box() {
	// var selected_Values = []; // 選択されたチェックボックスの値を格納する配列
	$('.check_searchBox input[type="checkbox"]').on('change', function () {
		selected_Values = []; // 初期化
		console.log(selected_Values);

		$('.check_searchBox input[type="checkbox"]:checked').each(function () {
			selected_Values.push($(this).val());// 選択されたチェックボックスの値を配列格納
		}); 

		showResults(); // 結果表示
	});

	$('#searchBox').on('input change', function () {
		showResults();
	}); 

    function showResults() {
		$('.item-pea').each(function () {
			const $this 	= $(this),
				lineName 	= $this.find('.line_Name').text().toLowerCase(),
				data_Kubun 	= $this.attr('data-kubun'),
				data_Namba 	= $this.attr('data-namba'),
				max 		= $this.find('.e_Kilo input').attr('max'),
				value 		= $this.find('.e_Kilo input').val();
			var show_Flag 	= true,
				check_Length= selected_Values.length;

			// 選択なし　非表示
			if (check_Length == 0) { show_Flag = false; }

			//選択されたdataKubunが存在し、現在の行のdataKubunがその中に含まれていない場合、非表示。
			if (check_Length > 0 && (selected_Values.indexOf(data_Kubun.toString()) === -1)) {
				show_Flag = false;
			}
			else if (selected_Values.includes("4") && (value == max)) {
				show_Flag = false;
			}

			//4のみが選択、かつ、その行のvalue属性==Max、非表示。value属性が1以上の場合、表示。
			if (check_Length == 1 && selected_Values.includes("4") && (value == max)) {
				show_Flag = false;
			}
			else if (check_Length == 1 && selected_Values.includes("4")) {
				show_Flag = false;
			}

			//文字列検索ボックスに入力された文字列が含まれない場合は、非表示にする。
			if ((lineName.indexOf($('#searchBox').val().toLowerCase()) === -1) &&
				(data_Namba.indexOf($('#searchBox').val().toUpperCase()) === -1)) {
				show_Flag = false;
			}

			//show_Flagがtrueの場合は、その行を表示し、falseの場合は、その行を非表示にする。
			if (show_Flag) { $this.show(); } else { $this.hide(); }
		});
	}
}

// 路線別　表示
function moji_color_Disp(row_position, RR, par, flag, row_position_this) {
	// console.log(row_position, RR, par);
	$(row_position).css("color", "#fff");
	if (par == 100) {
		if (flag == 1) { localStorage.setItem(row_position_this, RR); }
		$(row_position).css("color", "orange");
		$(row_position).text('100 %');
	} else if (par <= 0) {
		if (flag == 1) { localStorage.removeItem(row_position_this); }
		 $(row_position).text('0 %');
		 $(row_position).css("color", "red");
		
	} else if (par >= 0 || par <= 99.9) {
		if (flag == 1) { localStorage.setItem(row_position_this, RR); }
		$(row_position).css("color", "#fff");
		$(row_position).text(par + ' %');
	}
	else { $(row_position).text('---'); }
}


// 画面下部　表示
function summary_disp(total_W_kilo, total_R_kilo, total_Parsent) {
    // 総距離
    $('#total_Working_kilometer').text(total_W_kilo + ' km');
    // 乗った距離
    if (total_R_kilo.toFixed(1) == 0) {
        $('#total_Riding_kilometer').html('0 km');
    } else {
        $('#total_Riding_kilometer').html(total_R_kilo.toFixed(1) + ' km');
    }
    //完乗率
    const pase_No = sessionStorage.getItem('pase_No');
    if (total_Parsent.toFixed(2) == 100) {
        //100%
        $('#total_Parsent').css("color", "orange");
        $('#total_Parsent').html('100 %');
    } else if (total_Parsent.toFixed(2) == 0) {
        //0.0%
        if (pase_No == 3 || pase_No == 6) {
            $('#total_Parsent').css("color", "#fff");
            $('#total_Parsent').html('0 %');
        }
        else {
            $('#total_Parsent').css("color", "red");
            $('#total_Parsent').html('0 %');
        }
    } else {
        //その他
        $('#total_Parsent').css("color", "#fff");
        $('#total_Parsent').html(total_Parsent.toFixed(2) + ' %');
    }
}