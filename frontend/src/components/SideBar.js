import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Home.module.scss';
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

const Sidebar = ({ onChange }) => {
    const [options, setOptions] = useState([]);
    const [areas, setAreas] = useState([]);

    const [salary, setSalary] = useState(null);
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

    useEffect(() => {
        onChange({
            salary,
            selectedArea,
            selectedCurrency,
            selectedExperience,
            selectedEmployment,
            selectedSchedule,
        });
    }, [salary, selectedArea, selectedCurrency, selectedExperience, selectedEmployment, selectedSchedule, onChange]);

    const resetFilters = useCallback(() => {
        setSalary(null);
        setSelectedArea([]);
        setSelectedCurrency([]);
        setSelectedExperience([]);
        setSelectedEmployment([]);
        setSelectedSchedule([]);
    }, []);

    const handleChange = (field, values) => {
        switch (field) {
            case 'area':
                setSelectedArea(values);
                break;
            case 'currency':
                setSelectedCurrency(values);
                break;
            case 'experience':
                setSelectedExperience(values);
                break;
            case 'employment':
                setSelectedEmployment(values);
                break;
            case 'schedule':
                setSelectedSchedule(values);
                break;
            default:
                break;
        }
    };

    return (
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
                    onChange={(values) => handleChange('area', values)}
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
                            handleChange('salary', event.target.value || null);
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
                    onChange={(values) => handleChange('currency', values)}
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
                    onChange={(values) => handleChange('experience', values)}
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
                    onChange={(values) => handleChange('employment', values)}
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
                    onChange={(values) => handleChange('schedule', values)}
                />
            </div>
        </div>
    );
};

export default Sidebar;
