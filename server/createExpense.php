<?php
require_once('mysqlcredentials.php');

$output = [
    'success' => false,
    'error' => []
];

foreach($_POST as $key=>$value){
    $_POST[$key] = addslashes($value);
}

if(strlen($_POST['type']) === 0){
    $output['error'][] = 'Must choose a type';
}
if(!is_numeric($_POST['amount'])){
    $output['error'][] = 'Amount must be a number';
} else {
    $_POST['amount'] = floatval($_POST['amount']);
}

if(!empty($output['error'])){
    print(json_encode($output));
    exit();
}

$_POST['type'] = strtoupper($_POST['type']);
$_POST['city'] = ucfirst($_POST['city']);
$_POST['state'] = strtoupper($_POST['state']);

$query = "INSERT INTO `expenses` SET `type`='{$_POST['type']}', `date`='{$_POST['date']}', `vendor`='{$_POST['vendor']}', `city`='{$_POST['city']}', `state`='{$_POST['state']}', `amount`='{$_POST['amount']}', `currency`='{$_POST['currency']}', `paymentMethod`='{$_POST['paymentMethod']}', `comment`='{$_POST['comment']}'";

$result = mysqli_query($db, $query);
if($result){
    $output['success'] = true;
    $output['new_id'] = mysqli_insert_id($db);
} else {
    $output['error'][] = mysqli_error($db);
}

$json_output = json_encode($output);
print($json_output);
?>