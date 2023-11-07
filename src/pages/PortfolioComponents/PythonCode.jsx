import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const PyCharmCodeDisplay = () => {
  const codeString = `import concurrent.futures
import datetime as dt
import time
import threading as th
import http.client as httplib
import sys
import logging
import logging.handlers
from pandas.tseries.offsets import BDay
import os
import glob
import sqlite3
import pandas as pd


from ALGO.stock_init_fetch_module import APIbootstrap
from ALGO.websocket_core_module import WebsocketBootStrapper
from ALGO.stock_data_module import stockDataEngine
from ALGO.technical_indicators_core import technicalIndicators
from ALGO.bond_yield_fetch_module import bondYields
from ALGO.options_module import Options
from ALGO.portfolio_analysis_module import portfolioAnalysis
from ALGO.file_handling_module import filePruning
from ALGO.stock_and_option_analysis_module import stockAnalysis
from ALGO.db_initializer import databaseInitializer
from ALGO.purchasing_analysis import purchasingAnalysis
from ALGO.trade_executor_module import tradeExecution
from ALGO.verify_file_integrity import verifyFileIntegrity


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


# threaded method that allows an input timeout
class inputWithTimeout:
    _input = None

    def override(self):
        get_input_thread = th.Thread(target=self.get_input)
        get_input_thread.daemon = False
        get_input_thread.start()
        get_input_thread.join(timeout=5)

        if self._input is None or self._input == 'n':
            print("Program executing automatically")
            manual_override_bool = False
            choice = 1
        else:
            manual_override_bool = True
            choice = None
        return manual_override_bool, choice

    def get_input(self):
        self._input = str(input("Manual override? (y/n)"))
        return


# minor date functions
def suffix(d):
    return 'th' if 11 <= d <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(d % 10, 'th')


# formats date strings
def custom_strftime(time_format, t):
    return t.strftime(time_format).replace('{S}', str(t.day) + suffix(t.day))


# need this to scrape together all the times and normalize them to CST, ideally want to localize this regardless of tz
def time_initialization():
    fulltimezone = str(dt.datetime.now(dt.timezone.utc).astimezone().tzinfo)
    local_timezone = ''.join([c for c in fulltimezone if c.isupper()])
    proper_date = custom_strftime('%B {S}, %Y', dt.datetime.now())
    print('Today\'s date:', proper_date)
    proper_time = dt.datetime.strftime(dt.datetime.now(), "%I:%M:%S %p")
    print('The time is:', proper_time, local_timezone)

    cstdelta = dt.timedelta(hours=1)
    mkt_close = (clock.next_close - cstdelta).time()
    mkt_close_time_ampm = mkt_close.strftime("%#I:%M %p")

    mkt_open_date = custom_strftime('%B {S}, %Y', clock.next_open)
    mkt_open_time = (clock.next_open - cstdelta).time()
    market_open_time_ampm = mkt_open_time.strftime("%#I:%M %p")

    market_closed_boolean = False
    if not clock.is_open:
        print('The stock market is currently closed, but will reopen on:')
        print(mkt_open_date + ' at ' + market_open_time_ampm + ' ' + local_timezone)
        market_closed_boolean = True
    else:
        print('The stock market closes at ' + mkt_close_time_ampm + ' today')

    return mkt_close, market_closed_boolean


# disabled for now
def check_for_market_close():
    if not clock.is_open:
        raise Exception('The market is currently closed')

    tmp_fivemintime = dt.datetime.combine(dt.date(1, 1, 1), market_close)
    fiveminfromclose = (tmp_fivemintime - dt.timedelta(minutes=5)).time()
    if dt.datetime.now().time() > fiveminfromclose:
        raise Exception('The market is closing in 5 minutes, all positions have been closed')


# working, basically creates an open stream and retrieves data every 30 seconds instead of my prior method which
# closed the stream, collected the data, and then reopened it
def websocket_boot():
    try:
        socket_th = th.Thread(target=websocket_bootstrap.start_ws)
        socket_th.daemon = True
        socket_th.start()
    except Exception as error:
        print(error)
        websocket_bootstrap.close_ws()


# working, retrieves data at specified intervals defined in main
def data_thread_marshaller():
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        executor.submit(stock_data_bootstrap.quote_data_processor).result()
        executor.submit(finnhub_tech_bootstrap.tech_indicator).result()


# working, get data one time that does not need to be retrieved again
def initial_fetch():
    # check and see if we dont already have the information
    # make a list with 4 of the initial fetches in there (I plan to add more)
    # append to the list if the system detects we have already gathered that information
    last_business_day = dt.datetime.today() if BDay().is_on_offset(dt.datetime.today()) and market_closed_bool else dt.datetime.today() - BDay(1)
    # reason for this confusingness is because the us treasury department puts out new rates at 3pm CST every day,
    # libor does not update todays rates until the next day
    tbond_business_day = dt.datetime.strftime(last_business_day, '%m-%d-%Y')
    libor_business_day = dt.datetime.strftime(dt.datetime.today() - BDay(1), '%m-%d-%Y')

    cwd = os.getcwd()
    fetched_information = []
    libor_yields = None

    libor_files = glob.glob(cwd + r"\Daily Stock Analysis\Bonds\LIBOR Yields (*).xlsx")
    if len(libor_files) > 0:
        for file in libor_files:
            try:
                libor_df = pd.read_excel(fr"{cwd}\Daily Stock Analysis\Bonds\LIBOR Yields ({libor_business_day}).xlsx", sheet_name=f"LIBOR Yields")
                libor_yields = tuple(libor_df[libor_business_day].to_list())
                fetched_information.append('LIBOR')
            except FileNotFoundError:
                os.remove(file)

    # treasury bond yields are unused
    bond_files = glob.glob(cwd + r"\Daily Stock Analysis\Bonds\US T-Bond Yields (*).xlsx")
    if len(bond_files) > 0:
        for file in bond_files:
            try:
                bond_df = pd.read_excel(fr"{cwd}\Daily Stock Analysis\Bonds\US T-Bond Yields ({tbond_business_day}).xlsx",
                                        sheet_name=f"Treasury Bond Yields").set_index('Date')
                # unused
                treasury_bond_yields = tuple(bond_df.iloc[-1].to_list())
                fetched_information.append('T-Bond')
            except FileNotFoundError:
                os.remove(file)

    with sqlite3.connect(cwd + r'\Databases\quotes.db') as db:
        db.row_factory = dict_factory
        cursor = db.cursor()
        initial_quote_fetch = {}
        for stock in stock_tickers:
            # check if initial quotes exist
            cursor.execute(f"select name from sqlite_master where type = 'table' and name = 'initial_quote_{stock}'")
            table_name = cursor.fetchall()
            if len(table_name) == 1:
                cursor.execute(f"select * from initial_quote_{stock}")
                initial_quote_fetch[stock] = cursor.fetchall()[-1]

        if len(initial_quote_fetch) == len(stock_tickers):
            fetched_information.append(f'Initial Quote')

    logging.debug(f"information already fetched: {fetched_information}")
    # initial fetches, the fetched information list shows us what we already have so we dont retrieve it again
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        if 'Initial Quote' not in fetched_information:
            initial_quote_fetch = executor.submit(stock_data_bootstrap.initial_quote_data_fetch).result()
        else:
            logging.debug(f"Initial Quote information for {dt.date.today()} already exists")
        stock_quotes = executor.submit(stock_data_bootstrap.quote_data_processor).result()

        if 'T-Bond' not in fetched_information:
            t_bond_yields = executor.submit(bond_bootstrap.treasury_bond_yields).result()
        else:
            logging.debug(f"T-bond information for {tbond_business_day} already exists")

        if 'LIBOR' not in fetched_information:
            libor_yields = executor.submit(bond_bootstrap.LIBOR_yields).result()
        else:
            logging.debug(f"LIBOR information for the previous business day {libor_business_day} already exists")

        ti_fetch = executor.submit(finnhub_tech_bootstrap.tech_indicator).result()

    try:
        if 'Initial Quote' not in fetched_information:
            db_bootstrap.initial_quote_insertion(initial_quote_fetch, 'quotes.db')

        logging.debug("Options gathering started")
        options_bootstrapper = Options(stock_tickers=stock_tickers, initial_data=initial_quote_fetch, quote_data=stock_quotes,
                                        rate=libor_yields, cwd=current_directory, bbond=bond_bootstrap)
        options_bootstrapper.thread_marshaller()
        logging.debug("Options gathering completed")

        return options_bootstrapper, initial_quote_fetch, stock_quotes, libor_yields, ti_fetch
    except Exception as error:
        logging.error(f"Exception occurred {error}", exc_info=True)


# WIP as of 5/9/2022
def initial_analysis():
    # we should consider "strike pinning" aka options strikes with high open interest
    max_pain, strike_pins = options_bootstrapper.options_fetch(stock_quote_data)
    # we want to project a position size over the course of the day
    # we don't want to risk more than 10% of the account on the total size of a position
    # on a singular stock, this should be a customizable option eventually
    if dt.datetime.combine(dt.date.today(), market_close) - dt.datetime.now() < dt.timedelta(hours=1):
        logging.warning("Warning, one hour to market close, reducing maximum position size to 25%")
        max_account_risk = .25 * (.1 * account_balance)
    else:
        max_account_risk = .1 * account_balance

    with sqlite3.connect(os.getcwd() + r"\Databases\positions.db") as db:
        db.execute("""CREATE TABLE if not exists projected_positions (
                                    stock TEXT NOT NULL,
                                    time TIMESTAMP NOT NULL, 
                                    size DECIMAL NOT NULL, 
                                    rating TEXT NOT NULL)""")
        db.commit()

        projected_positions = db.execute("select * from projected_positions where time > (?)",
                                        ((dt.datetime.now() - dt.timedelta(hours=1)),)).fetchall()
        if len(projected_positions) == 0:
            # truncate the table
            db.execute("delete from projected_positions;")
            db.commit()

            # determine maximum size of position
            # here is some of the basic logic to work off of, if the stock is volatile (which it should be due to
            # high stock OBV) then we want to have a smaller position in order to mitigate huge price swings
            # this function is meant to be ran at the beginning of the trading day
            for stock in stock_tickers:
                stock_price = stock_quote_data[stock][-1]['price']
                try:
                    intraday_trades_df = pd.read_excel(f'Daily Stock Analysis/Trades/{stock} Intraday {dt.date.today()}.xlsx',
                                                        sheet_name=f"{stock} Intraday Trades")

                    intraday_high = intraday_trades_df['High'].max()
                    intraday_low = intraday_trades_df['Low'].min()
                    #intraday_range = f'{intraday_high} - {intraday_low}'

                    mean = intraday_trades_df['Adj Close'].mean()
                    volatility = intraday_trades_df['Adj Close'].var()

                    percentage_from_top_range = ((intraday_high - stock_price) / stock_price)
                    percentage_from_bottom_range = ((stock_price - intraday_low) / stock_price)

                    technicals = ti_data[stock][-1]
                    sigma = volatility / stock_price

                    positive_direction = technicals['buy']
                    negative_direction = technicals['sell']
                    neutral_direction = technicals['neutral']
                    # have a voting system that judges the likelihood of price movements
                    # this is mostly just meant to reinforce the indicators that we have fetched earlier by factoring
                    # in trends
                    if percentage_from_bottom_range > percentage_from_top_range:
                        # top end of range
                        if stock_price > mean:
                            if stock_price + (sigma * stock_price) > intraday_high:
                                positive_direction += 2
                    else:
                        if stock_price < mean:
                            if stock_price - (sigma * stock_price) < intraday_low:
                                negative_direction += 2

                    if technicals['momentum'] == 'strong positive':
                        if technicals['trending'] == 'strong':
                            positive_direction += 2
                        else:
                            positive_direction += 1
                    elif technicals['momentum'] == 'positive':
                        if technicals['trending'] == 'strong':
                            positive_direction += 1
                    elif technicals['momentum'] == 'strong negative':
                        if technicals['trending'] == 'strong':
                            negative_direction += 2
                        else:
                            negative_direction += 1
                    elif technicals['momentum'] == 'negative':
                        if technicals['trending'] == 'strong':
                            negative_direction += 1
                    else:
                        neutral_direction += 1

                    # if stock price is significantly above max pain, we can expect price to reduce and vice versa
                    if max_pain[stock] > (1.02 * stock_price):
                        positive_direction += 1
                    elif max_pain[stock] < (.98 * stock_price):
                        negative_direction += 1

                    if positive_direction > (negative_direction + neutral_direction):
                        position_size = 0.8 * max_account_risk
                        rating = 'expected long'
                    elif negative_direction > (positive_direction + neutral_direction):
                        position_size = 0.8 * max_account_risk
                        rating = 'expected short'
                    elif positive_direction > negative_direction:
                        position_size = 0.6 * max_account_risk
                        rating = 'probable long'
                    elif negative_direction > positive_direction:
                        position_size = 0.6 * max_account_risk
                        rating = 'probable short'
                    else:
                        position_size = 0.4 * max_account_risk
                        rating = 'neutral'

                    db.execute("insert into projected_positions values (?, ?, ?, ?)",
                                (stock, dt.datetime.now(), position_size, rating))
                    db.commit()
                except Exception as e:
                    logging.error(e)
    return strike_pins


def cleanup():
    # needs to remove the far dated elements in the sql databases
    db_bootstrap.cleanup_of_trade_database('trades.db')
    db_bootstrap.cleanup_of_quote_database('quotes.db')
    db_bootstrap.cleanup_of_indicators_database('indicators.db')


# not all of these modules included in here have been tested
def data_analysis(tick_test_dupe):
    analysis_module = stockAnalysis(stock_tickers, stock_quote_data, ti_data, indicator_votes, current_directory)
    b_l, s_l = analysis_module.indicator_analysis(stock_shortlist, stock_buylist, 'indicators.db')
    tick_test, volume_dict = analysis_module.trade_analysis(tick_test_dupe, 'trades.db')
    option_analysis = analysis_module.option_analysis()
    print('change in options volume:')
    print(option_analysis)

    for stock in stock_tickers:
        if volume_dict[stock]['30_s']['buys'] == volume_dict[stock]['1_m']['buys'] or \
                volume_dict[stock]['1_m']['buys'] == volume_dict[stock]['2_m']['buys']:
            continue
        else:
            print('purchasing analysis function entered')
            s_b, b, w_b, s_s, s, w_s = purchasingAnalysis([stock], volume_dict, b_l, s_l,
                                                        current_directory).analysis_operations()
            print(s_b, b, w_b, s_s, s, w_s)
            # trade_bootstrap.trade_execution(account_balance, s_b, b, w_b, s_s, s, w_s)
        # clear out these dictionaries to save memory (especially because the trade data variable is massive)
        stock_quote_data[stock] = []
        trade_data[stock] = []
        ti_data[stock] = []
    return tick_test


if __name__ == '__main__':
    # Change root logger level from WARNING (default) to NOTSET in order for all messages to be delegated.
    logging.getLogger().setLevel(logging.NOTSET)

    # Add stdout handler, with level INFO
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(logging.INFO)
    formatter = logging.Formatter('%(name)-13s: %(levelname)-8s %(message)s')
    console.setFormatter(formatter)
    logging.getLogger().addHandler(console)

    # Add file rotating handler, with level DEBUG
    if os.path.exists('temp.log'):
        os.remove('temp.log')
    rotatingHandler = logging.handlers.RotatingFileHandler(filename='temp.log', maxBytes=(50*1024*1024), backupCount=5, mode='w')
    rotatingHandler.setLevel(logging.DEBUG)
    formatter2 = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    rotatingHandler.setFormatter(formatter2)
    logging.getLogger().addHandler(rotatingHandler)
    log = logging.getLogger("app." + __name__)

    # check google for an internet connection
    conn = httplib.HTTPConnection(r"www.google.com", timeout=5)
    no_internet_boolean = None
    current_directory = os.getcwd()
    try:
        conn.request("HEAD", "/")
    except Exception as e:
        logging.critical("You need to have an internet connection to use the trading client")
        no_internet_boolean = True
    finally:
        conn.close()

        # have this here just to make sure nothing gets corrupted since the excel files seem to get destroyed sometimes
        logging.critical("Performing maintenance checks on databases")
        file_handler_module = filePruning(current_directory)
        file_handler_module.initialize_directories()
        file_handler_module.prune_files()
        file_handler_module.excel_handler()

        verifyFileIntegrity(current_directory).check_files()

        # initialize all the databases
        db_initializer = databaseInitializer(cwd=current_directory)
        troublesome_dbs = db_initializer.verify_db_integrity()
        if len(troublesome_dbs) > 0:
            logging.warning(f"The following dbs were removed due to integrity issues: {troublesome_dbs}")
        else:
            logging.critical("No database issues were detected")
        # obviously need an internet connection
        if no_internet_boolean:
            sys.exit(0)

    # initialize all of these keys that we need to connect to our account
    api, alpaca_data_keys, finnhub_token, brokerage_keys = db_initializer.check_for_account_details()
    account = api.get_account()
    clock = api.get_clock()

    # the account balance is doubled with margin, I don't really want to rely off margin so hence we divide by 2
    account_balance = float(account.buying_power) / 2
    print('Trading account status:', account.status)
    print('Current account balance (without margin) is: $' + str(round(account_balance, 2)))

    market_close, market_closed_bool = time_initialization()
    manual_override_bool, choice = inputWithTimeout().override()

    # this is just for the manual option if the choice was specified
    if manual_override_bool is True:
        print("Select from one of the following choices:")
        print("Press 1 for Automated Stock Fetch and Trading")
        print("Press 2 for Manual Stock Fetch and Automated Trading")
        print("Press 3 for Portfolio Analysis")
        while True:
            try:
                choice = int(input('Enter: '))
                if choice > 3:
                    raise ValueError
            except ValueError:
                print('Invalid input')
                continue
            else:
                break

    stock_tickers = []
    if choice == 1:
        stock_tickers = APIbootstrap(_api=api, cwd=current_directory).get_tickers()
    elif choice == 2:
        print("Input stock tickers separated by a space, the quotes and trades for each stock will be streamed")
        print("When you are done entering tickers, press Enter to show the quotes for each stock in order")
        print("Type 'close' in order to close all current positions")
        stock_tickers = input('Enter Ticker(s): ').upper().split()

        while True:
            try:
                if stock_tickers == ['CLOSE']:
                    api.cancel_all_orders()
                    api.close_all_positions()
                    stock_tickers = input('Positions have been closed, Enter Ticker(s): ').upper().split()

                for position, item in enumerate(stock_tickers):
                    try:
                        asset = api.get_asset(item)
                        if not asset.tradable:
                            print(item, 'is not available to trade on Alpaca!')
                            stock_tickers[position] = input('Enter different ticker: ').upper()
                        continue
                    except Exception as e:
                        print(e)
                        print(stock_tickers[position], 'is not a valid ticker!')
                        stock_tickers[position] = input('Enter a different ticker: ').upper()

                for stock in stock_tickers:
                    try:
                        asset = api.get_asset(stock)
                        if not asset.tradable:
                            raise Exception("Not Tradable")
                    except Exception:
                        raise Exception("Not Tradable")
                break
            except Exception as stockinputerror:
                print(stockinputerror)
                print("There was a problem with the ticker(s) that you entered")
                continue

    # Start of main program
    if not choice == 3:
        while True:
            trade_data = {}
            stock_quote_data = {}
            ti_data = {}
            indicator_votes = {}
            stock_buylist = {}
            stock_shortlist = {}
            tick_test = {}
            for stock in stock_tickers:
                stock_buylist[stock] = []
                stock_shortlist[stock] = []
                trade_data[stock] = []
                stock_quote_data[stock] = []
                ti_data[stock] = []
                indicator_votes[stock] = {'Bullish Votes': 0, 'Bearish Votes': 0, 'Neutral Votes': 0}
                uptick = False
                downtick = False
                zerotick = False
                tick_test[stock] = [uptick, downtick, zerotick]

            # custom error messages
            errormessage_market_close = 'The market is currently closed'
            errormessage_5min_to_close = 'The market is closing in 5 minutes, be warned that any new positions ' \
                                        'may be held until the next trading day'
            errormessage_trade_fetch = 'No trades gathered'
            cutoff_bool = False

            # boot-strappers, these serve the purpose of initializing classes so the multi-threading works fine
            stock_data_bootstrap = stockDataEngine(stock_tickers)
            websocket_bootstrap = WebsocketBootStrapper(stock_tickers, trade_data, finnhub_token, alpaca_data_keys[0], alpaca_data_keys[1])
            finnhub_tech_bootstrap = technicalIndicators(stock_tickers, ti_data, current_directory)

            bond_bootstrap = bondYields(dt.date.today(), current_directory)
            db_bootstrap = databaseInitializer(stock_tickers, current_directory)
            db_bootstrap.cleanup_options_database()
            # end boot-strappers
            #######################################################################################################
            print("Starting Initial Fetch, this may take several minutes")
            options_bootstrapper, initial_quote_fetch, stock_quote_data, libor_yields, ti_data = initial_fetch()
            websocket_boot()
            strike_pins = initial_analysis()

            while True:
                db_bootstrap.generation_of_trade_database('trades.db')
                db_bootstrap.generation_of_quote_database('quotes.db')
                db_bootstrap.generation_of_indicators_database('indicators.db')

                troublesome_dbs = db_bootstrap.verify_db_integrity()
                if len(troublesome_dbs) == 0:
                    break
            while True:
                data_thread_marshaller()
                trade_data = websocket_bootstrap.return_data()

                trade_data = db_bootstrap.insertion_into_database(trade_data, 'trades.db')
                stock_quote_data = db_bootstrap.insertion_into_quote_database(stock_quote_data, 'quotes.db')
                ti_data = db_bootstrap.insertion_into_indicators_database(ti_data, 'indicators.db')

                # data analysis is untested
                tick_test = data_analysis(tick_test)
                cleanup()
                time.sleep(5)
    portfolio_bootstrap = portfolioAnalysis(api=api, cwd=current_directory)
    portfolio_bootstrap.main()
  `

  return (
    <SyntaxHighlighter language="python" style={a11yDark}>
      {codeString}
    </SyntaxHighlighter>
  )
}

export default PyCharmCodeDisplay
