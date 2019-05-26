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

if(array_key_exists('searchType', $_POST)&&array_key_exists('searchValue', $_POST)){
    foreach($_POST as $key=>$value){
        $_POST[$key] = addslashes($value);
    }

    if($_POST['searchType'] === 'type' || $_POST['searchType'] === 'city' || $_POST['searchType'] === 'year'){
        $query = "$query WHERE {$_POST['searchType']} = '{$_POST['searchValue']}'";
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