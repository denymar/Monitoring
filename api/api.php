<?php
require_once "./idiorm.php";

session_start();

ORM::configure('mysql:host=localhost:3308;dbname=monitoring');
ORM::configure('username', 'root');
ORM::configure('password', '');

// ORM::get_db()->exec("DROP TABLE IF EXISTS users;");
// ORM::get_db()->exec(
//   'CREATE TABLE users (' .
//       'id INT PRIMARY KEY AUTO_INCREMENT,' .
//       'username VARCHAR(50) NOT NULL,' .
//       'password VARCHAR(50),' .
//       'UNIQUE KEY id (id),' .
//       'UNIQUE KEY username (username))'
// );
// create_user("admin", "pass", "mail@dot.com");
// create_user("admin3", "pass", "mail3@dot.com");
// create_user("admin2", "pass", "mail2@dot.com");

// ORM::get_db()->exec("DROP TABLE IF EXISTS buildings;");
// ORM::get_db()->exec(
//   'CREATE TABLE buildings (' .
//       'id INT PRIMARY KEY AUTO_INCREMENT,' .
//       'username_fk VARCHAR(50) NOT NULL,' .
//       'building VARCHAR(200),' .
//       'imageURL VARCHAR(200),' .
//       'FOREIGN KEY (username_fk) REFERENCES users(username),' .
//       'UNIQUE KEY id (id))'
// );
//
// ORM::get_db()->exec("DROP TABLE IF EXISTS floors;");
// ORM::get_db()->exec(
//   'CREATE TABLE floors (' .
//       'id INT PRIMARY KEY AUTO_INCREMENT,' .
//       'username_fk VARCHAR(50) NOT NULL,' .
//       'building_fk VARCHAR(200),' .
//       'floor VARCHAR(200),' .
//       'imageURL VARCHAR(200),' .
//       'FOREIGN KEY (username_fk) REFERENCES users(username),' .
//       'FOREIGN KEY (building_fk) REFERENCES buildings(building),' .
//       'UNIQUE KEY id (id))'
// );
//
// ORM::get_db()->exec("DROP TABLE IF EXISTS sensors;");
// ORM::get_db()->exec(
//   'CREATE TABLE sensors (' .
//       'id INT PRIMARY KEY AUTO_INCREMENT,' .
//       'username_fk VARCHAR(50) NOT NULL,' .
//       'building_fk VARCHAR(200),' .
//       'floor_fk VARCHAR(200),' .
//       'sensor VARCHAR(200),' .
//       'SN VARCHAR(200),' .
//       'type VARCHAR(50),' .
//       'topPercents INT,' .
//       'leftPercents INT,' .
//       'FOREIGN KEY (username_fk) REFERENCES users(username),' .
//       'FOREIGN KEY (building_fk) REFERENCES buildings(building),' .
//       'FOREIGN KEY (floor_fk) REFERENCES floors(floor),' .
//       'UNIQUE KEY id (id))'
// );

function removeDirectory($path) {
 	$files = glob($path . '/*');
	foreach ($files as $file) {
		is_dir($file) ? removeDirectory($file) : unlink($file);
	}
	rmdir($path);
 	return;
}

function create_user($username, $password) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  if (username_exists($username)) {
    $response['status'] = 'error';
    $response['message'] = 'This username already exists.';
  }

  if ($response['status'] == 'success') {
    $u = ORM::for_table('users')->create();
    $u->username = $username;
    $u->password = $password;
    $u->save();
    $response['message'] = 'User has been added.';
  }

  return $response;
}

function create_building($username, $building, $imageURL) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $b = ORM::for_table('buildings')->create();
  $b->username_fk = $username;
  $b->building = $building;
  $b->imageURL = $imageURL;
  $b->save();

  $response['message'] = 'Building has been saved to DB.';

  return $response;
}

function create_floor($username, $building, $floor, $imageURL) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $f = ORM::for_table('floors')->create();
  $f->username_fk = $username;
  $f->building_fk = $building;
  $f->floor = $floor;
  $f->imageURL = $imageURL;
  $f->save();

  $response['message'] = 'Floor has been saved to DB.';

  return $response;
}

