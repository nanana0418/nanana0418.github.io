<?php
  header("Content-Type: text/html");
  try {
    $dsn      = 'mysql:host=localhost; dbname=Railway';
    $username = 'myadmin';
    $password = base64_decode('Rmc2VUVtZFBLTnVudTNjIQ==');
    $dbh      = new PDO($dsn, $username, $password);

    if (isset($_GET['select_company'])) { $select_V = htmlspecialchars($_GET['select_company']); }
      else { $select_V = 2; }

      if ($select_V < 1 || $select_V > 6) {
        header("HTTP/1.0 404 Not Found");
        // header('Location: ./404'); // リダイレクト先のURLを指定
        exit(); // リダイレクト後に実行を終了する
      }

    $sql = "SELECT `JR`.*, `company`.`name` c_name,`company`.`no` c_no, `kubun`.`no` k_no
            FROM `JR` 
            LEFT JOIN `company` ON `JR`.`company` = `company`.`no` 
            LEFT JOIN `kubun`   ON `JR`.`kubun`   = `kubun`.`no`
            WHERE     `company`.`no` = ?  -- AND`TF` = '1' 
            ORDER BY  `kubun`.`no` ASC 
            limit 100 ";

    $stmt = $dbh->prepare($sql);
    $stmt->bindParam(1, $select_V, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $json_rows = json_encode($rows);

    $sql1  = "SELECT `no`cc_NO, `name` cc_NA ,`total_all` cc_WO ,`Color` cc_CO, `update_date` cc_DA
              FROM  `company` 
              limit 10 ";

    $stmt1 = $dbh->prepare($sql1);
    $stmt1->execute();
    $company_Info = $stmt1->fetchAll(PDO::FETCH_ASSOC);
    $json_company_Info = json_encode($company_Info);
    
    $pase_No_json = json_encode($select_V);
    
  } catch (PDOException $e) {
    echo 'PDO DB Error: <br/>' . $e->getMessage();
    die();
  } finally {
    $dbh = null;
  }
?>

<!DOCTYPE html>
<html lang="ja">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport"
      content="width=device-width, maximum-scale=1.0,minimum-scale=0.5,user-scalable=yes,initial-scale=1.0" />
    <title>完乗率の計算　-nasu12-</title>


    <style>
      @import url('https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@300;400;500&display=swap');
    </style>

    <!-- <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/reseter.css"> -->
    <link rel="stylesheet" type="text/css" href="../reset.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="./common.css">
    <link rel="stylesheet" type="text/css" href="./menu-da.css">
    <!-- <link rel="stylesheet" type="text/css" href="./modal.css"> -->

    <link rel="stylesheet" type="text/css" href="./n_style.css">
    <link rel="stylesheet" type="text/css" href="./index_container.css">
    <link rel="stylesheet" type="text/css" href="./calc_top_bottom.css">

  </head>

  <body>

  <div class="modal" id="M_del_th" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content" style="height: 50vh;">
            <div class="modal-header">
                <h5 class="modal-title">🧹個別削除</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
            </div><!-- /.modal-header -->
            <div class="modal-body">
                <p>下記の記録を削除します。<br>削除すると、元に戻せなくなります。<br>(CSVエクスポート時を除く)</p>
                <div class="modal-mes" id=""></div>
            </div><!-- /.modal-body -->
            <div class="modal-footer">
                <button type="button" class="btn btn_Done" id="btn_del_th" data-bs-dismiss="modal">🗑️</button>
                <button type="button" class="btn btn_Cancel"               data-bs-dismiss="modal">❌</button>
                <!-- <button type="button" class="btn btn-secondary btn_Cancel" data-bs-dismiss="modal">閉じる</button> -->
            </div><!-- /.modal-footer -->
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal" id="M_del_Al" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content" style="height: 50vh;">
            <div class="modal-header">
                <h5 class="modal-title">🧹サイトデータ削除</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="閉じる"></button>
            </div><!-- /.modal-header -->
            <div class="modal-body">
                <p>Webブラウザーに保存しているこのサイトの情報をすべて削除します。<br><br>
                ・ローカルストレージ<br>・セッションストレージ<br>・データキャッシュ<br><br>
                削除後はこのページを閉じてください。<br>他のページに戻ると、新たにデータが保存されます。</p>
                <div class="modal-mes" id=""></div>
            </div><!-- /.modal-body -->
            <div class="modal-footer">
                <button type="button" class="btn btn_Done" id="btn_del_th" data-bs-dismiss="modal">🗑️</button>
                <button type="button" class="btn btn_Cancel"               data-bs-dismiss="modal">❌</button>
                <!-- <button type="button" class="btn btn-secondary btn_Cancel" data-bs-dismiss="modal">閉じる</button> -->
            </div><!-- /.modal-footer -->
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->


    <div id="navArea"></div>

    <section id="title">
      <h2>
        <div id="hedr" style="font-size:25px;"><span id="cc_na"><noscript
              style="color:red;">javascriptを有効にしてください。　</noscript>データを読み込み中... </span>
          <p id="cc_da" style="font-size:12px;"><noscript style="color:red;">Please enable
              javascript.　　</noscript>Loading data...</p>
        </div>
      </h2>
    </section>

    <div id="select_type_per">
      <div class="check_searchBox" id="check_searchBox_left">
          <input type="text" id="searchBox" placeholder="路線名など🔍" maxlength="8">
      </div>

      <div class="check_searchBox" id="check_searchBox_right">
          <div class="check_searchBox_under_body" id="select_type_1">
              <input type="checkbox" name="select_type_1" value="1"><span>🚅</span>
          </div>

          <div class="check_searchBox_under_body" id="select_type_2">
              <input type="checkbox" name="select_type_2" value="2"><span>🚃</span>
          </div>

          <div class="check_searchBox_under_body" id="select_type_4">
              <input type="checkbox" name="select_type_4" value="4"><span>❌💯</span>
          </div>
      </div>

    </div>

    <div class="container">
      <?php foreach ($rows as $row) { ?>
        <div class="item-pea"
            data-namba="<?php print(mb_substr(mb_substr($row['image_path'], -6),0, 2));?>"
            data-kubun="<?php if ($row['k_no'] == 3) { print('2'); }else{ print($row['k_no']); }?>"  
            data-TF   ="<?php print($row['TF']) ?>">

          <div class="item line_img"><!-- ナンバリング -->
            <img src="<?php print($row['image_path']) ?>" 
                alt="<?php if ($row['TF'] == 0) { print('(廃線)'); }else{ print($row['line']); } ?>"> 
          </div>

          <div class="item line_Name"><!-- 路線名 -->
            <?php if ($row['TF'] == 0) { print($row['line'].'(廃線)'); }else{print($row['line']);} ?>
          </div>

          <div class="item line_Section"><!-- 区間 -->
            <?php print($row['section']) ?>
          </div>

          <div class="item working_kilometer"><!-- 営業キロ -->
            <p><?php print($row['working_kilometer'] . " km") ?></p>
          </div>

          <div class="item one_Parsent">
            <!--パーセント  -->
          </div>

          <div class="item e_Kilo"><!-- 入力 -->
            <input
              type="text" 
              inputmode="decimal" 
              min="0" 
              max="<?php print($row['working_kilometer']) ?>"
              maxlength="5"
              placeholder="***.*(Km)"
              value=""
              name ="<?php print("REC_No_" . $row['c_no']); print("_" . $row['line']); if ($row['TF'] == 0) { print('(廃線)'); }?>"
            >
          </div>
        </div>
      <?php } ?>
    </div>

    <section id="summary">
      <div class="total-items">総距離 </div>
      <div class="total-items">乗った距離 </div>
      <div class="total-items">完乗率 </div>
      <div class="total-items" id="gotoup"><a href="#title">上に戻る</a></div>
      <div class="total-items" id="total_Working_kilometer"></div>
      <div class="total-items" id="total_Riding_kilometer"></div>
      <div class="total-items" id="total_Parsent"></div>
    </section>

  </body>

<!-- CDN -->
<script src="../jquery-3.6.3.js"></script>
<!-- <script src="https://code.jquery.com/jquery-3.6.3.js" integrity="sha256-nQLuAZGRRcILA+6dMBOvcRh5Pe310sBpanc6+QBmyVM=" crossorigin="anonymous"></script> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.2.0/chart.min.js"
  integrity="sha512-VMsZqo0ar06BMtg0tPsdgRADvl0kDHpTbugCBBrL55KmucH6hP9zWdLIWY//OTfMnzz6xWQRxQqsUFefwHuHyg=="
  crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
<!-- CDN -->
<script>
  "use strict"; console.debug('index.php');
  const in_COMPANY = JSON.parse('<?php echo $json_company_Info; ?>');
  // const in_ROSEN   = JSON.parse('[{"no":"1","line":"\u6771\u5317\u65b0\u5e79\u7dda","section":"\u6771\u4eac\uff5e\u65b0\u9752\u68ee","working_kilometer":"713.7","company":"2","kubun":"1","image_path":"web_images\/JR.png","TF":"1","c_name":"JR\u6771\u65e5\u672c","c_no":"2","k_no":"1"},{"no":"2","line":"\u4e0a\u8d8a\u65b0\u5e79\u7dda","section":"\u5927\u5bae\uff5e\u65b0\u6f5f","working_kilometer":"303.6","company":"2","kubun":"1","image_path":"web_images\/JR.png","TF":"1","c_name":"JR\u6771\u65e5\u672c","c_no":"2","k_no":"1"},{"no":"3","line":"\u5317\u9678\u65b0\u5e79\u7dda","section":"\u9ad8\u5d0e\uff5e\u4e0a\u8d8a\u5999\u9ad8","working_kilometer":"176.9","company":"2","kubun":"1","image_path":"web_images\/JR.png","TF":"1","c_name":"JR\u6771\u65e5\u672c","c_no":"2","k_no":"1"},{"no":"4","line":"\u5c71\u624b\u7dda","section":"\u54c1\u5ddd\uff5e\u7530\u7aef\uff08\u65b0\u5bbf\u7d4c\u7531\uff09","working_kilometer":"20.6","company":"2","kubun":"2","image_path":"web_images\/JY.png","TF":"1","c_name":"JR\u6771\u65e5\u672c","c_no":"2","k_no":"2"},{"no":"5","line":"\u57fc\u4eac\u7dda","section":"\u6c60\u888b\uff5e\u8d64\u7fbd","working_kilometer":"5.5","company":"2","kubun":"2","image_path":"web_images\/JA.png","TF":"1","c_name":"JR\u6771\u65e5\u672c","c_no":"2","k_no":"2"}]')
  const in_ROSEN   = JSON.parse('<?php echo $json_rows; ?>');
  const in_PASE_NO = parseInt(JSON.parse('<?php echo $pase_No_json; ?>'));

  console.log('in_COMPANY',in_COMPANY);
  console.log('in_ROSEN',in_ROSEN);
  console.log('in_PASE_NO',in_PASE_NO);

  // const in_Arrays = {"in_COMPANY": in_COMPANY, "in_ROSEN": in_ROSEN, "in_PASE_NO": in_PASE_NO }
  // console.log('in_Arrays',in_Arrays);

  $('#navArea').load('menu-da.html');
</script>

<script src="./calc_top.js"></script>
<script src="./calc_top_disp.js"></script>
<script src="./index.js"></script>

</html>