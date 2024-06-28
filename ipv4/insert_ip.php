<?php
$ip_address = $_SERVER['REMOTE_ADDR'];
$ipv4 = filter_var($ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);
$ipv6 = filter_var($ip_address, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6);

$mysqli = new mysqli("localhost", "admin", "admin", "ip_addresses");
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

$sql = "INSERT INTO visitors (ipv4, ipv6) VALUES ('$ipv4', '$ipv6') 
        ON DUPLICATE KEY UPDATE visit_time = CURRENT_TIMESTAMP";
if ($mysqli->query($sql) === TRUE) {
    echo "";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}

$mysqli->close();
?>
