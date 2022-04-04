let binary_operators = ["**", "+", "÷", "*", "E", "/", "^", "%", "=", "-"];
let inputLine = document.querySelector(".calculator input");
let buttonElements = document.querySelectorAll(".calculator button");
let input = document.querySelector('.calculator .down-line');

const factorial = function(x) {
  let factorialOfX = 1;

  for (let i = 1; i <= x; i ++){
    factorialOfX *= i;
  }

  return factorialOfX;
};

const displayTemporaryMessage= function(string){
  let message_div = document.querySelector('.content p');

  message_div.textContent = string;
  message_div.classList.add("visible");

  setTimeout(function() {message_div.classList.remove("visible");} , 1000);
};



const triggerOperateCalculator = function(event) {
  const label = document.querySelector('.calculator label');
  let number_of_binary_operators;


  let  last_char = inputLine.value[inputLine.value.length -1];
  let before_last_char = inputLine.value[inputLine.value.length -2];
  let before_before_last_char = inputLine.value[inputLine.value.length -3];

  if (event.target.textContent == "+/-"){
    number_of_binary_operators = countBinaryOperators(inputLine.value);

    if (number_of_binary_operators == 0){
      if (last_char >= '0' && last_char <= '9'){
        inputLine.value = String(-1 * Number(inputLine.value))
      }
    }
    else{
      displayTemporaryMessage("This operator acts over a single number");    
    }
    
    return;
  }


  if (event.target.textContent != "DEL" && event.target.textContent != "AC"){
    inputLine.value += event.target.textContent;
    label.textContent = inputLine.value;
  }
  
  // Check input value is valid
  if ((last_char >= '0' && last_char <= '9') || binary_operators.join("").includes(last_char) || last_char == "."){
    ;
  }
  else{
    inputLine.value = inputLine.value.substring(0, inputLine.value.length - 1);
    displayTemporaryMessage("Enter a valid input");    
  }

  // Check first value is valid
  if (inputLine.value.length == 1 && (last_char < '0' || last_char > '9') && last_char != "-"){
    inputLine.value = "";
    displayTemporaryMessage("Enter a number first");
  }

  // Check that binary operators are used correctly
  if (binary_operators.join("").includes(last_char)){
    // if (last_char == "-" && inputLine.value.length == 1){
    //   return;
    // }

    // Special case in which before_last_char is *
    if (before_last_char == "*"){  
      if (last_char != "*" || before_before_last_char == "*"){
        inputLine.value =  inputLine.value.substring(0, inputLine.value.length - 1);
        displayTemporaryMessage("Enter a number after binary operator");  
      }
    }
    
    else if(binary_operators.join("").includes(before_last_char)){
      inputLine.value =  inputLine.value.substring(0, inputLine.value.length - 1);
      displayTemporaryMessage("Enter a number after binary operator");
    }
  }

  let string = inputLine.value;
  number_of_binary_operators = countBinaryOperators(string);
  let number_of_points = 0;

  // Check that there is only one point
  for(let i = 0; i < string.length; i++){
    if (string[i] == "."){
      number_of_points++;
    }
    if (number_of_points > 1){
      inputLine.value =  inputLine.value.substring(0, inputLine.value.length - 1);
      displayTemporaryMessage("Wrong decimal format");
    }
  }

  // Count binary operator
  if (last_char == "="){
    calculateBinary();
  }
  else if (number_of_binary_operators > 1){
    inputLine.value =  inputLine.value.substring(0, inputLine.value.length - 1);
    console.log(isBinaryOperation(inputLine.value));
    calculateBinary();
    inputLine.value += last_char;
  }
  else if (number_of_binary_operators == 1 && last_char == "*" && (before_last_char <= '9' && before_last_char >= '0') ){
    inputLine.value =  inputLine.value.substring(0, inputLine.value.length - 1);
    console.log(isBinaryOperation(inputLine.value));
    calculateBinary();
    inputLine.value += last_char;    
  }
};

const isBinaryOperation = function(text){
  let split_array;

  for(let i = 0; i < binary_operators.length; i++){  
    split_array = text.split(binary_operators[i]);
    console.log(split_array, binary_operators[i]);

    if ( split_array.length == 2 && split_array[1] != "" || split_array.length > 2){
      if (split_array[0] == ""){
        return [String(-1*Number(split_array[1])), binary_operators[i], split_array[2]];
      }
      return [split_array[0], binary_operators[i], split_array[1]];
    }
  }

  return "";
}


const countBinaryOperators = function(string){
  let number_of_binary_operators = 0;

  for(let i = 0; i < string.length; i++){
    if (i == 0 && string[i] == "-"){
      ;
    }
    
    else if (binary_operators.join("").includes(string[i]) && string[i] != "*"){
      number_of_binary_operators++;
    }
    else if (string[i] == "*" && string[i-1] == "*"){
      number_of_binary_operators++;      
    }
    else if(string[i] == "*" && (string[i + 1] >= '0' &&  string[i + 1] <= '9')){
      number_of_binary_operators++;
    }
  }

  return number_of_binary_operators;
};


const calculateBinary = function(){

  if ((values =  isBinaryOperation(inputLine.value))){

    a = values[0];
    operator = values[1];
    b = values[2];

    if (binary_operators.join("").includes(b[b.length - 1])){
      b =  b.substring(0, b.length - 1);
      // In case it is ** repeat
      if (binary_operators.join("").includes(b[b.length - 1])){
        b =  b.substring(0, b.length - 1);
      }
    }

    switch (operator){
      case '+':
        inputLine.value = +a + +b;
        break;
      case "*":
        inputLine.value = +a * +b;
        break;
      case "-":
        inputLine.value = +a - +b;
        break;
      case "÷":
        inputLine.value = +a / +b;
        break;
      case "/":
        inputLine.value = +a / +b;
        break;
      case "**":
        inputLine.value = (+a) ** (+b);
        break;
      case "^":
        inputLine.value = (+a) ** (+b);
        break;
      case "E":
        inputLine.value = (+a) * 10 ** (+b);
    } 
  }

  else {
    inputLine.value = NaN;
  }


 
}

const operateCalculator = function(event) {
  if (event.keyCode === 13) { // key code of the keybord key
    event.preventDefault();

    calculateBinary();
  }

  else if (event.target.classList[1] == "equal-button"){
    calculateBinary();
  }
    
  return;
};
  

buttonElements.forEach(element => {
    element.addEventListener("click", triggerOperateCalculator);
});

input.addEventListener('keypress', operateCalculator);

// let equal_key = document.querySelector('.equal-button');
// equal_key.addEventListener('click', operateCalculator);

let ac_key = document.querySelector('.ac-button');
ac_key.addEventListener('click', function(){inputLine.value = "";});

let del_key = document.querySelector('.del-button');;
del_key.addEventListener('click', function(){
  console.log("here");
  inputLine.value = inputLine.value.substring(0, inputLine.value.length - 1);});

input.addEventListener('input', triggerOperateCalculator);
