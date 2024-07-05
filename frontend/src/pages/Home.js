/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Home.module.scss';
import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import '../styles/Select.scss';
import getOptions from '../services/dictionaries';
import getAreas from '../services/areas';

const selectStyle = {
    boxShadow: 'none',
    border: '1px solid #E4E5E7',
    borderRadius: '9px',
    backgroundColor: '#FAFAFB',
};

const Home = () => {
    const [options, setOptions] = useState([]);
    const [areas, setAreas] = useState([]);

    const [area, setArea] = useState(null);
    const [salary, setSalary] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [experience, setExperience] = useState(null);
    const [employment, setEmployment] = useState(null);
    const [schedule, setSchedule] = useState(null);

    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);
    const [selectedEmployment, setSelectedEmployment] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const options = await getOptions();
            const areas = await getAreas();
            setOptions(options);
            setAreas(areas);
        };
        fetchData();
    }, []);

    const resetFilters = useCallback(() => {
        setArea(null);
        setSalary(null);
        setCurrency(null);
        setExperience(null);
        setEmployment(null);
        setSchedule(null);
        setSelectedArea([]);
        setSelectedCurrency([]);
        setSelectedExperience([]);
        setSelectedEmployment([]);
        setSelectedSchedule([]);
    }, []);

    const onChange = useCallback((field, values) => {
        switch (field) {
            case 'area':
                setArea(values[0] ? values[0].value : null);
                setSelectedArea(values);
                break;
            case 'currency':
                setCurrency(values[0] ? values[0].value : null);
                setSelectedCurrency(values);
                break;
            case 'experience':
                setExperience(values[0] ? values[0].value : null);
                setSelectedExperience(values);
                break;
            case 'employment':
                setEmployment(values[0] ? values[0].value : null);
                setSelectedEmployment(values);
                break;
            case 'schedule':
                setSchedule(values[0] ? values[0].value : null);
                setSelectedSchedule(values);
                break;
            default:
                break;
        }
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
                    <div
                        className={styles.sideBar__header__reset}
                        onClick={resetFilters}
                    >
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
                        values={selectedArea}
                        onChange={(values) => onChange('area', values)}
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
                            value={salary || ''}
                            onChange={(event) => {
                                setSalary(event.target.value || null);
                            }}
                        />
                    </div>
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Валюта</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options.currencies}
                        values={selectedCurrency}
                        onChange={(values) => onChange('currency', values)}
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
                        values={selectedExperience}
                        onChange={(values) => onChange('experience', values)}
                    />
                </div>
                <div className={styles.sideBar__area}>
                    <div className={styles.sideBar__area__text}>Вид работы</div>
                    <Select
                        style={selectStyle}
                        className="reactDropdownSelect"
                        placeholder="Не важно"
                        options={options.employment}
                        values={selectedEmployment}
                        onChange={(values) => onChange('employment', values)}
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
                        values={selectedSchedule}
                        onChange={(values) => onChange('schedule', values)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
