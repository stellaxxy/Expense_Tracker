<?php
require_once('mysqlcredentials.php');

$output = [
    'success' => 'false'
];

$query = "SELECT `id`, `type`, `date`, `vendor`, `city`, `state`, `amount`, `currency`, `paymentMethod`, `comment` FROM `expenses`";

if(!empty($_POST['expense_idArr'])){
    $expense_idArr = [];
    foreach($_POST['expense_idArr'] as $id){
        if(is_numeric($id)){
            $expense_idArr[] = $id;
        } else {
            $output['error'] = 'Id must be a number';
        }
    }

    $all_id = implode(',', $expense_idArr);
    $query = "$query WHERE `id` IN ($all_id)";
}

if(!empty($_POST['searchValue'])){
    $_POST['searchValue'] = addslashes($_POST['searchValue']);
    if($_POST['searchValue'] === 'type' || $_POST['searchValue'] === 'city' || $_POST['searchValue'] === 'year'){
        $query = "$query WHERE ";
    }
}

if(array_key_exists('error', $output)){
    print(json_encode($output));
    exit();
}

$result = mysqli_query($db, $query);

if($result){
    if(mysqli_num_rows($result) > 0){
        $data = [];
        $output['success'] = true;
        while($row = mysqli_fetch_assoc($result)){
            $data[] = $row;
        }
        $output['data'] = $data;
    }
} else {
    $output['error'] = mysqli_error($db);
}

$json_output = json_encode($output);
print($json_output);
?>