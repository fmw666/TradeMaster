import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

export interface TableDataType {
  id: number;
  account: string;
  ticker: string;
  currentPrice: number;
  moneyToBuy: number;
  AUM: number;
  volume: number;
}

interface TradeTableProps {
  tableData: TableDataType[];
  onTableSelectedChange: (selectedRaws: TableDataType[]) => void;
  volumeReadOnly?: boolean;
}

export default function TradeTable ({ tableData, onTableSelectedChange, volumeReadOnly = false }: TradeTableProps) {
  const [data, setData] = React.useState<TableDataType[]>(tableData);
  const [selected, setSelected] = React.useState<TableDataType[]>([]);
  // const [data, setData] = React.useState<TableDataType[]>([
  //   { id: 1, account: 'Account 1', ticker: 'Ticker 1', currentPrice: 100, moneyToBuy: 500, AUM: 1000, volume: 50 },
  //   { id: 2, account: 'Account 2', ticker: 'Ticker 2', currentPrice: 150, moneyToBuy: 700, AUM: 1200, volume: 60 },
  //   // Add more data as needed
  // ]);

  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const isSelected = (id: number) => selected.some(item => item.id === id);

  const handleClick = (event: React.MouseEvent<HTMLTableRowElement>, id: number) => {
    const selectedIndex = selected.findIndex(item => item.id === id);
    let newSelected: TableDataType[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, data.find(item => item.id === id)!);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    onTableSelectedChange(newSelected);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // const newSelecteds = data.map((n) => n.id.toString());
      setSelected(data);
      onTableSelectedChange(data);
      return;
    }
    setSelected([]);
    onTableSelectedChange([]);
  };

  const handleChangeVolume = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    // const newData = [...data];
    // const dataIndex = newData.findIndex(item => item.id.toString() === id);
    // newData[dataIndex][event.target.name] = event.target.value;
    // setData(newData);
    const newValue = event.target.value;
    let newVolume = 0;

    if (newValue === '') {
      newVolume = 0;
    } else if (parseInt(newValue) % 100 !== 0) {
      // 判断能不能整除100
      // newVolume = Math.round(parseInt(newValue) / 100) * 100;
      newVolume = parseInt(newValue);
    } else {
      newVolume = parseInt(newValue);
    }
    
    const newTableData = data.map(item =>
      item.id === id ? { ...item, volume: newVolume } : item
    );
    setData(newTableData);
    onTableSelectedChange(newTableData);
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" style={{ backgroundColor: '#f2f2f2' }}>
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
              />
            </TableCell>
            <TableCell style={{ backgroundColor: '#f2f2f2' }}>Account</TableCell>
            <TableCell style={{ backgroundColor: '#f2f2f2' }}>Ticker</TableCell>
            <TableCell style={{ backgroundColor: '#f2f2f2' }}>Current Price</TableCell>
            <TableCell style={{ backgroundColor: '#f2f2f2' }}>Money To buy</TableCell>
            <TableCell style={{ backgroundColor: '#f2f2f2' }}>AUM</TableCell>
            <TableCell style={{ backgroundColor: '#f2f2f2' }}>Volume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              selected={isSelected(row.id)}
              hover
              onClick={(event) => handleClick(event, row.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(row.id)}
                  inputProps={{ 'aria-labelledby': `checkbox-${row.id}` }}
                />
              </TableCell>
              <TableCell>{row.account}</TableCell>
              <TableCell>{row.ticker}</TableCell>
              <TableCell>{row.currentPrice}</TableCell>
              <TableCell>{row.moneyToBuy}</TableCell>
              <TableCell>{row.AUM}</TableCell>
              <TableCell>
                {volumeReadOnly? (  
                  row.volume
                ) : (
                  <TextField
                    name='volume'
                    value={row.volume}
                    type='number'
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => handleChangeVolume(event, row.id)}
                    size='small'
                    inputProps={{ min: 0, max: 100000000, step: 100 }}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