function create_sensor($username, $building, $floor, $sensor, $sn, $type, $topP, $leftP) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $s = ORM::for_table('sensors')->create();
  $s->username_fk = $username;
  $s->building_fk = $building;
  $s->floor_fk = $floor;
  $s->sensor = $sensor;
  $s->SN = $sn;
  $s->type = $type;
  $s->topPercents = $topP;
  $s->leftPercents = $leftP;
  $s->save();

  $response['message'] = 'Sensor has been saved to DB.';

  return $response;
}

function sensor_exists($username, $building, $floor, $sensor, $sn) {
  $s = ORM::for_table('sensors')
  ->where(array(
    'username_fk' => $username,
    'building_fk' => $building,
    'floor_fk' => $floor,
    'sensor' => $sensor
  ))
  ->find_one();

  $s2 = ORM::for_table('sensors')
  ->where(array(
    'username_fk' => $username,
    'building_fk' => $building,
    'floor_fk' => $floor,
    'sensor' => $sensor
  ))
  ->find_one();

  if ($s != null || $s2 != null) {
    return true;
  } else {
    return false;
  }
}

function floor_exists($username, $building, $floor) {
  $f = ORM::for_table('floors')
  ->where(array(
    'username_fk' => $username,
    'building_fk' => $building,
    'floor' => $floor
  ))
  ->find_one();

  if ($f != null) {
    return true;
  } else {
    return false;
  }
}

function building_exists($username, $building) {
  $b = ORM::for_table('buildings')
  ->where(array(
    'username_fk' => $username,
    'building' => $building
  ))
  ->find_one();

  if ($b != null) {
    return true;
  } else {
    return false;
  }
}

function username_exists($username) {
  $u = ORM::for_table('users')->where('username', $username)->find_one();
  if ($u != null) {
    return true;
  } else {
    return false;
  }
}

function login_user($username, $password) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $u = ORM::for_table('users')->where(array(
    'username' => $username,
    'password' => $password
  ))
  ->find_one();

  if ($u != null) {
    $response['message'] = $username;
  } else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid username or password.';
  }

  return $response;
}

function rand_float($st_num=0,$end_num=1,$mul=1000000) {
  if ($st_num>$end_num) return false;
  return mt_rand($st_num*$mul,$end_num*$mul)/$mul;
}

function rand_temperature() {
  return rand_float(9, 32, 100);
}

function rand_pressure() {
  return rand_float(700, 850, 1);
}

function rand_humidity() {
  return rand_float(30, 99, 10);
}

function delete_sensor($username, $building, $floor, $sensor, $SN) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $s = ORM::for_table('sensors')
  ->where(array(
    'username_fk' => $username,
    'building_fk' => $building,
    'floor_fk' => $floor,
    'sensor' => $sensor,
    'SN' => $SN
  ))
  ->find_one();

  if ($s != null) {
    $s->delete();
    $response['message'] = 'This sensor was deleted.';
  } else {
    $response['status'] = 'error';
    $response['message'] = 'This sensor was NOT found.';
  }

  return $response;
}

function delete_floor($username, $building, $floor) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $f = ORM::for_table('floors')
  ->where(array(
    'username_fk' => $username,
    'building_fk' => $building,
    'floor' => $floor
  ))
  ->find_one();

  if ($f != null) {
    ORM::for_table('sensors')
    ->where(array(
      'username_fk' => $username,
      'building_fk' => $building,
      'floor_fk' => $floor
    ))
    ->delete_many();

    $f->delete();
    array_map('unlink', glob("uploads/{$username}/{$building}/{$floor}/*"));
    rmdir("uploads/{$username}/{$building}/{$floor}");

    $response['message'] = "The floor was removed.";
  } else {
    $response['status'] = "error";
    $response['message'] = "The floor was NOT found.";
  }

  return $response;
}

function delete_building($username, $building) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $b = ORM::for_table('buildings')
  ->where(array(

  ))
  ->find_one();

  if ($b != null) {
    ORM::for_table('sensors')
    ->where(array(
      'username_fk' => $username,
      'building_fk' => $building
    ))
    ->delete_many();

    ORM::for_table('floors')
    ->where(array(
      'username_fk' => $username,
      'building_fk' => $building
    ))
    ->delete_many();

    removeDirectory("uploads/{$username}/{$building}/");
    $b->delete();

    $response['message'] = 'The building was removed.';
  } else {
    $response['status'] = "error";
    $response['message'] = "The building was NOT found.";
  }

  return $response;
}

