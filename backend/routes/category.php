<?php

$app->get('/api/users', function ($request, $response, $args) {  //GET example

    $pdo =$this->pdo;
    $selectStatement = $pdo->prepare("SELECT * FROM users U");
	$selectStatement->execute();
	$users = $selectStatement->fetchAll();

	$res['success'] = true;
	$res['data'] = $users;
	$response->write(json_encode($res));
	$pdo = null;
	return $response;
});

$app->get('/api/usersbyevent/[{event}]', function ($request, $response, $args) {  //GET example

    $pdo =$this->pdo;
    $selectStatement = $pdo->prepare("SELECT U.name FROM users U JOIN users_events UE ON (UE.users_id = U.id) WHERE UE.events_id = ?");
	$selectStatement->execute(array($args['event']));
	$users = $selectStatement->fetchAll();

	$res['success'] = true;
	$res['data'] = $users;
	$response->write(json_encode($res));
	$pdo = null;
	return $response;
});


$app->get('/api/events/[{user}]', function ($request, $response, $args) {  //GET example

    $pdo =$this->pdo;
    $selectStatement = $pdo->prepare("SELECT * FROM events E JOIN users_events UE ON (UE.events_id = E.id) WHERE UE.users_id = ?");
	$selectStatement->execute(array($args['user']));
	$events = $selectStatement->fetchAll();

	$res['success'] = true;
	$res['data'] = $events;
	$response->write(json_encode($res));
	$pdo = null;
	return $response;
});

$app->get('/api/events/priority/[{priority}]', function ($request, $response, $args) {  //GET example


	$priorities = (explode("&", $args['priority']));
	if(sizeof($priorities) == 2){
		$pdo =$this->pdo;
		$selectStatement = $pdo->prepare("SELECT * FROM events E JOIN users_events UE ON (UE.events_id = E.id) WHERE E.className = ? AND UE.users_id = ?");
		$selectStatement->execute(array($priorities[1], $priorities[0]));
		$events = $selectStatement->fetchAll();
	}
	else{
		$pdo =$this->pdo;
		$selectStatement = $pdo->prepare("SELECT * FROM events E JOIN users_events UE ON (UE.events_id = E.id) WHERE (E.className = ? OR E.className = ?) AND UE.users_id = ?");
		$selectStatement->execute(array($priorities[1], $priorities[2], $priorities[0]));
		$events = $selectStatement->fetchAll();
	}

	$res['success'] = true;
	$res['data'] = $events;

	return json_encode($res);
});

 $app->post('/api/addevent', function ($request, $response, $args) { //POST example

 	$pdo =$this->pdo;
	$params = $request->getParsedBody();

	// GET THE LAST ID IN DATABASE
	$selectStatement = $pdo->select()
		->from('events')
		->orderBy('id', 'DESC')
		->limit(1);

	$stmt = $selectStatement->execute();
	$data = $stmt->fetch();
	
	$insertStatement = $pdo->insert(array('id', 'className', 'start', 'end', 'detail', 'content'))
   							->into('events')
							->values( array($data['id']+1, $params['className'], $params['startDate'], $params['endDate'] , $params['detail'], $params['content']));
	$insertEvent = $insertStatement->execute(false);

	$users = explode("|", $params['users']);
	
	foreach($users as $user){
		
		$selectStatement = $pdo->prepare("SELECT * FROM users U where U.name = ? ");
						  $selectStatement->execute(array($user));
		$user_id = $selectStatement->fetchAll();


		$insertStatement = $pdo->insert(array('events_id', 'users_id'))
   							->into('users_events')
							->values(array($data['id']+1, $user_id[0]['id']));
		$insertUserEvent = $insertStatement->execute();
		
	}

	$res['id'] = $data['id']+1;
	$res['success'] = true; 

	return json_encode($res);

	
});


$app->delete('/api/deleteevent/[{id}]', function ($request, $response, $args) {
	// Delete book identified by $args['id']

	$pdo =$this->pdo;

	if($args['id'] != 'all')
	{
	$deleteStatement = $pdo->delete()
						->from('events')
						->where('id', '=', $args['id']);
	}

	else
	{
	$deleteStatement = $pdo->delete()
					   ->from('events');
	}
                       

	$affectedRows = $deleteStatement->execute();

	$form['success'] = $args['true']; 
	$form['id'] = $args['id']; 

	return json_encode($form);

});

$app->patch('/api/changeeventdates/[{id}]', function ($request, $response, $args) {
	// Delete book identified by $args['id']

	$pdo =$this->pdo;
	$params = $request->getParsedBody();

	$updateStatement = $pdo->update(array('start' => $params['startDate'], 'end' => $params['endDate']))
                       ->table('events')
                       ->where('id', '=', $args['id']);

	$affectedRows = $updateStatement->execute();

	return json_encode(true);


});


$app->patch('/api/changeevent/[{id}]', function ($request, $response, $args) {
	// Delete book identified by $args['id']

	$pdo =$this->pdo;
	$params = $request->getParsedBody();

	$updateStatement = $pdo->update(array('detail' => $params['detail'], 'content' => $params['content'], 'start' => $params['startDate'], 'end'=> $params['endDate'], 'className' => $params['className']))
                       ->table('events')
                       ->where('id', '=', $args['id']);

	$affectedRows = $updateStatement->execute();

	$deleteStatement = $pdo->delete()
					   ->from('users_events')
					   ->where('events_id', '=', $args['id']);

	$affectedRows = $deleteStatement->execute();

	
	$users = explode("|", $params['users']);
	
	foreach($users as $user){

		
		$selectStatement = $pdo->prepare("SELECT * FROM users U where U.name = ? ");
						  $selectStatement->execute(array($user));
		$user_id = $selectStatement->fetchAll();


		$insertStatement = $pdo->insert(array('events_id', 'users_id'))
   							->into('users_events')
							->values(array($args['id'], $user_id[0]['id']));
		$insertUserEvent = $insertStatement->execute();
		
	}
	

	$form['id'] = $args['id']; 
	$form['users'] = $users;
	$form['user_id'] = $user_id;
	$form['resultado'] = $user_id[0]['id'];

	return json_encode($form);

});

?>
