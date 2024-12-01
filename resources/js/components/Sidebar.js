import React, { useState } from 'react';
import { FaTachometerAlt, FaChartLine, FaCog, FaUser, FaInfoCircle, FaChartBar, 
    FaChartPie, FaUserShield, FaUserCog, FaFolder, FaShoppingCart, 
    FaClipboardList, FaClipboardCheck, FaHistory, FaBoxOpen, FaHeadset, 
    FaDollarSign, FaTasks, FaUsers, FaClipboard, FaChartArea, 
    FaMoneyBillWave, FaRegClock, FaCogs, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';

function Sidebar({ onMenuClick }) {
    const [openMenu, setOpenMenu] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar toggle state

    const toggleSubMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);  // Toggle submenu visibility
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    const handleLogout = () => {
        // Handle logout logic here
    };

    return (
        <>
            {/* Header Component */}
            <header style={headerStyle}>
                <span style={brandStyle}>General Shop
                    <button onClick={toggleSidebar} style={headerButtonStyle}>
                        ☰
                    </button>
                </span>
            </header>

            {/* Sidebar */}
            <aside className={isSidebarOpen ? 'aside-open' : ''} style={isSidebarOpen ? {} : sidebarClosedStyle}>
                <h3>Menu</h3>
                <ul>
                    {/* Dashboard Menu */}
                    <li>
                        <button onClick={() => toggleSubMenu('dashboard')} style={buttonStyle}>
                            <FaTachometerAlt style={iconStyle} /> Dashboard
                        </button>
                        {openMenu === 'dashboard' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('Dashboard Overview')} style={subMenuItemStyle}>
                                    <FaChartPie style={subIconStyle} /> Overview
                                </li>
                                <li onClick={() => onMenuClick('Dashboard Analytics')} style={subMenuItemStyle}>
                                    <FaChartBar style={subIconStyle} /> Analytics
                                </li>
                                <li onClick={() => onMenuClick('Dashboard Reports')} style={subMenuItemStyle}>
                                    <FaChartPie style={subIconStyle} /> Reports
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Suppliers Menu */}
                    <li>
                        <button onClick={() => toggleSubMenu('suppliers')} style={buttonStyle}>
                            <FaUserShield style={iconStyle} /> Suppliers
                        </button>
                        {openMenu === 'suppliers' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('SupplierPage')} style={subMenuItemStyle}>
                                    <FaClipboardList style={subIconStyle} /> View Suppliers
                                </li>
                                <li onClick={() => onMenuClick('AddSupplier')} style={subMenuItemStyle}>
                                    <FaUser style={subIconStyle} /> Add New Supplier
                                </li>
                                <li onClick={() => onMenuClick('SupplierReport')} style={subMenuItemStyle}>
                                    <FaChartLine style={subIconStyle} /> Supplier Reports
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Purchased Products Menu */}
                    <li>
                        <button onClick={() => toggleSubMenu('purchasedProducts')} style={buttonStyle}>
                            <FaCogs style={iconStyle} /> Purchased Products
                        </button>
                        {openMenu === 'purchasedProducts' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('PurchasesList')} style={subMenuItemStyle}>
                                    View Purchase Products
                                </li>
                                <li onClick={() => onMenuClick('PurchaseForm')} style={subMenuItemStyle}>
                                    Add New Purchase
                                </li>
                                <li onClick={() => onMenuClick('SupplierPurchasePage')} style={subMenuItemStyle}>
                                    Purchase History
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Category Menu */}
                    <li onClick={() => onMenuClick('Category')} style={buttonStyle}>
                        <FaFolder style={iconStyle} /> Category
                    </li>

                    {/* Product Menu */}
                    <li onClick={() => onMenuClick('ProductManager')} style={buttonStyle}>
                        <FaFolder style={iconStyle} /> Product
                    </li>

                    {/* Sales Menu with Submenus */}
                    <li>
                        <button onClick={() => toggleSubMenu('sales')} style={buttonStyle}>
                            <FaShoppingCart style={iconStyle} /> Sales
                        </button>
                        {openMenu === 'sales' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('OrderPage')} style={subMenuItemStyle}>
                                    <FaClipboardList style={subIconStyle} /> Create Sales
                                </li>
                                <li onClick={() => onMenuClick('OrderReportPage')} style={subMenuItemStyle}>
                                    <FaClipboardCheck style={subIconStyle} /> Completed Sales
                                </li>
                                <li onClick={() => onMenuClick('SalesHistoryPage')} style={subMenuItemStyle}>
                                    <FaHistory style={subIconStyle} /> Sales History
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Profit Menu with Submenus */}
                    <li>
                        <button onClick={() => toggleSubMenu('profit')} style={buttonStyle}>
                            <FaDollarSign style={iconStyle} /> Profit
                        </button>
                        {openMenu === 'profit' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('ProfitOverviewPage')} style={subMenuItemStyle}>
                                    <FaChartLine style={subIconStyle} /> Profit Overview
                                </li>
                                <li onClick={() => onMenuClick('ProfitByProductPage')} style={subMenuItemStyle}>
                                    <FaClipboard style={subIconStyle} /> Profit by Product
                                </li>
                                <li onClick={() => onMenuClick('ProfitByCategory')} style={subMenuItemStyle}>
                                    <FaFolder style={subIconStyle} /> Profit by Category
                                </li>
                                <li onClick={() => onMenuClick('ProfitOverviewByHourly')} style={subMenuItemStyle}>
                                    <FaUserShield style={subIconStyle} /> Filter Profit by Hourly
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Product Stock Update Menu */}
                    <li onClick={() => onMenuClick('ProductStockUpdate')} style={buttonStyle}>
                        <FaChartLine style={iconStyle} /> Stock Update
                    </li>

                    {/* Due Update Menu with Submenus */}
                    <li>
                        <button onClick={() => toggleSubMenu('dueUpdate')} style={buttonStyle}>
                            <FaMoneyBillWave style={iconStyle} /> Due Update
                        </button>
                        {openMenu === 'dueUpdate' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('CustomerPaymentPage')} style={subMenuItemStyle}>
                                    <FaRegClock style={subIconStyle} /> View Due & Updates
                                </li>
                                <li onClick={() => onMenuClick('CustomerDetailsPage')} style={subMenuItemStyle}>
                                    <FaDollarSign style={subIconStyle} /> All Due List
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Analytics Menu with Submenus */}
                    <li>
                        <button onClick={() => toggleSubMenu('analytics')} style={buttonStyle}>
                            <FaChartLine style={iconStyle} /> Analytics
                        </button>
                        {openMenu === 'analytics' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('ProfitAnalysis')} style={subMenuItemStyle}>
                                    <FaChartArea style={subIconStyle} /> Profit Analysis
                                </li>
                                <li onClick={() => onMenuClick('SalesReport')} style={subMenuItemStyle}>
                                    <FaChartPie style={subIconStyle} /> Sales Report
                                </li>
                                <li onClick={() => onMenuClick('EmployeeReport')} style={subMenuItemStyle}>
                                    <FaUsers style={subIconStyle} /> Employee Report
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Inventory Menu with Submenus */}
                    <li>
                        <button onClick={() => toggleSubMenu('inventory')} style={buttonStyle}>
                            <FaBoxOpen style={iconStyle} /> Inventory
                        </button>
                        {openMenu === 'inventory' && (
                            <ul style={subMenuStyle}>
                                <li onClick={() => onMenuClick('InventoryPage')} style={subMenuItemStyle}>
                                    <FaClipboardList style={subIconStyle} /> View Inventory
                                </li>
                                <li onClick={() => onMenuClick('InventoryForm')} style={subMenuItemStyle}>
                                    <FaClipboardCheck style={subIconStyle} /> Add New Item
                                </li>
                                <li onClick={() => onMenuClick('InventoryHistory')} style={subMenuItemStyle}>
                                    <FaHistory style={subIconStyle} /> Inventory History
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Settings Menu */}
                    <li>
                        <button onClick={() => onMenuClick('Settings')} style={buttonStyle}>
                            <FaCogs style={iconStyle} /> Settings
                        </button>
                    </li>

                    {/* Logout */}
                    <li>
                        <button onClick={handleLogout} style={buttonStyle}>
                            <FaSignOutAlt style={iconStyle} /> Logout
                        </button>
                    </li>
                </ul>
            </aside>
        </>
    );
}

const headerStyle = {
    backgroundColor: '#82c2c2',
    color: 'black',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000
};

const brandStyle = {
    fontSize: '20px',
    fontWeight: 'bold'
};

const headerButtonStyle = {
    backgroundColor: '#82c2c2',
    border: 'none',
    color: 'black',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '20px'
};

const sidebarClosedStyle = {
    display: 'none'
};

const buttonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'black',
    padding: '10px 20px',
    textAlign: 'left',
    width: '100%',
    fontSize: '16px',
    cursor: 'pointer'
};

const iconStyle = {
    marginRight: '10px',
    fontSize: '18px'
};

const subMenuStyle = {
    paddingLeft: '20px',
    paddingTop: '5px',
    transition: 'margin-left 0.3s ease',
    marginLeft: '20px'
};

const subMenuItemStyle = {
    padding: '5px 0',
    fontSize: '16px',
    cursor: 'pointer'
};

const subIconStyle = {
    marginRight: '8px'
};

export default Sidebar;
