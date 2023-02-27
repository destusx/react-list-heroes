// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useHttp } from '../../hooks/http.hook';
import { selectAll } from '../heroesFilters/filtersSlice';
import store from '../../store';
import { useCreateHeroMutation } from '../../api/apiSlice';

const HeroesAddForm = () => {
    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const [createHero, { isLoading }] = useCreateHeroMutation();

    const { filtersLoadingStatus } = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const onCreateHero = e => {
        e.preventDefault();

        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement,
        };

        createHero(newHero).unwrap();

        setHeroName('');
        setHeroDescr('');
        setHeroElement('');
    };

    const renderFilters = (filters, state) => {
        if (state === 'loading') {
            return <option>Загрузка элементов...</option>;
        } else if (state === 'error') {
            return <option>Ошибка загрузки</option>;
        }

        if (filters && filters.length > 0) {
            return filters.map(({ name, label, id }) => {
                if (name === 'all') return;
                return (
                    <option key={id} value={name}>
                        {label}
                    </option>
                );
            });
        }
    };

    return (
        <form onSubmit={onCreateHero} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">
                    Имя нового героя
                </label>
                <input
                    value={heroName}
                    onChange={e => setHeroName(e.target.value)}
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Как меня зовут?"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">
                    Описание
                </label>
                <textarea
                    value={heroDescr}
                    onChange={e => setHeroDescr(e.target.value)}
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Что я умею?"
                    style={{ height: '130px' }}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">
                    Выбрать элемент героя
                </label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value={heroElement}
                    onChange={e => setHeroElement(e.target.value)}
                >
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">
                Создать
            </button>
        </form>
    );
};

export default HeroesAddForm;
