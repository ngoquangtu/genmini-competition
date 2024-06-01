import React from 'react';
import { COLORS } from './constant/constant.js';

function Footer() {
  const styles = {
    footer: {
      backgroundColor: COLORS.darkBlue,
      color: COLORS.white,
      padding: '1rem',
      textAlign: 'center',
    },
    text: {
      fontSize: '1rem',
    },
    link: {
      color: COLORS.white,
      textDecoration: 'none',
      transition: 'color 0.3s',
      margin: '0 1rem',
    },
    hoverLink: {
      color: COLORS.lightGray,
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.text}>
        © 2024 Bách Khoa Toàn Thư. All rights reserved.
      </div>
      <div style={styles.text}>
        Developed by Ngô Quang Tú
      </div>
    </footer>
  );
}

export default Footer;
