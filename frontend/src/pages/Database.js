/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import styles from '../styles/Database.module.scss';
import { motion } from 'framer-motion';

const Database = () => {
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileOffer, setFileOffer] = useState(null);
    const [status, setStatus] = useState(null);

    // useEffect(() => {
    //     fetch(`/api/getFileInfo/${id}`) // замените на ваш URL
    //         .then((response) => {
    //             setStatus(response.status);
    //             return response.json();
    //         })
    //         .then((json) => setFileOffer(json))
    //         .catch((error) => console.error(error));
    // }, []);

    

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            
        </motion.div>
    );
};

export default Database;
