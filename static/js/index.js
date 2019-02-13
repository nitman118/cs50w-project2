
document.addEventListener('DOMContentLoaded', () => {
    //disable submit button
    document.querySelector('#btn-submit-login').disabled = true;

    /**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

    document.querySelector('#text-display').onkeyup = () => {
        if (document.querySelector('#text-display').value.length > 0) {
            document.querySelector('#btn-submit-login').disabled = false;
        }
        else {
            document.querySelector('#btn-submit-login').disabled = true;
        }
    }
    // document.querySelector('#form-login').setAttribute("action","/yo")

    document.querySelector('#form-login').onsubmit = () => {
        const request = new XMLHttpRequest();
        const name = document.querySelector('#text-display').value;
        request.open('POST', '/checkName');

        //callback function when request is completed
        request.onload = () => {
            const data = JSON.parse(request.responseText);

            if (data.success) {
                const contents = `${name} is available!`
                document.querySelector("#result").innerHTML = contents;
                //run anonymous function after 3 seconds
                setTimeout(function(){
                    post('/chatLobby',{dname:name})
                }, 3000);
            }
            else {
                document.querySelector("#result").innerHTML = "Sorry, try another display name!";
                return false;
            }
        }

        //Add data to send with request
        const data = new FormData();
        data.append('name', name);

        //send request
        request.send(data);

        return false;




    };

function doSome(){
    alert("How DARE you CLICK ME?HEY!");
}
document.querySelector('#click-me').onclick=doSome;


});
