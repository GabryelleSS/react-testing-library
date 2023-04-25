import './App.css';
import { useCallback, useEffect, useState } from 'react';

import { Cat, Chocolate } from 'react-kawaii';
// import { useDispatch, useSelector } from 'react-redux';

import getApi from './API';
import { MOODS, moodSlice, moodReducer, updateCatMood, updateReposName } from './mood';
import { useAppDispatch, useAppSelector } from './redux-hooks';

function App() {
  // const { updateCatMood } = moodSlice.actions;
  const [reposName, setRepoName] = useState([]);
  const [initialText, setInitialText] = useState('Sem repos');
  const [userName, setUserName] = useState('');
  const dispatch = useAppDispatch();

  const currentMood = useAppSelector((state) => state.mood);

  const handleMoodUpdate = (evt) => {
    const mood = evt.target.dataset.type;
    dispatch(updateCatMood(mood));
  }

  // const handleUserName = (evt) => {
  //   const value = evt.target.value;

  //   console.log('value', value)
  //   setUserName(value);
  // }

  const fetchNames = useCallback(async () => {
    setInitialText('Loading...');
    const response = await getApi();

    const names = response.map(res => res.name)
    setRepoName(names);

    dispatch(updateReposName(names));
  }, []);

  const clearRepos = useCallback(async () => {
    setInitialText('Repos limpos');
    dispatch(updateReposName([]));
    setRepoName([]);
  }, []);

  return (
    <div className="App">
    <div className="container-chocolate">
      <Chocolate size={320} mood={currentMood} color="#1678fa" />
      <section>
        {Object.values(MOODS).map((mood) => (
          <button
            data-type={mood}
            key={mood}
            className={`${currentMood === mood ? "selected" : ""}`}
            onClick={handleMoodUpdate}
          >
            {mood}
          </button>
        ))}
      </section>
    </div>

      <div className="container-repos">
        <div className="container-fields">
          {/* <input 
            placeholder="Digite o nome do usuario" 
            data-testid="input-repos"
            className="input-repos"
            // onChange={(evt) => handleUserName(evt)}
          /> */}

          <button 
            data-testid="btn-fetch-repos" 
            onClick={() => fetchNames()}
            className="btn-repos"
          >
            Buscar repos
          </button>
          <button 
            data-testid="btn-clear-repos" 
            onClick={() => clearRepos()}
            className="btn-repos btn-clear"
          >
            Limpar
          </button>
        </div>
        
        <div className="container-text">
          <ul>
            {
              reposName?.length 
                ? reposName.map(name => 
                    <li  
                      data-testid={name} 
                      key={name}
                    >
                      {name}
                    </li>
                  ) 
                : <p>{initialText}</p>
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
