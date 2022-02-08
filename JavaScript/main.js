const WINNING_POINTS = 300;

var firstRun = true;
var numTeams = 0;
var round = 0;
var count = 0;

//=====================================================================================================================
function startGame()
{
    localStorage.setItem('firstRun', "true");
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
function makeTeamNames()
{
    location.href = "teamNames.html";
}

//=====================================================================================================================
function calculateScores()
{
    location.href = "calculateScores.html";
}

//=====================================================================================================================
function teams2()
{
    localStorage.setItem('numTeams', "2");
    makeTeamNames();
}

//=====================================================================================================================
function teams3()
{
    localStorage.setItem('numTeams', "3");
    makeTeamNames();
}

//=====================================================================================================================
function teams4()
{
    localStorage.setItem('numTeams', "4");
    makeTeamNames();
}

//=====================================================================================================================
function teams5()
{
    localStorage.setItem('numTeams', "5");
    makeTeamNames();
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
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD)
    {
        round = localStorage.getItem('round');
        round--;
        localStorage.setItem('round', round);
    }

    var firstTeamName = localStorage.getItem("teamName1");
    document.getElementById("calcScoresHeader").innerHTML = firstTeamName;

    firstRun = localStorage.getItem('firstRun');
    numTeams = localStorage.getItem('numTeams');
    count = 1;

    if (firstRun === "true")
    {
        round = 1;
        localStorage.setItem('firstRun', "false");

        for (var i = 1; i <= numTeams; i++)
        {
            localStorage.setItem(('totalPoints' + i) + round, "0");
        }

    }
    else
    {
        round = localStorage.getItem('round');

        if (round < 1)
        {
            round = 1;
            localStorage.setItem('round', round);
        }
    }

    document.getElementById("inputHeader").innerHTML = ("Round " + round);
}

//=====================================================================================================================
function inputTeamNames()
{
    var teams = parseInt(localStorage.getItem('numTeams'));

    for (var i = 1; i <= teams; i++)
    {
        // Set visibility for team name inputs
        var teamName = document.getElementById("teamContainer" + i);
        teamName.hidden = false;
    }
}

//=====================================================================================================================
function submitTeamNames()
{
    var teams = parseInt(localStorage.getItem('numTeams'));

    for (var i = 1; i <= teams; i++)
    {
        var teamName = document.getElementById("teamName" + i).value;
        localStorage.setItem("teamName" + i, teamName);
    }

    calculateScores();
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

    var teamPointsName = ("teamPoints" + count) + round;
    var teamPoints = (bookPoints + cardPoints) - negativePoints;

    var teamPointsTotalName = ("totalPoints" + count) + round;
    var totalPoints = teamPoints;

    if (round > 1)
    {
        var lastTotal = ("totalPoints" + count) + (round - 1);
        totalPoints += parseInt(localStorage.getItem(lastTotal));
    }

    var teamName = localStorage.getItem("teamName" + (count + 1));

    localStorage.setItem(teamPointsName, teamPoints);
    localStorage.setItem(teamPointsTotalName, totalPoints);

    if (count < numTeams)
    {
        document.getElementById("calcScoresHeader").innerHTML = teamName;
        document.getElementById("bookPoints").value = "";
        document.getElementById("cardPoints").value = "";
        document.getElementById("negativePoints").value = "";
        count++;
    }
    else
    {
        round++;
        localStorage.setItem('round', round);
        location.href = "scores.html";
    }
}

//=====================================================================================================================
function displayScores()
{
    numTeams = localStorage.getItem('numTeams');
    round = localStorage.getItem('round');
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
        var teamName = localStorage.getItem("teamName" + i);
        cell1.innerHTML = (teamName + ":");

        var teamPointsName = ("teamPoints" + i) + (round - 1);
        var totalPointsName = ("totalPoints" + i) + (round - 1);

        cell2.innerHTML = localStorage.getItem(teamPointsName);
        cell3.innerHTML = localStorage.getItem(totalPointsName);
    }

    sortTable(table, 2);

    if (round > "3")
    {
        document.getElementById("scoreButton").innerHTML = "Main Menu";
        var temp = table.rows[1].cells[0].innerHTML;
        var winner = temp.replace(/:$/g, "");

        if (checkForTie(table))
        {
            document.getElementById("winningTeam").innerHTML = "It's a tie!";
        }
        else
        {
            setHighScore(table);
            document.getElementById("winningTeam").innerHTML = winner + " wins!";
        }   
    }
}

//=====================================================================================================================
function sortTable(table, position)
{
    var rows, switching, i, x, y, shouldSwitch;
    switching = true;

    // Make a loop that will continue until no switching has been done:
    while (switching)
    {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;

      // Loop through all table rows (except thefirst, which contains table headers):
      for (i = 1; i < (rows.length - 1); i++)
      {
        // Start by saying there should be no switching:
        shouldSwitch = false;

        // Get the two elements you want to compare, one from current row and one from the next:
        x = rows[i].getElementsByTagName("TD")[position];
        y = rows[i + 1].getElementsByTagName("TD")[position];

        //check if the two rows should switch place:
        if (parseInt(x.innerHTML) < parseInt(y.innerHTML))
        {
          // if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }

      if (shouldSwitch)
      {
        // If a switch has been marked, make the switch and mark that a switch has been done:
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

//=====================================================================================================================
function checkRound()
{
    round = localStorage.getItem('round');

    // Check if all three rounds have been completed
    if (round > "3")
    {
        location.href = "../index.html";
    }
    else
    {
        calculateScores();
    }
}

//=====================================================================================================================
function checkForTie(table)
{
    var leadTeamScore = table.rows[1].cells[2].innerHTML;
    var secondTeamScore = table.rows[2].cells[2].innerHTML;

    if (leadTeamScore === secondTeamScore)
    {
        return true;
    }

    return false;
}

//=====================================================================================================================
function setHighScore(table)
{
    var leadTeam = table.rows[1].cells[0].innerHTML;
    var leadTeamScore = table.rows[1].cells[2].innerHTML;
    
    var tempScores = JSON.parse(localStorage.getItem('teamHighScores'));

    if (tempScores == null)
    {
        tempScores = [];
    }

    tempScores.push([leadTeam, leadTeamScore]);
    localStorage.setItem('teamHighScores', JSON.stringify(tempScores));
}

//=====================================================================================================================
function displayHighScores()
{
    var highScoreTable = document.getElementById("highScoreTable");

    const tempScores = JSON.parse(localStorage.getItem('teamHighScores'));

    if (tempScores == null)
    {
        return;
    }

    for (var i = 0; i < tempScores.length; i++)
    {        
        var leadTeam = tempScores[i][0];
        var leadTeamScore = tempScores[i][1];
        var row = highScoreTable.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
    
        cell1.innerHTML = leadTeam;
        cell2.innerHTML = leadTeamScore;
    }

    sortTable(highScoreTable, 1);
}

//=====================================================================================================================
function clearData()
{
    localStorage.clear();
    firstRun = true;
    numTeams = 0;
    round = 0;
    count = 0;

    location.reload();
}
