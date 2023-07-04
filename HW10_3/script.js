const wsUri = "wss://echo-ws-service.herokuapp.com";

//У меня осталось несколько вопросов по этому заданию. 
// - я пытался по нажатию кнопки отправить запустить вебсокет, а на втором и последующих сообщениях проверять запущен ли вебсокет, но при нажатии кнопки disconnect при следующей отправке сообщения вебсокет не запускался.
// - Не получалось добавить отправку сообщения после открытия вебсокета, код, ожидаемо, не дожидался открытия канала с сервером и сообщение не возвращалось, у меня так и не получилось заставить код подождать открытия канала и потом отправлять сооющение, изза этого пришлось вставить отправку сообщения в код открытия канала.
// - не понял как сделать так чтобы при отправке геолокации на сервер не выводить ответ. Из идей было сравнить полученную строку по ключевым словам longitude, но это какие-то костыли.

const chtMsgRequest = document.querySelector('.m-request');
const chtMsgRespond = document.querySelector('.m-respond');
const chtMsg = document.querySelector('.c-result');
const btnNode = document.querySelector(".j-btn-request")
const sendGeo = document.querySelector(".j-btn-geo")


const btnOpen = document.querySelector('.j-btn-open');
const btnClose = document.querySelector('.j-btn-close');
const btnClear = document.querySelector('.j-btn-clear');

let websocket;

function writeChat(message, type) {
    let pre = document.createElement("p");
    pre.className = type;
    pre.innerHTML = message;
    chtMsg.appendChild(pre);
}

btnOpen.addEventListener('click', () => {
    openChannel()
    // function openChannel() {
    //     websocket = new WebSocket(wsUri);
    //     websocket.onopen = function (evt) {
    //         console.log("CONNECTED");
    //         console.log(websocket.readyState);
    //         //writeChatRequest("CONNECTED");
    //     };
    //     websocket.onclose = function (evt) {
    //         console.log("DISCONNECTED");
    //     };
    //     websocket.onmessage = function (evt) {
    //         writeChatRespond('RESP: ' + evt.data);
    //     };
    //     websocket.onerror = function (evt) {
    //         writeChatRespond(
    //             '<span style="color: red;">ERROR:</span> ' + evt.data
    //         );
    //     };
    // }

})

sendGeo.addEventListener('click', () => {
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { coords } = position;
      let geoLink = `<a href="https://www.openstreetmap.org/#map=18/${coords.latitude}/${coords.longitude}"  target="_blank">Open mapLink</a></p>`
      writeChat(geoLink, 'm-request')
      
      //websocket.send(`latitude ${coords.latitude}, longitude ${coords.longitude}`)
    });
  }
})

function sendMessege() {
    const rMessage = document.querySelector(".j-input").value;
    writeChat("SENT: " + rMessage, 'm-request');
    websocket.send(rMessage);
    focusAndClear()
}

function openChannel() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) {
        sendMessege() //отправка сообщения из кода открытия канала
        console.log("CONNECTED");
    };
    websocket.onclose = function (evt) {
        console.log("DISCONNECTED");
    };
    websocket.onmessage = function (evt) {
        writeChat('RESP: ' + evt.data, 'm-respond');
    };
    websocket.onerror = function (evt) {
        writeChat(
            '<span style="color: red;">ERROR:</span> ' + evt.data
        );
    };
}

function focusAndClear() {
const clearMessage = document.querySelector(".j-input");
clearMessage.value = '';
const focus = document.querySelector(".j-input").focus();
}

btnClear.addEventListener('click', () => {
    chtMsg.innerHTML = ('')
    focusAndClear()
})


btnNode.addEventListener('click', () => {
    
//пытался придумать проверку на открытие вебсокета, но всёравно при нажатии кнопки дисконнект перезапустить вебсокет не получалось.

    if (typeof websocket !== 'undefined' && websocket !== 'null' && websocket.readyState !== 'null' && websocket.readyState == 1) {
        sendMessege();
    }
    else {
        openChannel();
        //sendMessege() //хотелось бы отправлять сообщение отсюда
    }
});

btnClose.addEventListener('click', () => {
    websocket.close();
    websocket = null;
});

// btnSend.addEventListener('click', () => {
//     const message = 'Test message';
//     writeChatRequest("SENT: " + message);
//     websocket.send(message);
// });