if (isset($_POST['delete-building'])) {
  if (isset($_SESSION['username'])) {
    $building = $_POST['building'];

    $response = delete_building($_SESSION['username'], $building);
    echo json_encode($response);
  }
}

if (isset($_POST['delete-floor'])) {
  if (isset($_SESSION['username'])) {
    $building = $_POST['building'];
    $floor = $_POST['floor'];

    $response = delete_floor($_SESSION['username'], $building, $floor);
    echo json_encode($response);
  }
}

if (isset($_POST['delete-sensor'])) {
  if (isset($_SESSION['username'])) {
    $building = $_POST['building-name'];
    $floor = $_POST['floor-name'];
    $sensor = $_POST['sensor'];
    $SN = $_POST['SN'];

    $response = delete_sensor($_SESSION['username'], $building, $floor, $sensor, $SN);
    echo json_encode($response);
  }
}

if (isset($_POST['update-sensors'])) {
  if (isset($_SESSION['username'])) {
    $response = array(
      'status' => 'success',
      'message' => ''
    );

    $sensors = $_POST['sensors'];
    foreach ($sensors as &$s) {
      if ($s['type'] == "temperature") {
        $s['value'] = rand_temperature();
      }
      if ($s['type'] == "pressure") {
        $s['value'] = rand_pressure();
      }
      if ($s['type'] == "humidity") {
        $s['value'] = rand_humidity();
      }
      $s['status'] = 'active';
    }
    $response['sensors'] = $sensors;
    $response['message'] = 'Update sensors.';
    echo json_encode($response);
  }
}

if (isset($_POST['load-floor'])) {
  if (isset($_SESSION['username'])) {
    $response = array(
      'status' => 'success',
      'message' => ''
    );

    $user = $_SESSION['username'];
    $building = $_POST['building'];
    $floor = $_POST['floor'];

    $sensors = ORM::for_table('sensors')
    ->where(array(
      "username_fk" => $user,
      "building_fk" => $building,
      "floor_fk" => $floor
    ))
    ->find_array();

    if ($sensors != null) {
      foreach ($sensors as &$s) {
        if ($s['type'] == "temperature") {
          $s['value'] = rand_temperature();
        }
        if ($s['type'] == "pressure") {
          $s['value'] = rand_pressure();
        }
        if ($s['type'] == "humidity") {
          $s['value'] = rand_humidity();
        }
        $s['status'] = 'active';
      }
      $response['sensors'] = $sensors;
      $response['message'] = 'Sensors were found.';
    } else {
      $response['status'] = 'error';
      $response['message'] = 'There was NOT found any sensor.';
    }

    echo json_encode($response);
  }
}

if (isset($_POST['add-sensor'])) {
  if (isset($_SESSION['username'])) {
    $response = array(
      'status' => 'success',
      'message' => ''
    );

    $user = $_SESSION['username'];
    $building = $_POST['building-name'];
    $floor = $_POST['floor-name'];
    $sensor_name = $_POST['sensor-name'];
    $sn = $_POST['sensor-sn'];
    $type = $_POST['type'];
    $top = $_POST['top'];
    $left = $_POST['left'];

    if (sensor_exists($user, $building, $floor, $sensor_name, $sn)) {
      $response['status'] = 'error';
      $response['message'] = 'This sensor exists on this floor';
    } else {
      create_sensor($user, $building, $floor, $sensor_name, $sn, $type, $top, $left);

      $response['message'] = 'Sensor was added.';

      $s = ORM::for_table('sensors')
      ->where(array(
        'username_fk' => $user,
        'building_fk' => $building,
        'floor_fk' => $floor,
        'sensor' => $sensor_name,
        'SN' => $sn
      ))
      ->find_one()
      ->as_array();

      if ($s != null) {
        $response['sensor'] = $s;
        if ($s['type'] == "temperature") {
          $response['sensor']['value'] = rand_temperature();
        }
        if ($s['type'] == "pressure") {
          $response['sensor']['value'] = rand_pressure();
        }
        if ($s['type'] == "humidity") {
          $response['sensor']['value'] = rand_humidity();
        }
        $response['sensor']['status'] = "active";
        $response['message'] = "Floor was found.";
      } else {
        $response['status'] = "error";
        $response['message'] = "Floor was NOT found.";
      }

    }
    echo json_encode($response);
  }
}

