/* eslint-disable no-unused-expressions */
import { useRef, useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import '../styles/Select.scss';
import getCurrencies from '../services/currency';

const Home = () => {
    const selectStyle = {
        boxShadow: 'none',
        border: '1px solid #E4E5E7',
        borderRadius: '9px',
        backgroundColor: '#FAFAFB',
    };

    const [currency, setCurrency] = useState([]);

    useEffect(() => {
        async function fetchCurrencies() {
            const currencies = await getCurrencies();
            setCurrency(currencies);
        }

        fetchCurrencies();
    }, []);

    const options = currency // +++++++++++++++++++++

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            <div className={styles.sideBar}>
                <div className={styles.sideBar__header}>
                    <div className={styles.sideBar__header__text}>Фильтр</div>
                    <div className={styles.sideBar__header__reset}>
                        Сбросить
                    </div>
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Регион</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Все регионы"
                        options={options}
                        //onChange={(values) => this.onChange(values)}
                    />
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Зарплата</div>
                    <div className={styles.sideBar__area__input__container}>
                        <span className={styles.sideBar__area__input__text}>
                            От
                        </span>
                        <input
                            type="text"
                            className={styles.sideBar__area__input__element}
                        ></input>
                    </div>
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Валюта</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={currency}
                        //onChange={(values) => this.onChange(values)}
                    />
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>
                        Опыт работы
                    </div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options}
                        //onChange={(values) => this.onChange(values)}
                    />
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Вид работы</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options}
                        //onChange={(values) => this.onChange(values)}
                    />
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>
                        График работы
                    </div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options}
                        //onChange={(values) => this.onChange(values)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
