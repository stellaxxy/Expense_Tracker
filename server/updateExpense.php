<?php
require_once('mysqlcredentials.php');

$output = [
    'success' => false,
    'error' => []
];

foreach($_POST as $key => $value){
    $_POST[$key] = addslashes($value);
}

if(strlen($_POST['type'] === 0)){
    $output['error'][] = 'Must choose a type.';
}
if(!is_numeric($_POST['amount'])){
    $output['error'][] = 'Amount must be a number.';
}
if(!is_numeric($_POST['id'])){
    $output['error'][] = 'Id must be a number.';
}

if(!empty($output['error'])){
    print(json_encode($output));
    exit();
}

$_POST['type'] = strtoupper($_POST['type']);
$_POST['city'] = ucwords($_POST['city']);
$_POST['vendor'] = ucwords($_POST['vendor']);
$_POST['state'] = strtoupper($_POST['state']);

$query = "UPDATE `expenses` SET `type`='{$_POST['type']}', `date`='{$_POST['date']}', `vendor`='{$_POST['vendor']}', `city`='{$_POST['city']}', `state`='{$_POST['state']}', `amount`='{$_POST['amount']}', `currency`='{$_POST['currency']}', `paymentMethod`='{$_POST['paymentMethod']}', `comment`='{$_POST['comment']}' WHERE `id`={$_POST['id']}";

$result = mysqli_query($db, $query);

if($result){
    if(mysqli_affected_rows($db) === 1){
        $output['success'] = true;
    } else {
        $output['error'][] = 'Could not update selected expense.';
    }
}else{
    $output['error'][] = mysqli_error($db);
}

$json_output = json_encode($output);
print($json_output);
?>