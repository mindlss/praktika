import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/Home.module.scss';
import { motion } from 'framer-motion';
import Sidebar from '../components/SideBar';
import Vacancy from '../components/Vacancy';
import { ReactComponent as Glass } from '../assets/glass.svg';
import { ReactComponent as Loading } from '../assets/loading.svg';
import getVacancies from '../services/api';
import createVacancyElements from '../utils/vacanciesBuilder';

const Home = () => {
    const [info, setInfo] = useState({});
    const [vacancies, setVacancies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = query.get('page');

    const [name, setName] = useState(null);
    const [filters, setFilters] = useState({
        salary: null,
        selectedArea: null,
        selectedCurrency: null,
        selectedExperience: null,
        selectedEmployment: null,
        selectedSchedule: null,
    });

    const handleChange = useCallback((data) => {
        setFilters({
            salary: data.salary,
            selectedArea: data.selectedArea[0]
                ? data.selectedArea[0].value
                : null,
            selectedCurrency: data.selectedCurrency[0]
                ? data.selectedCurrency[0].value
                : null,
            selectedExperience: data.selectedExperience[0]
                ? data.selectedExperience[0].value
                : null,
            selectedEmployment: data.selectedEmployment[0]
                ? data.selectedEmployment[0].value
                : null,
            selectedSchedule: data.selectedSchedule[0]
                ? data.selectedSchedule[0].value
                : null,
        });
    }, []);

    const fetchVacancies = async () => {
        setIsLoading(true);
        try {
            const data = await getVacancies(name, page ? page : 0, filters);
            setVacancies(data.vacancies);
            setInfo(data.info);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            <Sidebar onChange={handleChange} />
            <div className={styles.main}>
                <div className={styles.message} hidden={!isLoading}>
                    <Loading className={styles.message__svg} />
                </div>
                <div className={styles.message} hidden={vacancies.length > 0}>
                    <span className={styles.message__text}>
                        Ничего не найдено
                    </span>
                </div>
                <div className={styles.search}>
                    <Glass className={styles.search__glass} />
                    <input
                        className={styles.search__input}
                        placeholder="Поиск"
                        onChange={(event) => {
                            setName(event.target.value || null);
                        }}
                    ></input>
                    <div
                        className={styles.search__button}
                        onClick={() => {
                            fetchVacancies();
                        }}
                    >
                        <span className={styles.search__button__text}>
                            Найти
                        </span>
                    </div>
                    <span className={styles.search__total}>
                        {info && info.totalVacancies ? info.totalVacancies : 0}{' '}
                        вакансий
                    </span>
                </div>
                <div className={styles.vacancies}>
                    {createVacancyElements(vacancies)}
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
