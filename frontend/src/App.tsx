import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import BuyPage from './pages/BuyPage';
import SearchPage from './pages/SearchPage';
import ListItemButton from '@mui/material/ListItemButton';

const drawerWidth = 240;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('Buy');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        anchor="left"
      >
        <List>
          {['Buy', 'Search'].map((page) => (
            <ListItemButton key={page} selected={currentPage === page} onClick={() => handlePageChange(page)}>
              <Button >{page}</Button>
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          {currentPage === 'Buy' ? 'Buy' : 'Search'}
          <Divider sx={
            { margin: '10px 0' }
          } />
        </Typography>
        {/* 在这里根据currentPage显示不同的页面内容 */}
        {currentPage === 'Buy' && <BuyPage />}
        {currentPage === 'Search' && <SearchPage />}
      </main>
    </div>
  );
};

export default App;
