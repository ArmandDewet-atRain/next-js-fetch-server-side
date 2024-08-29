'use client';

import React from 'react';
import styles from '../styles/HeaderFooter.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>Rain Configuration Management</h1>
    </header>
  );
};

export default Header;
