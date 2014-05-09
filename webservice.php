<?php

$callback = mysql_real_escape_string($_GET['callback']);
$link = mysql_connect("localhost","DB_User","Password") or die($callback."(".json_encode("Cannot connect to the server!").")");
mysql_select_db("DB_Name",$link) or die($callback."(".json_encode("Cannot connect to the database!").")");

$method = mysql_real_escape_string($_GET['method']);
switch ($method)
{
	case getFact:
		getFact();
		break;
	case setFact:
		setFact();
		break;
	case getSurveyForEdit:
		getSurveyForEdit();
		break;
	case getSurveyForTest:
		getSurveyForTest();
		break;
	case getSurveyCodes:
		getSurveyCodes();
		break;
	case setSurvey:
		setSurvey();
		break;
	case getAgeList:
		getAgeList();
		break;
	case getCityStateList:
		getCityStateList();
		break;
	case getEthnicityList:
		getEthnicityList();
		break;
	case getGenderList:
		getGenderList();
		break;
	case setUser:
		setUser();
		break;
	case test:
		test();
		break;
	default:
		die($callback."(".json_encode("Could not find the specified method!").")");
}

@mysql_close($link);

function getFact()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$code = mysql_real_escape_string($_GET['code']);
	if($code == "") die($callback."(".json_encode("No code found!").")");
	$query = "SELECT s.SURVEY_TITLE, cd.CARD_DESC, ct.CATEGORY_DESC FROM FACT_TABLE f INNER JOIN CARD_TABLE cd ON cd.CARD_ID = f.CARD_ID INNER JOIN CATEGORY_TABLE ct ON ct.CATEGORY_ID = f.CATEGORY_ID INNER JOIN USER_TABLE u ON f.USER_ID = u.USER_ID INNER JOIN SURVEY_TABLE s ON s.SURVEY_ID = f.SURVEY_ID AND s.SURVEY_CODE='".$code."'";
	$gender = mysql_real_escape_string($_GET['gender']);
	if($gender != "")
	{
		$query = $query." INNER JOIN GENDER_TABLE g ON g.GENDER_ID = u.GENDER_ID AND g.GENDER_DESC='".$gender."'";
	}
	$age = mysql_real_escape_string($_GET['age']);
	if($age != "")
	{
		$query = $query." INNER JOIN AGE_TABLE a ON a.AGE_ID = u.AGE_ID AND a.AGE_DESC='".$age."'";
	}
	$ethnicity = mysql_real_escape_string($_GET['ethnicity']);
	if($ethnicity != "")
	{
		$query = $query." INNER JOIN ETHNICITY_TABLE e ON e.ETHNICITY_ID = u.ETHNICITY_ID AND e.ETHNICITY_DESC='".$ethnicity."'";
	}
	$city = mysql_real_escape_string($_GET['city']);
	$state = mysql_real_escape_string($_GET['state']);
	if($city == "" && $state != "")
	{
		$query = $query." INNER JOIN CITY_STATE_TABLE cs ON cs.CITY_STATE_ID = u.CITY_STATE_ID AND cs.STATE_DESC='".$state."'";
	}
	else if($city != "" && $state != "")
	{
		$query = $query." INNER JOIN CITY_STATE_TABLE cs ON cs.CITY_STATE_ID = u.CITY_STATE_ID AND cs.STATE_DESC='".$state."' AND cs.CITY_DESC='".$city."'";
	}
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function setFact()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$card = mysql_real_escape_string($_GET['card']);
	if($card == "") die($callback."(".json_encode("No card found!").")");
	$query = "SELECT CARD_ID FROM CARD_TABLE WHERE CARD_DESC='".$card."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$cardId = $row['CARD_ID'];
	}
	if(is_null($cardId))
	{
		$query = "INSERT INTO CARD_TABLE (CARD_DESC) VALUES ('".$card."')";
		mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
		$query = "SELECT CARD_ID FROM CARD_TABLE WHERE CARD_DESC='".$card."'";
		$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
		while($row = mysql_fetch_array($result))
		{
			$cardId = $row['CARD_ID'];
		}
	}
	$category = mysql_real_escape_string($_GET['category']);
	if($category == "") die($callback."(".json_encode("No category found!").")");
	$query = "SELECT CATEGORY_ID FROM CATEGORY_TABLE WHERE CATEGORY_DESC='".$category."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$categoryId = $row['CATEGORY_ID'];
	}
	if($categoryId == "")
	{
		$query = "INSERT INTO CATEGORY_TABLE (CATEGORY_DESC) VALUES ('".$category."')";
		mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
		$query = "SELECT CATEGORY_ID FROM CATEGORY_TABLE WHERE CATEGORY_DESC='".$category."'";
		$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
		while($row = mysql_fetch_array($result))
		{
			$categoryId = $row['CATEGORY_ID'];
		}
	}
	$code = mysql_real_escape_string($_GET['code']);
	if($code == "") die($callback."(".json_encode("No code found!").")");
	$query = "SELECT SURVEY_ID, EDITABLE_IDEN FROM SURVEY_TABLE WHERE SURVEY_CODE='".$code."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$surveyId = $row['SURVEY_ID'];
		$editable = $row['EDITABLE_IDEN'];
	}
	if($editable == 1)
	{
		$query = "UPDATE SURVEY_TABLE SET EDITABLE_IDEN=0 WHERE SURVEY_ID=".$surveyId;
		mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	}
	$userId = mysql_real_escape_string($_GET['userId']);
	if($userId == "") $userId = 1;
	$query = "INSERT INTO FACT_TABLE (CARD_ID, CATEGORY_ID, SURVEY_ID, USER_ID) VALUES (".$cardId.", ".$categoryId.", ".$surveyId.", ".$userId.")";
	mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	echo $callback."(".json_encode("Set fact successful!").")";
}

