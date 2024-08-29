'use client';

import React from 'react';
import styles from '../styles/HeaderFooter.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2024 Rain. All rights reserved.</p>
    </footer>
  );
};

export default Footer;