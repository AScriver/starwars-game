$(document).ready(function () {
    var characters = {
        "Anakin Skywalker": {
            img: "images/anakin.jfif",
            name: "Anakin Skywalker",
            AP: 8,
            HP: 125,
            CAP: 17
        },
        "Darth Maul": {
            img: "images/darth_maul.jfif",
            name: "Darth Maul",
            AP: 10,
            HP: 150,
            CAP: 20
        },
        "Han Solo": {
            img: "images/han_solo.jfif",
            name: "Han Solo",
            AP: 8,
            HP: 100,
            CAP: 17
        },
        "Jar Jar": {
            img: "images/jar_jar.jfif",
            name: "Jar Jar",
            AP: 5,
            HP: 80,
            CAP: 13
        }
    };

    var userPlayer;
    var defender;
    var enemies = [];
    var kills = 0;
    var moves = 1;

    var makeCharCard = function (character, otherAreaCreate, status) {
        var charCardName = $("<div class='character-name'>").text(character.name);
        var charCardImg = $("<img alt='image' class='character-img'>").attr("src", character.img);
        var charCardHp = $("<div class='character-hp'>").text(character.HP);
        var charCard = $("<div class='character' data-name='" + character.name + "'>");
        charCard.append(charCardName).append(charCardImg).append(charCardHp);
        $(otherAreaCreate).append(charCard);

        if (status === "enemy") {
            $(charCard).addClass("enemy");
        } else if (status === "defender") {
            defender = character;
        }
    };

    var createMsg = function (message) {
        var gameMsg = $("#stat-message");
        var newMessage = $("<div>").text(message);
        gameMsg.append(newMessage);
        if (message === "noMsg") {
            gameMsg.text("");
        }
    };

    var createChar = function (charObject, createArea) {
        if (createArea === "#characters-container") {
            $(createArea).empty();
            for (var key in charObject) { // calls makeCharCard on each key in the object
                if (charObject.hasOwnProperty(key)) {
                    makeCharCard(charObject[key], createArea, "");
                }
            }
        }

        if (createArea === "#user-character") {
            makeCharCard(charObject, createArea, "");
        }

        if (createArea === "#choose-opponent") {
            for (var i = 0; i < charObject.length; i++) {
                makeCharCard(charObject[i], createArea, "enemy");
            }

            $(document).on("click", ".enemy", function () {
                var name = ($(this).attr("data-name"));
                if ($("#defender").children().length === 0) {
                    createChar(name, "#defender");
                    $(this).hide();
                    createMsg("noMsg");
                }
            });
        }

        if (createArea === "#defender") {
            $(createArea).empty();
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].name === charObject) {
                    makeCharCard(enemies[i], createArea, "defender");
                }
            }
        }

        if (createArea === "playerDamage") {
            $("#defender").empty();
            makeCharCard(charObject, "#defender", "defender");
        }

        if (createArea === "enemyDamage") {
            $("#user-character").empty();
            makeCharCard(charObject, "#user-character", "");
        }

        if (createArea === "enemyDefeated") {
            $("#defender").empty();
            var killMsg = "You killed " + charObject.name;
            createMsg(killMsg);
        }
    };

    var refreshPage = function (endGame) {
        var refresh = $("<button> Restart </button>").click(function () {
            location.reload();
        });
        var winLose = $("<div>").text(endGame);
        $("body").append(winLose);
        $("body").append(refresh);
    }

    createChar(characters, "#characters-container");
    
    $(document).on("click", ".character", function () {
        var name = $(this).attr("data-name");
        if (!userPlayer) {
            userPlayer = characters[name];
            for (var key in characters) {
                if (key !== name) {
                    enemies.push(characters[key]);
                }
            }
            $("#characters-container").hide();
            createChar(userPlayer, "#user-character");
            createChar(enemies, "#choose-opponent");
        }
    });

    $("#attack-button").on("click", function () {
        if ($("#defender").children().length !== 0) {
            var atkMsg = "You hit " + defender.name + " for " + (userPlayer.AP * moves) + " damage.";
            var counterAtkMsg = defender.name + " hit you for " + defender.CAP + " damage.";
            createMsg("noMsg");
            defender.HP -= (userPlayer.AP * moves);

            if (defender.HP > 0) {
                createChar(defender, "playerDamage");
                createMsg(atkMsg);
                createMsg(counterAtkMsg);
                userPlayer.HP -= defender.CAP;
                createChar(userPlayer, "enemyDamage");
                if (userPlayer.HP <= 0) {
                    createMsg("noMsg");
                    refreshPage("Y O U   D I E D");
                    $("#attack-button").unbind("click");
                }
            } else {
                createChar(defender, "enemyDefeated");
                kills++;
                if (kills >= 3) {
                    createMsg("noMsg");
                    refreshPage("W I N N E R");
                }
            }
        }
        moves++;
    });
});
