var household = (function () {
	// Private Variables 	
	// initializing DB and ID Generator
	var	householdId = localStorage.getItem( 'householdId' ) || localStorage.setItem( 'householdId', 1 ),
		householdDb = JSON.parse(localStorage.getItem( 'householdDb' ) || '[]' ),

		// Fetching DOM Elements
		age = document.querySelector( '#age' ),
		relationship = document.querySelector( '#relationship' ),
		smoker = document.querySelector( '#smoker' ),
		storeDataBtn = document.querySelector( '#storeData' ),
		updateDataBtn = document.querySelector( '#updateData' ),		
		status = document.querySelector( '#status' ),
		list = document.querySelector( '#householdList' ),
		debug = document.querySelector( '#debug' );
		
	// Private Methods
	function statusReset () {
		setTimeout(function () {
			status.innerHTML = "";
		}, 10000);
	}
	
	function storeData () {
		if ( (age.value > 0) && (relationship.value !== null || relationship.value !== "")) {	
			var enter = { 
				id: parseInt( localStorage.getItem( 'householdId' ) ),
			 	age: age.value,
				relationship: relationship.value,
				smoker: (smoker.checked  ? "Yes":"No") };
			householdDb.push( enter );
			householdIdGenerator = parseInt( JSON.parse(localStorage.getItem( 'householdId' ))) + 1;
			localStorage.setItem( 'householdId', JSON.stringify( householdIdGenerator ));
			localStorage.setItem( 'householdDb', JSON.stringify( householdDb ));
			status.innerHTML = "Input stored successfully";
			age.value = "";
			relationship.value = "";
			smoker.value = "";
			statusReset();
			setList();
		} else {
			status.innerHTML = "Please provide correct details for age and relationship";
			statusReset();
			return false;
		}
	}

	function setList () {			
		if(localStorage.getItem('householdDb') && localStorage.getItem('householdDb').length){
			
			debug.innerHTML = localStorage.getItem( 'householdDb' );//serialized JSON displayed in "debug" DOM element			
			var countDb = JSON.parse(localStorage.getItem('householdDb')).length, householdDb;
		
			if(countDb > 0){
				var individualData = "<h3>Household Details</h3>";				
					individualData += "<ol>";
					individualData += "<li><span>Age</span><span>Relationship</span><span>Smoker</span><span>Edit/Delete</span></li>";
					//Adding household individual details
					for ( var i = 0; i < countDb; i += 1 ) {							
						individualData += "<li>";
						individualData += "<span id='data-age-"+ i + "' contenteditable='true' maxlength=35>";
						individualData += JSON.parse(localStorage.getItem('householdDb'))[i].age;
						individualData += "</span>";
						individualData += "<span id='data-relationship-"+ i + "' contenteditable='true' maxlength=35>";
						individualData += JSON.parse(localStorage.getItem('householdDb'))[i].relationship;
						individualData += "</span>";
						individualData += "<span id='data-smoker-"+ i + "' contenteditable='true' maxlength=35>";
						individualData += JSON.parse(localStorage.getItem('householdDb'))[i].smoker;
						individualData += "</span>";
						individualData += "<span>";
						individualData += "<a onClick='household.update("+i+");' class='link edit'>Edit</a>";
						individualData += "<a onClick='household.remove("+i+");' class='link delete'>Delete</a>";
						individualData += "</span>";
						individualData += "</li>";
					}
					individualData += "</ol>";
					list.innerHTML = individualData;
					
			}
		} 
		
	}
	
	function removeData ( key ) {
		var completeData = JSON.parse( localStorage.getItem( 'householdDb' ) );
		completeData.splice( key, 1 );
		localStorage.setItem( 'householdDb', JSON.stringify( completeData ) );
		window.location.reload();
		status.innerHTML = "Data was successfully remove!";
		setList();
	}

	function updateData ( key ) {	
	
		window.scrollTo(0,0);
		var smokes = document.getElementById( 'data-smoker-' + key ).innerHTML;	
	
		age.value = document.getElementById( 'data-age-' + key ).innerHTML;
		relationship.value = document.getElementById( 'data-relationship-' + key ).innerHTML;
		smoker.checked = (smokes.toUpperCase() == "YES")?true:false;		
		storeDataBtn.disabled= true;
		updateDataBtn.disabled= false;
		
		updateDataBtn.onclick = function(){
			var completeData = JSON.parse( localStorage.getItem( 'householdDb' ) );
			smoker = (smoker.checked)?"yes":"no";		
			var updatedData = { 
				age: age.value,
				relationship: relationship.value,
				smoker: smoker,
			};
				completeData.splice( key, 1, updatedData );
				localStorage.setItem( 'householdDb', JSON.stringify( completeData ) );
				status.innerHTML = "Details successfully updated";			
				statusReset();
				setList();
			}
		
	}

	// Public Variables and Methods
	return {
		init: setList,
		remove: removeData,
		update: updateData,

		// Event Handlers
		storeDataClick: storeDataBtn.onclick = storeData,
	};

})();

household.init();
