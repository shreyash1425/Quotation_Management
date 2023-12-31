import React from 'react'
import axios from "axios";
const { useState, useCallback, useMemo, useEffect } = React;

const ax = axios.create();

const AxiosLoader = () => {
    const [counter, setCounter] = useState(0);

    const inc = useCallback(() => setCounter(counter => counter + 1), [
        setCounter
    ]); // add to counter
    const dec = useCallback(() => setCounter(counter => counter - 1), [
        setCounter
    ]); // remove from counter

    const interceptors = useMemo(
        () => ({
            request: config => {
                inc();
                return config;
            },
            response: response => {
                dec();
                return response;
            },
            error: error => {
                dec();
                return Promise.reject(error);
            }
        }),
        [inc, dec]
    );

    useEffect(() => {
        // add request interceptors
        ax.interceptors.request.use(interceptors.request, interceptors.error);
        // add response interceptors
        ax.interceptors.response.use(interceptors.response, interceptors.error);
        return () => {
            // remove all intercepts when done
            ax.interceptors.request.eject(interceptors.request);
            ax.interceptors.request.eject(interceptors.error);
            ax.interceptors.response.eject(interceptors.response);
            ax.interceptors.response.eject(interceptors.error);
        };
    }, [interceptors]);

    return [counter > 0];
};

function globalLoader() {
    const [loading] = AxiosLoader();

    return <div>{loading ? "Loading" : null}</div>;
}

export default globalLoader;