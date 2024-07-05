import React, { useState, useCallback, useEffect } from 'react';
import styles from '../styles/Home.module.scss';
import { motion } from 'framer-motion';
import Sidebar from '../components/SideBar';

const Home = () => {
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
            selectedArea: data.selectedArea[0] ? data.selectedArea[0].value : null,
            selectedCurrency: data.selectedCurrency[0] ? data.selectedCurrency[0].value : null,
            selectedExperience: data.selectedExperience[0] ? data.selectedExperience[0].value : null,
            selectedEmployment: data.selectedEmployment[0] ? data.selectedEmployment[0].value : null,
            selectedSchedule: data.selectedSchedule[0] ? data.selectedSchedule[0].value : null,
        });
    }, []);

    useEffect(() => {
        console.log(filters);
    }, [filters]);

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            <Sidebar onChange={handleChange} />
        </motion.div>
    );
};

export default Home;
