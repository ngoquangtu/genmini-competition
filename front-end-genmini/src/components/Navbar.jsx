import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { COLORS } from './constant/constant.js';

function Navbar() {
  const location = useLocation();

  const styles = {
    navbar: {
      backgroundColor: COLORS.darkBlue,
      padding: '1rem',
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: COLORS.white,
      textDecoration: 'none',
    },
    links: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginLeft: '2rem',
    },
    link: {
      color: COLORS.white,
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'background-color 0.3s, color 0.3s',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
    },
    activeLink: {
      backgroundColor: COLORS.activeBackground,
    },
    hoverLink: {
      backgroundColor: COLORS.hoverBackground,
      color: COLORS.lightGray,
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>Bách Khoa Toàn Thư</Link>
        <div style={styles.links}>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(location.pathname === '/' ? styles.activeLink : {}),
            }}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.hoverLink)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.link, location.pathname === e.target.getAttribute('href') ? styles.activeLink : {})}
          >
            Trang chủ
          </Link>
          <Link
            to="/chat"
            style={{
              ...styles.link,
              ...(location.pathname === '/chat' ? styles.activeLink : {}),
            }}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.hoverLink)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.link, location.pathname === e.target.getAttribute('href') ? styles.activeLink : {})}
          >
            Chat
          </Link>
          <Link
            to="/report"
            style={ {...styles.link,
                ...(location.pathname === '/report' ? styles.activeLink : {}),}}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.hoverLink)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.link)}
          >
            Báo lỗi/Góp ý
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;