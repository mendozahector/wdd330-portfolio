let latest_stock_news = {};
var byPercentChange = [];

let stocks = {};
let stock_data = {};
let statuses = [];

let chartStock = 'SPY';

let myChart = new Chart("myChart", {
    type: "line",
});

function createChart() {

    if (stock_data[chartStock] === undefined)  {
        return;
    }

    var xValues = Array.from({length: 30}, (_, i) => i).reverse();
    var yValues = [];

    for (let i = 0; i < stock_data[chartStock]['trades'].length; i += 6) {
        yValues.push(stock_data[chartStock]['trades'][i]);
    }

    myChart.destroy();

    let backgroundColor = '';
    let borderColor = '';
    if (stock_data[chartStock]['trades'][0] < stock_data[chartStock]['trades'][stock_data[chartStock]['trades'].length - 1]) {
        backgroundColor = "rgba(63, 195, 128, 1.0)";
        borderColor = "rgba(63, 195, 128, 0.1)";
    } else {
        backgroundColor = "rgba(207, 0, 15, 1.0)";
        borderColor = "rgba(207, 0, 15, 0.1)";
    }

    myChart = new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
        fill: false,
        lineTension: 0,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        data: yValues
        }]
    },
    options: {
        legend: {display: false},
        scales: {
        yAxes: [{ ticks: { min: Math.min(...yValues) * 1, max: Math.max(...yValues) * 1 }, scaleLabel: {
            display: true,
            labelString: 'Price ($)'
          } }],
        xAxes: [{ scaleLabel: {
            display: true,
            labelString: 'Time (Last 30 Minutes)'
          } }],
        },
        
        animation: {
            duration: 0
        }
    }
    });
}

function updateUI() {
    const now = new Date();
    Object.keys(latest_stock_news).forEach(key => {
        if (latest_stock_news[key]['news']['time'] < now) {
            delete latest_stock_news[key];
        } else {
            latest_stock_news[key]['p_c'] = stocks[key];
        }
    });

    if (Object.keys(latest_stock_news).length > 0) {

        const up = document.getElementById("price-up-list");
        const down = document.getElementById("price-down-list");

        byPercentChange = [];
        byPercentChange = [ structuredClone(latest_stock_news) ];
    
        byPercentChange.sort((a, b) => parseFloat(a.p_c) - parseFloat(b.p_c));
    
        // Update Price Up List
        let dark = false;
        up.innerHTML = '';
        Object.keys(byPercentChange[0]).forEach(key => {

            const p_c = latest_stock_news[key].p_c;

            if (p_c > 5) {
                const date_string = latest_stock_news[key].news.datePublished.split(" ")[1] + " - ";
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(date_string));
    
                const a = document.createElement('a');
                a.appendChild(document.createTextNode(key));
                a.href = `javascript:updateChartName('${key}')`;
    
                li.appendChild(a);
                li.appendChild(document.createTextNode(`: ${p_c}%`));
    
                if (dark) {
                    li.classList.add('dark');
                    dark = false;
                } else {
                    dark = true;
                }
    
                up.appendChild(li);
            }

        });

        console.log(byPercentChange[0], latest_stock_news);

        // Update Price Down List
        dark = false;
        down.innerHTML = '';
        Object.keys(byPercentChange[0]).reverse().forEach(key => {

            const p_c = latest_stock_news[key].p_c;

            if (p_c < -7) {
                const date_string = latest_stock_news[key].news.datePublished.split(" ")[1] + " - ";
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(date_string));
    
                const a = document.createElement('a');
                a.appendChild(document.createTextNode(key));
                a.href = `javascript:updateChartName('${key}')`;
    
                li.appendChild(a);
                li.appendChild(document.createTextNode(`: ${p_c}%`));
    
                if (dark) {
                    li.classList.add('dark');
                    dark = false;
                } else {
                    dark = true;
                }
    
                down.appendChild(li);
            }

        });
    }


    // Update Statuses List
    const statuses_list = document.getElementById("statuses-list");
    statuses_list.innerHTML = '';
    dark = false;
    statuses.forEach(element => {

        let date_string = new Date(element.Timestamp);
        date_string.setMinutes(date_string.getMinutes() - 10);
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`${date_string.toLocaleTimeString('it-IT')} - `));

        const a = document.createElement('a');
        a.appendChild(document.createTextNode(element.Symbol));
        a.href = `javascript:updateChartName('${element.Symbol}')`;

        li.appendChild(a);
        li.appendChild(document.createTextNode(`: ${element.StatusMessage} ${element.ReasonMessage}`));

        if (dark) {
            li.classList.add('dark');
            dark = false;
        } else {
            dark = true;
        }

        statuses_list.prepend(li);
    });


    
    setTimeout(updateUI, 5000);
}

async function onNews(event) {
    const article = event.data;

    let date_string = '';
    try {
        date_string = article.datePublished.split(" ")[1] + " - ";
    } catch (error) {
        return;
    }
    
    let time = new Date()
    time.setMinutes(time.getMinutes() + 30);
    article.time = time;
    article.symbols.forEach(symbol => {
        if (symbol in stocks) {
            latest_stock_news[symbol] = {};
            latest_stock_news[symbol]['p_c'] = stocks[symbol];
            latest_stock_news[symbol]['news'] = article;
            console.log(symbol, article);
        }
    });

    const news = document.getElementById("news-list");
    const sec = document.getElementById("sec-list");
    const li = document.createElement("li");
    
    li.appendChild(document.createTextNode(date_string));

    const a = document.createElement('a');
    a.appendChild(document.createTextNode(article.headline));
    a.href = article.link;
    a.target = '_blank';

    li.appendChild(a);

    // SEC Forms
    if (article.distributor === 'SEC') {
        sec.prepend(li);
    } // All other news articles 
    else {
        news.prepend(li);
    }
}

async function onStocks(event) {
    data = event.data;

    if (data['SPY'] === undefined) {
        statuses.length = 0;
        statuses = data;
    } else if (data['SPY']['trades'] === undefined) {
        stocks = data;
    } else {
        stock_data = data;
        createChart();
    }
}

async function initWorkers() {
    console.log('Initializing workers...');

    // Stock Market News WebSocket
    let newsWorker = new Worker('stock_news_script.js');
    newsWorker.addEventListener('message', onNews);

    //Stock Market Data APIs
    let stocksWorker = new Worker('stock_data_script.js');
    stocksWorker.addEventListener('message', onStocks);

    setTimeout(updateUI, 1000);
}

function updateChartName(name) {
    const last = document.getElementById("last-news");
    last.style.display = 'none';

    try {
        const p = document.createElement("p");
        date_string = latest_stock_news[name].news.datePublished.split(" ")[1] + " - ";
        p.appendChild(document.createTextNode(date_string));
        
        const a2 = document.createElement('a');
        a2.appendChild(document.createTextNode(latest_stock_news[name].news.headline));
        a2.href = latest_stock_news[name].news.link;
        a2.target = '_blank';

        p.appendChild(a2);

        last.innerHTML = '';

        last.appendChild(p);
        last.style.display = 'block';   
    } catch (error) {
        // pass
    }

    chartStock = name;
    createChart();
    document.getElementById('chart-name').innerText = name;
}

initWorkers();