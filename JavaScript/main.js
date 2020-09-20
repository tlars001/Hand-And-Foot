const WINNING_POINTS = 300;

var numTeams = 0;
var firstRun = true;
var round = 0;
var count = 0;

//=====================================================================================================================
function startGame()
{
    //localStorage.clear();
    localStorage.setItem("firstRun", "true");
    location.href = "./Resources/teams.html";
}

//=====================================================================================================================
function highScores()
{
    location.href = "./Resources/highScores.html";
}

//=====================================================================================================================
function rules()
{
    location.href = "./Resources/rules.html";
}

//=====================================================================================================================
function calculateScores()
{
    location.href = "calculateScores.html";
}

//=====================================================================================================================
function teams2()
{
    localStorage.setItem("numTeams", "2");
    calculateScores();
}

//=====================================================================================================================
function teams3()
{
    localStorage.setItem("numTeams", "3");
    calculateScores();
}

//=====================================================================================================================
function teams4()
{
    localStorage.setItem("numTeams", "4");
    calculateScores();
}

//=====================================================================================================================
function teams5()
{
    localStorage.setItem("numTeams", "5");
    calculateScores();
}

//=====================================================================================================================
function supports_html5_storage() 
{
    try 
    {
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch (e) 
    {
        return false;
    }
}

//=====================================================================================================================
function getScores() 
{
    firstRun = localStorage.getItem("firstRun");
    numTeams = localStorage.getItem("numTeams");
    count = 1;

    if (firstRun == "true")
    {
        round = 1;
        localStorage.setItem("firstRun", "false");

        for (var i = 1; i <= numTeams; i++)
        {
            localStorage.setItem(("totalPoints" + i), "0");
        }

    }
    else
    {
        round = localStorage.getItem("round");
    }

    document.getElementById("inputHeader").innerHTML = ("Round " + round);
}

//=====================================================================================================================
function submit()
{
    // Get the data
    var isChecked = document.getElementById("winCheckBox").checked;
    var bookPoints = document.getElementById("bookPoints").value;
    var cardPoints = document.getElementById("cardPoints").value;
    var negativePoints = document.getElementById("negativePoints").value;

    // Sanitize the data
    bookPoints = Math.round(Math.abs(bookPoints));
    cardPoints = Math.round(Math.abs(cardPoints));
    negativePoints = Math.round(Math.abs(negativePoints));

    if (isChecked)
    {
        bookPoints += WINNING_POINTS;
        document.getElementById("winCheckBox").checked = false;
        document.getElementById("checkBoxContainer").hidden = true;
    }

    var teamPoints = bookPoints + cardPoints - negativePoints;

    var tempNameTotal = ("totalPoints" + count);
    var totalPoints = teamPoints + parseInt(localStorage.getItem(tempNameTotal));

    var tempName = "teamPoints" + count;

    var tempName2 = "Team " + (count + 1);

    localStorage.setItem(tempName, teamPoints);
    localStorage.setItem(tempNameTotal, totalPoints);

    if (count < numTeams)
    {
        document.getElementById("calcScoresHeader").innerHTML = tempName2;
        document.getElementById("bookPoints").value = "";
        document.getElementById("cardPoints").value = "";
        document.getElementById("negativePoints").value = "";
        count++;
    }
    else
    {
        round++;
        localStorage.setItem("round", round);
        location.href = "scores.html";
    }
}

//=====================================================================================================================
function displayScores()
{
    numTeams = localStorage.getItem("numTeams");
    round = localStorage.getItem("round");
    var roundName = "Round " + (round - 1) + " Score";
    document.getElementById("scoresHeader").innerHTML = roundName;

    var table = document.getElementById("scoreTable");

    for (var i = 1; i <= numTeams; i++)
    {
        // Set the score for the current round
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = ("Team " + i + ":");
        cell2.innerHTML = localStorage.getItem("teamPoints" + i);
        cell3.innerHTML = localStorage.getItem("totalPoints" + i);
    }

    sortTable();

    if (round == "4")
    {
        document.getElementById("scoreButton").innerHTML = "Main Menu";
        var temp = table.rows[1].cells[0].innerHTML;
        var winner = temp.replace(/:$/g, "");

        document.getElementById("winningTeam").innerHTML = winner + " wins!";
    }
}

//=====================================================================================================================
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("scoreTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[2];
        y = rows[i + 1].getElementsByTagName("TD")[2];
        //check if the two rows should switch place:
        if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

//=====================================================================================================================
function checkRound()
{
    round = localStorage.getItem("round");

    // Check if all three rounds have been completed
    if (round == "4")
    {
        location.href = "../index.html";
    }
    else
    {
        calculateScores();
    }
}