if (isset($_POST['add-floor'])) {
  if (isset($_POST['building-name']) && isset($_POST['floor-name']) && isset($_SESSION['username'])) {
    if (isset($_FILES['image-floor'])) {
      $response = array(
        'status' => 'success',
        'message' => ''
      );

      $user = $_SESSION['username'];
      $building_name = $_POST['building-name'];
      $floor_name = $_POST['floor-name'];
      $tmpName = $_FILES['image-floor']['tmp_name'];
      $parts = explode('.', $_FILES['image-floor']['name']);
      $ext = $parts[count($parts) - 1];
      $newName = $floor_name . '.' . $ext;
      $dest = "uploads/{$user}/{$building_name}/{$floor_name}/$newName";

      if (!file_exists("uploads/{$user}/")) {
        mkdir("uploads/{$user}", 0777, true);
      }

      if (!file_exists("uploads/{$user}/{$building_name}/")) {
        mkdir("uploads/{$user}/{$building_name}/", 0777, true);
      }

      if (!file_exists("uploads/{$user}/{$building_name}/{$floor_name}/")) {
        mkdir("uploads/{$user}/{$building_name}/{$floor_name}/", 0777, true);
      }

      if (floor_exists($user, $building_name, $floor_name)) {
        $response['status'] = 'error';
        $response['message'] = 'This floor exists in this building.';
      } else {
        create_floor($user, $building_name, $floor_name, $dest);
        $response['message'] = 'Floor was added.';
        move_uploaded_file($tmpName, $dest);

        $f = ORM::for_table('floors')
        ->where(array(
          'username_fk' => $user,
          'building_fk' => $building_name,
          'floor' => $floor_name
        ))
        ->find_one()
        ->as_array();

        if ($f != null) {
          $response['floor'] = $f;
          $response['message'] = "Floor was found.";
        } else {
          $response['status'] = "error";
          $response['message'] = "Floor was NOT found.";
        }
      }

      echo json_encode($response);
    }
  }
}

if (isset($_POST['add-building'])) {
  if (isset($_POST['name']) && isset($_SESSION['username'])) {
    if (isset($_FILES['image-building'])) {
      $response = array(
        'status' => 'success',
        'message' => ''
      );

      $user = $_SESSION['username'];
      $name = $_POST['name'];
      $tmpName = $_FILES['image-building']['tmp_name'];
      $parts = explode('.', $_FILES['image-building']['name']);
      $ext = $parts[count($parts) - 1];
      $newName = $name . '.' . $ext;
      $dest = "uploads/{$user}/{$name}/$newName";

      if (!file_exists("uploads/{$user}/")) {
        mkdir("uploads/{$user}", 0777, true);
      }

      if (!file_exists("uploads/{$user}/{$name}/")) {
        mkdir("uploads/{$user}/{$name}/", 0777, true);
      }

      if (building_exists($user, $name)) {
        $response['status'] = 'error';
        $response['message'] = 'This building exists.';
      } else {
        create_building($user, $name, $dest);
        $response['message'] = 'Building was added.';
        move_uploaded_file($tmpName, $dest);

        $b = ORM::for_table('buildings')
        ->where(array(
          'username_fk' => $user,
          'building' => $name
        ))
        ->find_one()
        ->as_array();

        if ($b != null) {
          $response['building'] = $b;
          $response['message'] = "Building was found.";
        } else {
          $response['status'] = "error";
          $response['message'] = "Building was NOT found.";
        }
      }

      echo json_encode($response);
    }
  }
}