function getSurveyForEdit()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$password = mysql_real_escape_string($_GET['password']);
	if($password == "") die($callback."(".json_encode("No password found!").")");
	$code = mysql_real_escape_string($_GET['code']);
	if($code == "") die($callback."(".json_encode("No code found!").")");
	$query = "SELECT DEMOGRAPHICS_IDEN, EDITABLE_IDEN, SURVEY_TITLE, SURVEY_EMAIL, SURVEY_COMMENTS, SURVEY_CARDS, SURVEY_CATEGORIES FROM SURVEY_TABLE WHERE SURVEY_PASS='".$password."' AND SURVEY_CODE='".$code."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function getSurveyForTest()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$code = mysql_real_escape_string($_GET['code']);
	if($code == "") die($callback."(".json_encode("No code found!").")");
	$query = "SELECT DEMOGRAPHICS_IDEN, SURVEY_TITLE, SURVEY_EMAIL, SURVEY_COMMENTS, SURVEY_CARDS, SURVEY_CATEGORIES FROM SURVEY_TABLE WHERE SURVEY_CODE='".$code."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function getSurveyCodes()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$query = "SELECT SURVEY_CODE FROM SURVEY_TABLE";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function setSurvey()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$demographics = mysql_real_escape_string($_GET['demographics']);
	if($demographics == "") $demographics = 1;
	$code = mysql_real_escape_string($_GET['code']);
	if($code == "") die($callback."(".json_encode("No code found!").")");
	$password = mysql_real_escape_string($_GET['password']);
	$email = mysql_real_escape_string($_GET['email']);
	$title = mysql_real_escape_string($_GET['title']);
	$comments = mysql_real_escape_string($_GET['comments']);
	$cards = mysql_real_escape_string($_GET['cards']);
	$categories = mysql_real_escape_string($_GET['categories']);
	$query = "SELECT SURVEY_ID FROM SURVEY_TABLE WHERE SURVEY_CODE='".$code."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$surveyId = $row['SURVEY_ID'];
	}
	if($surveyId == "")
	{
		$query = "INSERT INTO SURVEY_TABLE (DEMOGRAPHICS_IDEN, EDITABLE_IDEN, SURVEY_CODE, SURVEY_PASS, SURVEY_EMAIL, SURVEY_TITLE, SURVEY_COMMENTS, SURVEY_CARDS, SURVEY_CATEGORIES) VALUES (".$demographics.", 1, '".$code."', '".$password."', '".$email."', '".$title."', '".$comments."', '".$cards."', '".$categories."')";
	}
	else
	{
		$query = "UPDATE SURVEY_TABLE SET DEMOGRAPHICS_IDEN=".$demographics.", SURVEY_PASS='".$password."', SURVEY_EMAIL='".$email."', SURVEY_TITLE='".$title."', SURVEY_COMMENTS='".$comments."', SURVEY_CARDS='".$cards."', SURVEY_CATEGORIES='".$categories."' WHERE SURVEY_ID=".$surveyId;
	}
	mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	echo $callback."(".json_encode("Set survey successful!").")";
}

