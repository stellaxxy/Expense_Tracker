<?php
require_once('mysqlcredentials.php');

$output = [
    'success' => 'false'
];

$query = "SELECT `id`, `type`, `date`, `vendor`, `city`, `state`, `amount`, `currency`, `paymentMethod`, `comment` FROM `expenses`";

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