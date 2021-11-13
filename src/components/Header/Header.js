import React from 'react';
import styles from './Header.module.css';

function Header() {
    return (
        <header className={styles.Header}>
            <h1 className={styles.title}>Jex Programming Language</h1>
            <nav className={styles.nav}>
                <ul className={styles.navList}>
                    <li>
                        <a href="https://github.com/Furetur/JexCompiler#examples" className={styles.navLink}>Examples</a>
                    </li>
                    <li>
                        <a href="https://github.com/Furetur/JexCompiler" className={styles.navLink}>Github</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
