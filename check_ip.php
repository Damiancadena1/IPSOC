<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$ip = $_GET['ip'];
$API_KEY = 'f7dfb5038b0ba482b768cc4672342df1bb4a673dd39577f815b68dbf14f68a3f2578c21200175c23';
$url = "https://api.abuseipdb.com/api/v2/check?ipAddress={$ip}";

$options = array(
  'http' => array(
    'header' => "Key: {$API_KEY}\r\nAccept: application/json\r\n",
    'method' => 'GET',
  ),
);

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
  http_response_code(500);
  echo json_encode(array('message' => 'Error al consultar el API de AbuseIPDB'));
} else {
  echo $result;
}
?>
