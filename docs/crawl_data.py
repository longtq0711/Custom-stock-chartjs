import requests
import pandas as pd 
import schedule
import time

URL_STOCKS = 'https://finfo-api.vndirect.com.vn/v4/top_of_stocks?q=index:VNIndex&size=10&sort=lastPrice'
URL_STOCK = 'https://finfo-api.vndirect.com.vn/v4/stock_prices'

list_stocks = ['LPB','HDB','EVF','EIB','BID','BAB','VCB','TCB','ACB','STB','VPB','TPB','LPB','SHB','VIB','MBB','MSB','NVB']


def crawl_stock():
	for stock in list_stocks:
		headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'}
		params = {'sort': 'date', 'q': 'code:{}.'.format(stock), 'size':'60', 'page': '1'}
		data = requests.get(URL_STOCK,params=params,headers=headers)

		df = pd.DataFrame(data.json()['data'])
		df = df[['date','close','open','high','low']]
		# df['pctChange'] = round(df['pctChange'],2)
		df.rename(columns={
						'date': 'Date', 
						'close': 'Close', 
						'open': 'Open', 
						'high': 'High',
						'low': 'Low',
						# 'pctChange': 'Change',
						# 'nmVolume': 'Volume'
					}, inplace=True)
		
		df.to_csv('data/{}.csv'.format(stock),index=False)


if __name__ == '__main__':
	crawl_stock()
	# schedule.every().day.at("15:00").do(crawl_stock)

	# while True:
    # 	schedule.run_pending()
    # 	time.sleep(10)