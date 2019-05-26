<?php
require_once('mysqlcredentials.php');

$output = [
    'success' => false
];

if(empty($_POST['expense_idArr'])){
    $output['errors'] = 'No id is selected';
}
$expense_idArr = [];
foreach($_POST['expense_idArr'] as $id){
    if(is_numeric($id)){
        $expense_idArr[] = $id;
    } else {
        $output['errors']  = 'Id has to be a number';
    }
}
if(array_key_exists('errors', $output)){
    print(json_encode($output));
    exit();
}

$all_id = implode(',', $expense_idArr);
$query = "DELETE FROM `expenses` WHERE `id` IN ($all_id)";

$result = mysqli_query($db, $query);

if($result){
    if(mysqli_affected_rows($db) === count($expense_idArr)){
        $output['success']=true;
    } else {
        $output['errors'] = 'Could not delete all the selected expenses';
    }
} else {
    $output['errors'] = mysqli_error($db);
}

$json_output = json_encode($output);
print($json_output);
?>