if (isset($_POST["get-floors"]) && isset($_POST["building-name"])) {
  if (isset($_SESSION["username"])) {
    $response = array(
      'status' => 'success',
      'message' => ''
    );

    $user = $_SESSION["username"];
    $building = $_POST["building-name"];
    $f = ORM::for_table('floors')
    ->where(array(
      'username_fk' => $user,
      'building_fk' => $building
    ))
    ->find_array();

    if ($f != null) {
      $response['floors'] = $f;
      $response['message'] = "Floors were found.";
    } else {
      $response['status'] = "error";
      $response['message'] = "Floors were NOT found.";
    }

    echo json_encode($response);
  }
}

if (isset($_POST["get-buildings"])) {
  if (isset($_SESSION["username"])) {
    $response = array(
      'status' => 'success',
      'message' => ''
    );

    $user = $_SESSION["username"];

    $b = ORM::for_table('buildings')
    ->where('username_fk', $user)
    ->find_array();

    if ($b != null) {
      $response['buildings'] = $b;
      $response['message'] = "Buildings were found.";
    } else {
      $response['status'] = "error";
      $response['message'] = "Buildings were NOT found.";
    }

    echo json_encode($response);
  }
}

if (isset($_POST['submit-login'])) {
  // sleep(2);
  $u = $_POST['username'];
  $p = $_POST['password'];
  $response = login_user($u, $p);
  if ($response['status'] == 'success') {
    $_SESSION['username'] = $u;
  }
  echo json_encode($response);
}

if (isset($_POST['submit-signup'])) {
  // sleep(2);
  $u = $_POST['username'];
  $p = $_POST['password'];
  echo json_encode(create_user($u, $p));
}

if (isset($_POST['check-session'])) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  if (isset($_SESSION['username'])) {
    $response['message'] = $_SESSION['username'];
  } else {
    $response['status'] = 'error';
    $response['message'] = 'No username in current session.';
  }

  echo json_encode($response);
}

if (isset($_POST['logout-pressed'])) {
  $response = array(
    'status' => 'success',
    'message' => 'Logged out.'
  );

  session_unset();
  session_destroy();

  echo json_encode($response);
}

if (isset($_POST['request-db'])) {
  // sleep(2);
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  if (isset($_SESSION['username'])) {
    $db = ORM::for_table('events')
      ->where('username_fk', $_SESSION['username'])
      ->where('eYear', $_POST['selected-year'])
      ->where('eMonth', $_POST['selected-month'])
      ->order_by_asc('eDate')
      ->order_by_asc('eHour')
      ->order_by_asc('eMinute')
      ->find_array();
    $response['message'] = 'Database';
    $response['db'] = $db;
  } else {
    $response['status'] = 'error';
    $response['message'] = 'You are not logged in';
  }

  echo json_encode($response);
}

if (isset($_POST['add-log'])) {
  create_log(
    $_POST['username'],
    $_POST['year'],
    $_POST['month'],
    $_POST['day']
  );
}

if (isset($_POST['load-logs'])) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  $dates = $_POST['dates'];
  $ratings = array();

  foreach ($dates as $date) {
    $nrUsers = ORM::for_table('logs')
    ->where(array(
      'year' => $date['year'],
      'month' => $date['month'],
      'day' => $date['day']
    ))
    ->count();

    $ratings[] = array(
      'year' => $date['year'],
      'month' => $date['month'],
      'day' => $date['day'],
      'nrUsers' => $nrUsers
    );
  }

  $response['message'] = 'Logs are loaded.';
  $response['ratings'] = $ratings;

  echo json_encode($response);
}

if (isset($_POST['load-top-users'])) {
  $response = array(
    'status' => 'success',
    'message' => ''
  );

  ORM::raw_execute('SELECT users.username as username, COUNT(events.username_fk) as posts
                                FROM events
                                INNER JOIN users ON users.username=events.username_fk
                                GROUP BY users.username');

  $statement = ORM::get_last_statement();
  $topUsers = array();
  $rows = array();
  while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
      $topUsers[] = array(
        'username' => $row['username'],
        'posts' => $row['posts']
      );
  }

  usort($topUsers, 'cmp');

  $response['message'] = 'Top of users is loaded.';
  $response['topUsers'] = $topUsers;

  echo json_encode($response);
}

function cmp($a, $b) {
  return $b['posts'] - $a['posts'];
}

?>
