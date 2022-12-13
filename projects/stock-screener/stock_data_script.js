
function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function getStockData() {
    console.log('Connected to the stock market data APIs');
    while (true) {

        try {
            // Get stocks percent change
            fetch('https://hm-stock-market-api.onrender.com/stocks')
            .then((response) => response.json())
            .then((data) => {
                self.postMessage(data);
            })
            .catch((error) => {
                console.error(new Date().toLocaleTimeString(), 'Error getting stocks');
            });

            // Get stocks data
            fetch('https://hm-stock-market-api.onrender.com/stocks/data')
            .then((response) => response.json())
            .then((data) => {
                self.postMessage(data);
            })
            .catch((error) => {
                console.error(new Date().toLocaleTimeString(), 'Error getting stock data');
            });

            // Get stock statuses
            fetch('https://hm-stock-market-api.onrender.com/stocks/statuses')
            .then((response) => response.json())
            .then((data) => {
                self.postMessage(data);
            })
            .catch((error) => {
                console.error(new Date().toLocaleTimeString(), 'Error getting statuses:');
            });

            //console.log(new Date().toLocaleTimeString(), 'Got stock data');
        } catch (error) {
            console.log('Error fetching data', error);
            await delay(60000);
        }
    
        await delay(10000);
    }
}

getStockData();