
let stocks = {}


async function getStocks() {
    // Get all stocks
    await fetch('https://hm-stock-market-api.onrender.com/stocks')
    .then((response) => response.json())
    .then((data) => {
        stocks = data
        console.log(new Date().toLocaleTimeString(), 'Loaded all stocks', stocks);
    })
    .catch((error) => {
        console.log(new Date().toLocaleTimeString(), 'Error getting stock data:', 'stock_news_script');
    });
}


function run_news_websocket() {
    function on_news(article) {
        self.postMessage(article);
        const symbols = article.symbols;
        // console.log(symbols);
        // symbols.forEach(symbol => {
        //     if (symbol in stocks) {
        //         self.postMessage(article);
        //     }
        // });
        
        // const news = document.getElementById("news-list");
        // const sec = document.getElementById("sec-list");
        // const li = document.createElement("li");
        
        // const date_string = article.datePublished.split(" ")[1] + " - ";
        // li.appendChild(document.createTextNode(date_string));
        // //li.append(document.createTextNode(" - " + article.symbols + " - "));

        // const a = document.createElement('a');
        // a.appendChild(document.createTextNode(article.headline));
        // a.href = article.link;
        // a.target = '_blank';
        
        // li.appendChild(a);

        // // SEC Forms
        // if (article.distributor === 'SEC') {
        //     sec.prepend(li);
        // } // All other news articles 
        // else {
        //     news.prepend(li);
        // }
    }

    let socket = new WebSocket("wss://cast.streetinsider.com:10443/cast");

    socket.onopen = function(e) {
        socket.send(JSON.stringify({"_req":"auth","token":"JexJqm/+M2LcU7o1","_id":"0.08681969465676631"}));
    };
      
    socket.onmessage = function(event) {
        data = JSON.parse(event.data);
        
        // connection information
        if ('_id' in data) {
            const message = data['status'] === 'ok' ? "Connected to the stock market news websocket" : "Could not connect to the stcok market news websocket";
            console.log(message, '\n', data);
        }

        // ping pong
        if ('_req' in data && data['_req'] === 'ping') {
            pong = {'_req': 'pong'};
            socket.send(JSON.stringify(pong));
        }

        // new article
        if ('_req' in data && data['_req'] === 'new-article') {
            on_news(data.article);
        }
    };
    
    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
        run_news_websocket();
    };
    
    socket.onerror = function(error) {
        console.log(`[error]`, error);
        socket = new WebSocket("wss://cast.streetinsider.com:10443/cast");
    };
}


function github() {
    window.open("https://github.com/mendozahector/wdd330-portfolio/tree/main/projects/stock-screener", "_blank");
}


//getStocks();
run_news_websocket();