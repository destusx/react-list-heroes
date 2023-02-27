// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import { useHttp } from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { activedFilterChanged, fetchFilters, selectAll } from './filtersSlice';
import { useEffect } from 'react';
import classNames from 'classnames';
import store from '../../store/';
import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {
    const { filtersLoadingStatus, activeFilter } = useSelector(
        state => state.filters
    );
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const { request } = useHttp();

    useEffect(() => {
        dispatch(fetchFilters());
    }, []);

    if (filtersLoadingStatus === 'loading') {
        return <Spinner />;
    }

    const renderFilters = arr => {
        if (!arr.length) {
            return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
        }

        return arr.map(({ name, label, className, id }) => {
            const btnClass = classNames('btn', className, {
                active: name === activeFilter,
            });

            return (
                <button
                    key={id}
                    onClick={() => dispatch(activedFilterChanged(name))}
                    className={btnClass}
                >
                    {label}
                </button>
            );
        });
    };

    const elements = renderFilters(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">{elements}</div>
            </div>
        </div>
    );
};

export default HeroesFilters;
