import { useState } from 'react';
import Charts from './components/Charts';
import SearchBox from './components/SearchBox';
import Table from './components/Table';

function App() {
  const [userInput, setUserInput] = useState({
    apiKey: '',
    data: null,
    error: false,
    loading: false,
  });

  const setEnteredText = (text) => {
    setUserInput((currentInput) => ({ ...currentInput, apiKey: text }));
  };

  //GET API request for accesing Asteroids Data
  const fetchNeoWsApi = async () => {
    if (userInput.apiKey !== 'DEMO_KEY') return;

    let currentDate = new Date().toLocaleDateString('en-CA');
    let prev7DayDate = new Date(
      new Date().setDate(new Date(currentDate).getDate() - 7)
    ).toLocaleDateString('en-CA');

    //if correct key is entered by user
    return await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${prev7DayDate}&end_date=${currentDate}&detailed=false&api_key=${userInput.apiKey}`
    );
  };

  const getResponse = async () => {
    setUserInput((currentInput) => ({
      ...currentInput,
      loading: true,
      error: false,
      data: null,
    }));
    try {
      const data = await fetchNeoWsApi();
      if (!data) {
        throw new Error('Please enter correct Key');
      }
      const jsonData = await data.json();
      //set asteriod data fetch from api
      setUserInput((currentInput) => ({
        ...currentInput,
        data: jsonData,
        error: false,
        loading: false,
      }));
    } catch (error) {
      setUserInput((currentInput) => ({
        ...currentInput,
        error: true,
        loading: false,
      }));
      console.error(error);
    }
  };

  return (
    // {/* //app container */}
    <div className='relative'>
      <div className='flex flex-col items-center'>
        {/* error popup */}
        {userInput.error && (
          <div className='flex absolute top-2 right-2'>
            <p className='flex p-2 border-2 text-red-400'>
              Please enter valid key!
            </p>
          </div>
        )}
        {/* loading */}
        {userInput.loading && (
          <div className='flex absolute top-2 left-2'>
            <p className='flex p-2 border-2 text-white bg-yellow-400'>
              Data Loading!
            </p>
          </div>
        )}

        {/* Search Box */}
        <div className='flex search-box py-5'>
          <SearchBox
            id={Math.random(0, 100)}
            label={'Add API Key'}
            placeholder={'Type Key Value'}
            onChangeText={setEnteredText}
          />
          <button
            className='flex justify-center items-center p-2 bg-blue-300 ml-2 rounded-lg text-white'
            onClick={getResponse}
          >
            Submit
          </button>
        </div>
      </div>
      {userInput.data && (
        <>
          {/* Chart */}
          <div className='flex items-center min-h-[70vh] px-5'>
            <Charts data={userInput.data} />
          </div>
          {/* Table */}
          <div>
            <Table data={userInput.data} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
