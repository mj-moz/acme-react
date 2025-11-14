import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="left-div logo">
        ACME
      </div>
      <div className="right-div">
        <i className="fa-brands fa-square-twitter"></i>
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-instagram"></i>
      </div>
    </footer>
  );
};

export default Footer;
