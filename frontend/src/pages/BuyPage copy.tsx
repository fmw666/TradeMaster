import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  NativeSelect,
  TextField,
  Typography,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import MultiInput, { OptionType } from '../components/MultiInput';
import TradeTable, { TableDataType } from '../components/TradeTable';

const BuyPage: React.FC = () => {
  const [accounts, setAccounts] = useState<OptionType[]>([]);
  const [tickers, setTickers] = useState<OptionType[]>([]);
  const [accountAssetMap, setAccountAssetMap] = useState(new Map<number, number>());
  const [tickerPriceMap, setTickerPriceMap] = useState(new Map<number, number>());
  const [selectedAccounts, setSelectedAccounts] = useState<OptionType[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<OptionType[]>([]);
  const [algorithm, setAlgorithm] = useState('VWAP');
  const [percent, setPercent] = useState<number>(0);
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const [selectedTableData, setSelectedTableData] = useState<TableDataType[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchAccounts = () => {
    fetch('http://127.0.0.1:8000/api/accounts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // [{ id, name }, ...]
        const accounts: OptionType[] = data.map((account: any) => ({
          id: account.id,
          name: account.name,
        }));
        setAccounts(accounts);
        // { id: asset, ... }
        const accountAssetMap = new Map<number, number>();
        data.forEach((account: any) => {
          accountAssetMap.set(account.id, account.aum);
        });
        setAccountAssetMap(accountAssetMap);
      })
      .catch(error => {
        // 处理错误
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const fetchTickers = () => {
    fetch('http://127.0.0.1:8000/api/stocks')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // [{ id, name }, ...]
        const tickers: OptionType[] = data.map((ticker: any) => ({
          id: ticker.id,
          name: ticker.code,
        }));
        setTickers(tickers);
        // { id: price, ... }
        const tickerPriceMap = new Map<number, number>();
        data.forEach((ticker: any) => {
          tickerPriceMap.set(ticker.id, ticker.current);
        });
        setTickerPriceMap(tickerPriceMap);
      })
      .catch(error => {
        // 处理错误
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  useEffect(() => {
    // 在进入页面时调用API
    fetchAccounts();
    fetchTickers();
  }, []);

  useEffect(() => {
    // 在 selectedAccounts 或 selectedTickers 改变时调用 API
    // 当 selectedAccounts 和 selectedTickers 不为空列表，并且 Percent 大于 0 时，打印 hello
    if (selectedAccounts.length > 0 && selectedTickers.length > 0 && percent > 0) {
      // 构建 table 数据
      // { id: 1, account: 'Account 1', ticker: 'Ticker 1', currentPrice: 100, moneyToBuy: 500, AUM: 1000, volume: 50 }
      // 先循环 accounts 再在里面循环 tickers
      const tableData: TableDataType[] = [];
      for (const account of selectedAccounts) {
        const aum = accountAssetMap.get(account.id) || 0;
        for (const ticker of selectedTickers) {
          const currentPrice = tickerPriceMap.get(ticker.id) || 0;
          const moneyToBuy = aum * percent;
          // 计算 volume: moneyToBuy/currentPrice，不足 100 约掉，比如 58->0 133->100 12222->12200
          const volume = Math.round(Math.floor(moneyToBuy / currentPrice) / 100) * 100;

          tableData.push({
            id: tableData.length + 1,
            account: account.name,
            ticker: ticker.name,
            currentPrice: currentPrice,
            moneyToBuy: moneyToBuy,
            AUM: aum,
            volume: volume,
          });
        }
      }
      setTableData(tableData);
    } else {
      setTableData([]);
    }
  }, [selectedAccounts, selectedTickers, percent]);

  
  const lableStyle = { display: 'flex', alignItems: 'center', width: '70px' };

  const isTimeInRange = (time: string, start: string, end: string) => {
    return time >= start && time <= end;
  };

  const handlePercentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setPercent(isNaN(value) ? 0 : value);
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = event.target.value;
    // 确保新的开始时间在 09:30 到 15:00 之间
    if (isTimeInRange(newStartTime, '09:30', '15:00')) {
      // 如果没有 end time 或新的开始时间在 end time 之前，直接赋值
      if (!endTime || newStartTime < endTime) {
        setStartTime(newStartTime);
      }
    }
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = event.target.value;
    // 确保新的结束时间在 09:30 到 15:00 之间
    if (isTimeInRange(newEndTime, '09:30', '15:00')) {
      // 如果没有 start time 或新的结束时间在 start time 之后，直接赋值
      if (!startTime || newEndTime > startTime) {
        setEndTime(newEndTime);
      }
    }
  };

  const handledAccountInputChange = (newSelectedAccounts: OptionType[]) => {
    setSelectedAccounts(newSelectedAccounts);
  };

  const handleTickerInputChange = (newSelectedTickers: OptionType[]) => {
    setSelectedTickers(newSelectedTickers);
  };

  const onTableSelectedChange = (selectedRows: TableDataType[]) => {
    setSelectedTableData(selectedRows);
    console.log(selectedRows);
  };

  const handleCancelClick = () => {
    setSelectedAccounts([]);
    setSelectedTickers([]);
    setPercent(0);
  };

  const handleSubmitClick = () => {
    // 校验参数
    if (selectedAccounts.length <= 0) {
      alert('Please select at least one item.');
      return;
    }
    // 所有 input 都必须有值
    if (selectedTickers.length <= 0 || percent <= 0 || startTime === '' || endTime === '' || algorithm === '' || selectedAccounts.length <= 0 || selectedTickers.length <= 0 ) {
      alert('Please fill all required fields.');
      return;
    }
    // volume 必须是 100 的倍数
    for (const row of selectedTableData) {
      if (row.volume % 100 !== 0) {
        alert('Volume must be a multiple of 100.');
        return;
      }
    }
    // 提交订单: 遍历 selectedTableData & 构建 body
    // [{ account_id: 1, stock_id: 2, algorithm: 'VWAP', algorithm_start_time: '09:30', algorithm_end_time: '15:00', moneyToBuy: 500, volume: 50 }, ...]
    const bodyData = [];
    for (const row of selectedTableData) {
      const { account, ticker, currentPrice, moneyToBuy, volume } = row;
      const accountId = selectedAccounts.find(accountOption => accountOption.name === account)?.id;
      const tickerId = selectedTickers.find(tickerOption => tickerOption.name === ticker)?.id;
      const algorithmStartTime = startTime;
      const algorithmEndTime = endTime;
      const order = {
        account_id: accountId,
        stock_id: tickerId,
        algorithm: algorithm,
        algorithm_start_time: algorithmStartTime,
        algorithm_end_time: algorithmEndTime,
        money_to_buy: moneyToBuy,
        volume: volume,
      };
      bodyData.push(order);
    }

    fetch('http://127.0.0.1:8000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }).then(response => { 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      alert('Order submitted successfully.');
      window.location.href = '/';
    })
  };

  return (
    <div>
      <Grid container spacing={2}>
        {/* Accounts */}
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <div style={lableStyle}>
              <Typography style={{ color: 'red' }}>*</Typography>
              <Typography>Accounts:</Typography>
            </div>
          </Grid>
          <Grid item>
            <MultiInput options={accounts} selectedOptions={selectedAccounts} onInputChange={handledAccountInputChange} />
          </Grid>
        </Grid>

        {/* Tickers */}
        <Grid item container spacing={2} alignItems="center">
          <Grid item>
            <div style={lableStyle}>
              <Typography style={{ color: 'red' }}>*</Typography>
              <Typography>Tickers:</Typography>
            </div>
          </Grid>
          <Grid item>
            <MultiInput options={tickers} selectedOptions={selectedTickers} onInputChange={handleTickerInputChange} ></MultiInput>
          </Grid>
        </Grid>

        {/* *Percent: input，可以滚轮选择 3%的大小，0~100%，Algorithm: input 有 VWAP 和 TWAP 两个选择，默认选择 VWAP */}
        <Grid item container spacing={2} alignItems="center" >
          {/* Percent */}
          <Grid item>
            <div style={lableStyle}>
              <Typography style={{ color: 'red' }}>*</Typography>
              <Typography>Percent:</Typography>
            </div>
          </Grid>
          <Grid item>
            <TextField
              type='number'
              value={percent}
              onChange={handlePercentChange}
              inputProps={{ min: 0, max: 100, step: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              size='small'
            />
          </Grid>

          {/* Algorithm */}
          <Grid item>
            <div style={lableStyle}>
              <Typography>Algorithm:</Typography>
            </div>
          </Grid>
          <Grid item>
            <FormControl>
              <NativeSelect defaultValue={algorithm} onChange={(event: any) => setAlgorithm(event.target.value)} >
                <option value="VWAP">VWAP</option>
                <option value="TWAP">TWAP</option>
              </NativeSelect>
            </FormControl>
          </Grid>

          {/* Algorithm Time */}
          <Grid item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* * Algorithm Time: input 是左右是开始时间和结束时间，中间是 → 这个符号 */}
              <Typography style={{ color: 'red' }}>*</Typography>
              <Typography>Algorithm Time:</Typography>
            </div>
          </Grid>
          <Grid item>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Input */}
              <TextField type="time" value={startTime} size='small' onChange={handleStartTimeChange} />
              <Typography>~</Typography>
              <TextField type="time" value={endTime} size='small' onChange={handleEndTimeChange} />
            </div>
          </Grid>
        </Grid>
      </Grid>

      {/* 一个表格 */}
      <div style={{ marginTop: '20px' }}>
        {/* 看 tableData 列表有没有值，有的话才显示 Table，否则不显示 */}
        {tableData.length > 0 ? <TradeTable tableData={tableData} onTableSelectedChange={onTableSelectedChange} /> : <></>}
      </div>

      {/* 表格底部... */}

      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <Divider />
          <Button onClick={handleCancelClick} variant="outlined">Cancel</Button>
          <Button
            disabled={selectedTableData.length <= 0}
            variant="contained"
            color="primary"
            style={{ marginLeft: '10px' }}
            onClick={handleSubmitClick}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
