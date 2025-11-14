import React from 'react';

interface HeaderProps {
  cartCount: number;
}

const Header: React.FC<HeaderProps> = ({ cartCount }) => {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="header-container">
        <div id="announcment-header">
          <div className="covid-announcement">
            <button id="covid-button">
              <a href="#">Announcement</a>
            </button>
          </div>
          <h3 className="covid-announcement">How we're responding to COVID-19</h3>
        </div>
        <nav className="navbar">
          <div className="navdiv">
            <div className="logo">
              <a href="./index.html">ACME</a>
            </div>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">Donate</a></li>
              <li><a href="#">Contact</a></li>
              <li className="cart">
                <div className="cart-container">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span id="cart-count">{cartCount}</span>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