function getAgeList()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$query = "SELECT AGE_DESC FROM AGE_TABLE";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function getCityStateList()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$query = "SELECT CITY_DESC, STATE_DESC FROM CITY_STATE_TABLE";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function getEthnicityList()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$query = "SELECT ETHNICITY_DESC FROM ETHNICITY_TABLE";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function getGenderList()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$query = "SELECT GENDER_DESC FROM GENDER_TABLE";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	$table = array();
	while($row = mysql_fetch_assoc($result))
	{
		$table[] = array("row"=>$row);
	}
	echo $callback."(".json_encode(array("table"=>$table)).")";
}

function setUser()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	$gender = mysql_real_escape_string($_GET['gender']);
	if($gender == "") $gender = "UNKNOWN";
	$query = "SELECT GENDER_ID FROM GENDER_TABLE WHERE GENDER_DESC='".$gender."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$genderId = $row['GENDER_ID'];
	}
	$age = mysql_real_escape_string($_GET['age']);
	if($age == "") $age = "UNKNOWN";
	$query = "SELECT AGE_ID FROM AGE_TABLE WHERE AGE_DESC='".$age."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$ageId = $row['AGE_ID'];
	}
	$ethnicity = mysql_real_escape_string($_GET['ethnicity']);
	if($ethnicity == "") $ethnicity = "UNKNOWN";
	$query = "SELECT ETHNICITY_ID FROM ETHNICITY_TABLE WHERE ETHNICITY_DESC='".$ethnicity."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$ethnicityId = $row['ETHNICITY_ID'];
	}
	$city = mysql_real_escape_string($_GET['city']);
	if($city == "") $city = "UNKNOWN";
	$state = mysql_real_escape_string($_GET['state']);
	if($state == "") $state = "UNKNOWN";
	$query = "SELECT CITY_STATE_ID FROM CITY_STATE_TABLE WHERE CITY_DESC='".$city."' AND STATE_DESC='".$state."'";
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$cityStateId = $row['CITY_STATE_ID'];
	}
	$query = "SELECT USER_ID FROM USER_TABLE WHERE GENDER_ID=".$genderId." AND AGE_ID=".$ageId." AND ETHNICITY_ID=".$ethnicityId." AND CITY_STATE_ID=".$cityStateId;
	$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
	while($row = mysql_fetch_array($result))
	{
		$userId = $row['USER_ID'];
	}
	if($userId == "")
	{
		$query = "INSERT INTO USER_TABLE (GENDER_ID, AGE_ID, ETHNICITY_ID, CITY_STATE_ID) VALUES (".$genderId.", ".$ageId.", ".$ethnicityId.", ".$cityStateId.")";
		mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
		$query = "SELECT USER_ID FROM USER_TABLE WHERE GENDER_ID=".$genderId." AND AGE_ID=".$ageId." AND ETHNICITY_ID=".$ethnicityId." AND CITY_STATE_ID=".$cityStateId;
		$result = mysql_query($query) or die($callback."(".json_encode("Query at database failed! ".$query).")");
		while($row = mysql_fetch_array($result))
		{
			$userId = $row['USER_ID'];
		}
	}
	echo $callback."(".json_encode("Set user successful! USER_ID=".$userId).")";
}

function test()
{
	$callback = mysql_real_escape_string($_GET['callback']);
	echo $callback."(".json_encode("Test function is successful!").")";
}

?>
