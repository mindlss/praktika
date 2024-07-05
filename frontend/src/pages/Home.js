/* eslint-disable no-unused-expressions */
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import '../styles/Select.scss';
import getOptions from '../services/dictionaries';
import getAreas from '../services/areas';

const Home = () => {
    const selectStyle = {
        boxShadow: 'none',
        border: '1px solid #E4E5E7',
        borderRadius: '9px',
        backgroundColor: '#FAFAFB',
    };

    const [options, setOptions] = useState([]);
    const [areas, setAreas] = useState([]);

    const [area, setArea] = useState(null);
    const [salary, setSalary] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [experience, setExperience] = useState(null);
    const [employment, setEmployment] = useState(null);
    const [schedule, setSchedule] = useState(null);

    useEffect(() => {
        async function fetchOptions() {
            const options = await getOptions();
            const areas = await getAreas();
            setOptions(options);
            setAreas(areas);
        }

        fetchOptions();
    }, []);

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
                    <div className={styles.sideBar__header__reset} onClick={() => {
                        console.log(area);
                        console.log(salary);
                        console.log(currency);
                        console.log(experience);
                        console.log(employment);
                        console.log(schedule);
                    }}>
                        Сбросить
                    </div>
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Регион</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Все регионы"
                        options={areas}
                        onChange={(values) => {
                            setArea(values[0] ? values[0].value : null);
                        }}
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
                            onChange={(event) => {
                                setSalary(
                                    event.target.value
                                        ? event.target.value
                                        : null
                                );
                            }}
                        ></input>
                    </div>
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Валюта</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options.currencies}
                        onChange={(values) => {
                            setCurrency(values[0] ? values[0].value : null);
                        }}
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
                        options={options.experience}
                        onChange={(values) => {
                            setExperience(values[0] ? values[0].value : null);
                        }}
                    />
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Вид работы</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options.employment}
                        onChange={(values) => {
                            setEmployment(values[0] ? values[0].value : null);
                        }}
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
                        options={options.schedule}
                        onChange={(values) => {
                            setSchedule(values[0] ? values[0].value : null);
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
