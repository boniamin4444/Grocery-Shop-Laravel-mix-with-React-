import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Category from './components/category/Category';
import ProductManager from './components/product/ProductManager';
import OrderPage from './components/order/OrderPage';
import OrderReportPage from './components/order/OrderReportPage';
import SalesHistoryPage from './components/order/SalesHistoryPage';
import CustomerPaymentPage from './components/duepaidandshow/CustomerPaymentPage';
import CustomerDetailsPage from './components/duepaidandshow/CustomerDetailsPage';
import ProductStockUpdate from './components/stockupdate/ProductStockUpdate';
import InventoryPage from './components/inventory/InventoryPage';
import SupplierPage from './components/suppliers/SupplierPage';
import PurchaseForm from './components/purchase/PurchaseForm';
import PurchasesList from './components/purchase/PurchasesList';
import SupplierPurchasePage from './components/purchase/SupplierPurchasePage';
import ProfitOverviewPage from './components/profit/ProfitOverviewPage';
import ProfitByProductPage from './components/profit/ProfitByProductPage';
import ProfitOverviewByHourly from './components/profit/ProfitOverviewByHourly';









import './components/styles.css';

function App() {
    const [currentPage, setCurrentPage] = useState('Home');

    const handleMenuClick = (page) => {
        setCurrentPage(page);
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'Category':
                return <Category />;
            case 'ProductManager':
                return <ProductManager />;
            case 'OrderPage':
                return <OrderPage />;
            case 'OrderReportPage':
                return <OrderReportPage />;
            case 'SalesHistoryPage':
                return <SalesHistoryPage />;
            case 'CustomerPaymentPage':
                return <CustomerPaymentPage />;
            case 'CustomerDetailsPage':
                return <CustomerDetailsPage />;
            case 'ProductStockUpdate':
                return <ProductStockUpdate />;
            case 'InventoryPage':
                return <InventoryPage />;
            case 'SupplierPage':
                return <SupplierPage />;
            case 'PurchaseForm':
                    return <PurchaseForm />;
            case 'PurchasesList':
                    return <PurchasesList />;
            case 'SupplierPurchasePage':
                return <SupplierPurchasePage />;
            case 'ProfitOverviewPage':
                return <ProfitOverviewPage />;
            case 'ProfitByProductPage':
                return <ProfitByProductPage />;
            case 'ProfitOverviewByHourly':
                    return <ProfitOverviewByHourly />;
            case 'Home':
            default:
                return <Content page={currentPage} />;
        }
    };

    return (
        <div className="app">
            <div className="main-container" style={{ display: 'flex', flex: 1 }}>
                <Sidebar onMenuClick={handleMenuClick} />
                <main style={{ 
                    flex: 1, 
                    padding: '20px', 
                    height: 'calc(100vh - 60px)', 
                    overflowY: 'auto', 
                    backgroundColor: '#f9f9f9',
                    boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)' 
                }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
