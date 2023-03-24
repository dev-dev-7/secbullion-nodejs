const MT5WebClient =  require('@centroid/mt5-webapi-client');

const mt = new MT5WebClient({
  password:'varybpr2',
  host: 'secmt5.afkkarr.com',
  login: '1005',
  port: 443,
});


exports.getSymbol = async (symbol) => {
    mt.request('/api/symbol/list').then(console.log);
};