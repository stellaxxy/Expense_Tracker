<?php
require_once('mysqlcredentials.php');

$expense_id = intval($_POST['expense_id']);
$output = [
    'success' => false
];

$query = "DELETE FROM `expenses` WHERE `id` = $expense_id";

$result = mysqli_query($db, $query);

if($result){
    if(mysqli_affected_rows($db) === 1){
        $output['success']=true;
    } else {
        $output['error'] = 'Could not delete expense';
    }
} else {
    $output['error'] = mysqli_error($db);
}

$json_output = json_encode($output);
print($json_output);
?>