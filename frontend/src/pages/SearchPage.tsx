import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React from 'react';
import TradeTable, { TableDataType } from '../components/TradeTable';
import Button from '@mui/material/Button';

interface AccountOption {
  id: number;
  name: string;
}

const SearchPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = React.useState<AccountOption>();
  const [dataOptions, setDataOptions] = React.useState<AccountOption[]>([]);
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  const [selectedTableData, setSelectedTableData] = React.useState<TableDataType[]>([]);

  const onTableSelectedChange = (selectedRows: TableDataType[]) => {
    setSelectedTableData(selectedRows);
  };

  const fetchOrders = (account_id: number) => {
    fetch(`http://127.0.0.1:8000/api/orders?account_id=${account_id}`)
       .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
       .then(data => {
          // [{ id, account_id, symbol, side, price, volume, created_at }, ...]
          const orders: TableDataType[] = data.map((order: any) => ({
            id: order.id,
            account: order.account,
            ticker: order.stock,
            currentPrice: order.current_price,
            moneyToBuy: order.money_to_buy,
            AUM: order.aum,
            volume: order.volume,
          }));
          setTableData(orders);
        })
       .catch(error => {
          // 处理错误
          console.error('There was a problem with the fetch operation:', error);
        });
  }

  const onInputChange = (value: any) => {
    setSelectedOption(value);
    if (value) {
      fetchOrders(value.id)
    } else {
      setTableData([]);
    }
  };
  
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
        const accounts: AccountOption[] = data.map((account: any) => ({
          id: account.id,
          name: account.name,
        }));
        setDataOptions(accounts);
      })
      .catch(error => {
        // 处理错误
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  const onHandleDelete = () => {
    if (selectedTableData.length > 0) {
      const ids = selectedTableData.map(row => row.id);
      fetch(`http://127.0.0.1:8000/api/orders?ids=${ids}`, {
        method: 'DELETE',
      })
       .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
       .then(data => {
          console.log(data);
          setSelectedTableData([]);
          setTableData(tableData.filter(row => !ids.includes(row.id)));
        })
       .catch(error => {
          // 处理错误
          console.error('There was a problem with the fetch operation:', error);
        });
    }
  }
    
  React.useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <div style={{ width: '90%' }}>
        {/* Accounts */}
        <div style={{ display: 'inline-flex', width: '100%', marginBottom: '10px' }}>
          <div style={{ width: '90px', minWidth: '90px', alignSelf: 'center' }}>
            <Typography>Account:</Typography>
          </div>
          <div style={{ width: '100%' }}>
            <Autocomplete
              id='account-input'
              size='small'
              value={selectedOption}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option) => option.name}
              options={dataOptions}
              onChange={(_, value) => onInputChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </div>
        </div>
        <div>
          <div style={{ marginTop: '20px' }}>
            {/* 看 tableData 列表有没有值，有的话才显示 Table，否则不显示 */}
            {tableData.length > 0 ? <TradeTable tableData={tableData} onTableSelectedChange={onTableSelectedChange} volumeReadOnly /> : <>No data!</>}
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', backgroundColor: 'rgb(248, 248, 248)', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 4px 0px', padding: '10px', borderRadius: '5px' }}>
          <Button
            disabled={selectedTableData.length <= 0}
            variant="contained"
            color="error"
            onClick={onHandleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
