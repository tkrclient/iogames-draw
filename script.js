MESSAGE_CONNECTED = 1;
MESSAGE_USER_JOINED = 2;
MESSAGE_USER_LEFT = 3;
MESSAGE_STROKE = 4;
MESSAGE_CLEAR = 5;

window.onload = function() {

    let canvas = document.getElementById("whiteboard");
    let ctx = canvas.getContext("2d");
    let isDrawing = false;
	let isErasing = false;
    let strokeColor = '';
    let strokes = [];

    let socket = new WebSocket("ws://localhost:3000/ws");
    let otherStrokes = {};
    let otherColors = {};

    var pick = document.getElementById("colorpicker"); // Colorpicker
  	const eraserButton = document.getElementById('color-eraser'); // Eraser

	var current = {
		isErasing: false
	};

	eraserButton.addEventListener('click', toggleEraser, false);

	function toggleEraser() {
		current.isErasing = !current.isErasing;
	}

    // Function to generate a random color
    function getRandomColor() {
        return "#" + Math.random().toString(16).slice(2, 8).padStart(6, "0");
    }

    // Function to set background-color and text color
    function setColor(element, color) {
        element.style.backgroundColor = color;
        element.style.color = "#FFFFFF"; // Default text color (white)
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Function to get a cookie by name
    function getCookie(name) {
        const cookies = document.cookie.split(";"); // Split cookies into an array
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim(); // Trim whitespace
            if (cookie.startsWith(name + "=")) {
                return cookie.substring((name + "=").length); // Return the value of the cookie
            }
        }
        return null; // Return null if the cookie is not found
    }

    // Check if a color is stored in cookies
    let userColor = getCookie("color");
    if (!userColor) {
        // Generate a random color if no cookie exists
        userColor = getRandomColor();
        setCookie("color", userColor); // Store the color in a cookie
    }

    // Apply the stored or newly generated color
    setColor(pick, userColor);

    // Add click event listener to change the color
    pick.onclick = function () {
        const newColor = getRandomColor(); // Generate a new random color
        setCookie("color", newColor, 365); // Update the cookie with the new color
        setColor(pick, newColor); // Apply the new color
        console.log(`New Color: ${newColor}`);
    };

    canvas.onmousedown = function(event) {
        isDrawing = true;
        addPoint(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, true)
	    if (isErasing) {
	      context.globalCompositeOperation = 'destination-out';
	      context.strokeStyle = 'rgba(0,0,0,1)';
	      context.lineWidth = 30; // Adjust eraser size as needed
	    }
    };

    canvas.onmousemove = function(event) {
        if (isDrawing) {
            addPoint(event.pageX - this.offsetLeft, event.pageY - this.offsetTop)
        }
	    if (isErasing) {
	      context.globalCompositeOperation = 'destination-out';
	      context.strokeStyle = 'rgba(0,0,0,1)';
	      context.lineWidth = 30; // Adjust eraser size as needed
	    }
    };

    canvas.onmouseup = function() {
        isDrawing = false;
		isErasing = false;
    }

    canvas.onmouseleave = function() {
        isDrawing = false;
		isErasing = false;
    }


    function addPoint(x, y, newStroke) {
        var p = {x: x, y: y}
        if (newStroke) {
            strokes.push([p]);
        } else {
            strokes[strokes.length - 1].push(p);
        }
        socket.send(JSON.stringify({kind: MESSAGE_STROKE, points: [p], finish: newStroke}));
        update();
    }

    function update() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.lineJoin = "round";
        ctx.lineWidth = 4;

        // Draw mine
        ctx.strokeStyle = getComputedStyle(pick).backgroundColor;
        drawStrokes(strokes);

        // Draw others
        let userIds = Object.keys(otherColors);
        for (let i = 0; i < userIds.length; i++) {
            let userId = userIds[i];
            ctx.strokeStyle = otherColors[userId];
            drawStrokes(otherStrokes[userId]);
        }

    }

    function drawStrokes(strokes) {
        for (let i = 0; i < strokes.length; i++) {
            ctx.beginPath()
            for (let j = 1; j < strokes[i].length; j++) {
                let prev = strokes[i][j - 1];
                var current = strokes[i][j];
                ctx.moveTo(prev.x, prev.y);
                ctx.lineTo(current.x, current.y);
            }
            ctx.closePath()
            ctx.stroke();
        }
    }

    document.getElementById('wipe-button').onclick = function () {
        strokes = [];
        socket.send(JSON.stringify({kind: MESSAGE_CLEAR}));
        update();
    };

	const color = "#ee0e0e"; // Function to get user's color choice

    socket.onmessage = function(event) {
        let messages = event.data.split('\n');
        for (let i = 0; i < messages.length; i++) {
            let message = JSON.parse(messages[i]);
            onMessage(message);
        }
    }

    function onMessage(message) {
        switch (message.kind) {
            case MESSAGE_CONNECTED:
                strokeColor = message.color;
                for (let i = 0; i < message.users.length; i++) {
                    let user = message.users[i];
                    otherColors[user.id] = user.color;
                    otherStrokes[user.id] = [];
                }
                break;
            case MESSAGE_USER_JOINED:
                otherColors[message.user.id] = message.user.color;
                otherStrokes[message.user.id] = [];
                break;
            case MESSAGE_USER_LEFT:
                delete otherColors[message.userId];
                delete otherStrokes[message.userId];
                update();
                break;
            case MESSAGE_STROKE:
                if (message.finish) {
                    otherStrokes[message.userId].push(message.points);
                } else {
                    let strokes = otherStrokes[message.userId];
                    strokes[strokes.length - 1] = strokes[strokes.length - 1].concat(message.points);
                }
                update();
                break;
            case MESSAGE_CLEAR:
                otherStrokes[message.userId] = [];
                update();
                break;
        }
    }

}
