let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];
var difficulty;
var category;
var amount;
var type;
var question;
var answer;
var countQuestions = 0;
var countWrongAnswers = 0;
var countCorrectAnswers = 0;
var countTries = 0;
var answerArr = [];

// this function let the elements in your html to load first.
$(document).ready(function () { 
    // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
	// please note that in order to operate the function, in your html there should be a select element that hold the id categories.
	getCategories($("#categories"));
	$(chooseGame).hide();
});

async function start(){ 
	// questionsArray is the global array that recieves the questions from the mock DB function named getQuestion
	// getQuestion USAGE: returns an array of questions, recieves (amount, category , difficulty,type) all of the function parameters should be sent as a string!
	// amount = the number of questions you want to recieve
	// category = the category of the questions 9-32
	// difficulty = easy, medium, hard
	// type = multipile , boolean
	// getQuestion is an async function. in order to use it you have to use the keyword await.
	questionsArray =  await getQuestion(amount , category , difficulty , type);
	console.log(questionsArray);
	playGame();
}

//Goes back to Main Menu
function goBack(){
	$(chooseGame).hide();
	$(beforeGame).show();
}

//Shows game rules
function gameRules(){
	window.alert("Welcome to Yarin's & Nitzan's Trivia Game !\nThere are no rules.")
}
//Clears the screen from before
function removeBefore(){
	//Clears the score board
	document.getElementById("showScore").innerHTML = "";
	//Deletes the Question (JQUERY)
	$(".questions").remove();
	//Deletes the answers
	const elements = document.getElementsByClassName("answers");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
	//Clears the array of answers
	answerArr = [];
}

//Restarts the game
function restartGame(){
	//Sets counters to zero
	countQuestions = 0;
	countWrongAnswers = 0;
	countCorrectAnswers = 0;
	countTries = 0;
	//Clears elements and starts a new game
	removeBefore();
	startGame();
}

//Shows points and restarts game
function showPoints(){
  	if (confirm(`Great Work, You Got ${countCorrectAnswers*10}/${countQuestions*10} Points !\n Restart ?`)) {
		restartGame();
  	}
	else {
    	window.alert("See You Soon !");
  	}
}

//Checks for correct answer and counts if correct or not
function checkCorrect(answer, element){
	//checks if the user's answer is correct
	if(answer == questionsArray[countQuestions].correct_answer){
		element.style.backgroundColor = "lightgreen";
		console.log("CORRECT");
		countCorrectAnswers++;
		countQuestions++;
	}
	else{
		element.style.backgroundColor = "red";
		//Gets all the answers paragraphs and seeks for the one with the correct answer
		//then it colors the correct answer (only if the user was wrong)
		for(let i = 0; i< 4; i++){
			if(document.getElementById("gaming").getElementsByClassName("answers")[i].innerText
			== questionsArray[countQuestions].correct_answer){
				document.getElementById("gaming").getElementsByClassName("answers")[i].style.backgroundColor = "lightgreen";
				break;
			}
		}
		console.log("FALSE");
		countWrongAnswers++;
		countQuestions++;
	}
	//checks for 3 wrong answers
	if(countWrongAnswers == 3){
		window.alert("You Got 3 Questions Wrong!\nYou Have Lost !\nGame Over");
		restartGame();
		return;
	}
	//checks if the game has finished
	if(countQuestions == questionsArray.length){
		showPoints();
		return;
	}
	//Timeouts to color if the answer chosen was correct/wrong
	setTimeout(() => {  removeBefore(); }, 1000);
	setTimeout(() => {  playGame(); }, 1000);

}

//Creates p tags for each question & answers, with a class and an onclick event for each answer
function playGame(){
	//Creates paragraph for the question, and puts the question there
	var newQuestionPara = document.createElement("P");
	newQuestionPara.innerHTML = questionsArray[countQuestions].question;
	newQuestionPara.classList.add("questions");
  	document.getElementById("gaming").appendChild(newQuestionPara);
	if(type == "multiple"){
		answerArr = getAnswers(); // get the answers in an array
		for(let i = 0; i < 4; i++){
			//Creates the answers paragraph
			var answerP = document.createElement("P");
			answerP.classList.add("answers");
			answerP.setAttribute("onclick", "checkCorrect(this.innerText, this)");
			answerP.innerHTML = answerArr[i];
			document.getElementById("gaming").appendChild(answerP);
		}
	}
	else if (type == "boolean"){
			var answerP = document.createElement("P");
			answerP.classList.add("answers");
			answerP.setAttribute("onclick", "checkCorrect(this.innerText, this)");
			answerP.innerHTML = "True";
			document.getElementById("gaming").appendChild(answerP);
			var answerP = document.createElement("P");
			answerP.classList.add("answers");
			answerP.setAttribute("onclick", "checkCorrect(this.innerText, this)");
			answerP.innerHTML = "False";
			document.getElementById("gaming").appendChild(answerP);
	   }
	//Shows the Score
	if(countTries == 0){
		var showScore = document.createElement("P");
		showScore.innerHTML = "Score: "+countCorrectAnswers*10 + "/" + amount*10+"\n"+countWrongAnswers;
		showScore.classList.add("showScorePara");
		document.getElementById("showScore").appendChild(showScore);
	}
	document.getElementById("showScore").innerHTML = "Score : "+countCorrectAnswers*10 + "/" + amount*10+"<br>"+"Wrong Answers : "+countWrongAnswers+"/3";
	countTries++;
}

//Put all the answers together in an array
function getAnswers(){
	answerArr.push(questionsArray[countQuestions].correct_answer);
	for(let i = 0; i < 3; i++){
		answerArr.push(questionsArray[countQuestions].incorrect_answers[i]);
	}
	shuffleArray(answerArr);
	return answerArr;
}

//Shuffle the array (shuffle correct answer)
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//Gets the input values from the user and switches game screens
function chosenAll(){
	category = document.getElementById("categories").value;
	difficulty = document.getElementById("difficulty").value;
	amount = document.getElementById("amount").value;
	//Validates amount input
	if(amount > 20 || amount <= 0){
		window.alert("Invalid Amount Of Questions !");
		restartGame();
		return;
	}
	type = document.getElementById("type").value;
	//Validates difficulty & type input
	if(difficulty == "null" || type == "null"){
		window.alert("Invalid Input !");
		restartGame();
		return;
	}
	$(chooseGame).hide();
	$(gaming).show();
	start();
	
}

function startGame(){
	$(beforeGame).hide();
	$(chooseGame).show();
}

// Mock DB functions you should not edit!

function getCategories(select) {
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        context: document.body
    }).done(function (data) {
        categories = data.trivia_categories;
        for (i in categories) {
            let cat = categories[i];
            let option = "<option value=" + cat.id + ">" + cat.name + "</option>"
            select.append(option);
        }
    });
}
function editUrl(amount, category , difficulty,type){
	urlHelper["amount"]='amount=' + amount;
	urlHelper["category"]='category=' + category;
	urlHelper["difficulty"]='difficulty=' + difficulty;
	urlHelper["type"]='type=' + type;
}
   
async function getQuestion(amount, category , difficulty,type) {
	editUrl(amount, category , difficulty,type);
	var arr= [] ;
    var url = 'https://opentdb.com/api.php?' + urlHelper.amount
            + '&' + urlHelper.category
            + '&' + urlHelper.difficulty
            + '&' + urlHelper.type
			
	var res = await fetch(url);
	var data = await res.json();
	return data.results;
}