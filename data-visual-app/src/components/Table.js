import { useEffect, useState } from 'react';

const Table = ({ data }) => {
  const [tableData, setTableData] = useState([]);

  //heading for the table
  const [heads, setHeads] = useState([
    { label: 'ID', key: 'id', sort: 0 },
    { label: 'Name', key: 'name', sort: 0 },
    {
      label: 'Absolute Magnitude',
      key: 'absolute_magnitude_h',
      sort: 0,
    },
    { label: 'Miss Distanace', key: 'miss_distance', sort: 0 },
    { label: 'Close Approach Date', key: 'approach_date', sort: 0 },
  ]);

  //sorted last 7 dates
  let datesArr = Object.keys(data.near_earth_objects).sort();

  // Filter data to acquire table keys
  let rowData = datesArr.map((key) => {
    return data.near_earth_objects[key].map((obj) => {
      let { id, name, absolute_magnitude_h, close_approach_data } = obj;

      let miss_distance = parseFloat(
        close_approach_data[0].miss_distance.kilometers
      ).toFixed(2);
      let approach_date = close_approach_data[0].close_approach_date;

      return {
        id,
        name,
        absolute_magnitude_h: parseFloat(absolute_magnitude_h).toFixed(2),
        miss_distance,
        approach_date,
      };
    });
  });

  //Flatten array to get all asteroids in one array of object
  const flatten = (arr) =>
    arr.reduce((acc, current) => {
      current instanceof Array
        ? acc.push(...flatten(current))
        : acc.push(current);
      return acc;
    }, []);

  //effect will run only one time to initialize the tableData first time
  useEffect(() => {
    setTableData([...tableData, ...flatten(rowData)]);
  }, []);

  useEffect(() => {
    console.log(tableData, 'data');
  }, [tableData]);

  //sorting mechanism using key passed from column headers
  const sortByKey = (head) => {
    let sorted = null;
    //asc order
    if (!head.sort) {
      if (head.key === 'approach_date') {
        sorted = [...tableData].sort((a, b) => {
          return new Date(a[head.key]) - new Date(b[head.key]);
        });
      } else if (head.key === 'name') {
        sorted = [...tableData].sort((a, b) => {
          const rx = /[^(\s+[^)]*\)$/; //to pull out name ending with )
          const rx2 = /[)]$/; // to replace ')' with ''

          // sort names using last alphabetic values ex: (2019 AFR) => AFR
          let keyA = a[head.key];
          let keyB = b[head.key];

          keyA = keyA.match(rx)[0].replace(rx2, '');
          keyB = keyB.match(rx)[0].replace(rx2, '');

          return keyA.localeCompare(keyB, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        });
      } else {
        sorted = [...tableData].sort((a, b) => a[head.key] - b[head.key]);
      }
      //update sorting status
      heads[head.index].sort = 1;
      setHeads([...heads]);
    } else {
      //desc
      if (head.key === 'approach_date') {
        sorted = [...tableData].sort((a, b) => {
          return new Date(b[head.key]) - new Date(a[head.key]);
        });
      } else if (head.key === 'name') {
        sorted = [...tableData].sort((a, b) => {
          const rx = /[^(\s+[^)]*\)$/; //to pull out name ending with )
          const rx2 = /[)]$/; // to replace ')' with ''

          // sort names using last alphabetic values ex: (2019 AFR) => AFR
          let keyA = a[head.key];
          let keyB = b[head.key];

          keyA = keyA.match(rx)[0].replace(rx2, '');
          keyB = keyB.match(rx)[0].replace(rx2, '');

          return keyB.localeCompare(keyA, undefined, {
            numeric: true,
            sensitivity: 'base',
          });
        });
      } else {
        sorted = [...tableData].sort((a, b) => b[head.key] - a[head.key]);
      }
      heads[head.index].sort = 0;
      setHeads([...heads]);
    }
    setTableData([...sorted]);
  };

  if (!tableData.length) return;

  return (
    //Used Block to cover flex itews for scrollable table like flexbox layout
    <div className='block h-[60vh] overflow-y-auto mb-8'>
      <div className='flex flex-col p-10'>
        <div className='flex border-2 border-gray-500 sticky top-[-1px] text-white bg-gray-500'>
          {heads.map((head, index) => (
            //we can use ID as well
            <div
              key={head.key}
              className='flex-1 text-center p-2 border-r-2 border-gray-500'
              onClick={sortByKey.bind(this, { ...head, index })}
            >
              {head.label}
            </div>
          ))}
        </div>
        {tableData.map((row) => (
          <div key={row.id} className='flex border-gray-500'>
            <div className='w-[20%] text-center overflow-auto text-ellipsis border-x-2 border-b-2 border-gray-500'>
              {row.id}
            </div>
            <div className='w-[20%] text-center overflow-auto text-ellipsis border-r-2 border-b-2 border-gray-500'>
              {row.name}
            </div>
            <div className='w-[20%] text-center overflow-auto text-ellipsis border-r-2 border-b-2 border-gray-500'>
              {row.absolute_magnitude_h}
            </div>
            <div className='w-[20%] text-center overflow-auto text-ellipsis border-r-2 border-b-2 border-gray-500'>
              {row.miss_distance}
            </div>
            <div className='w-[20%] text-center overflow-auto text-ellipsis border-r-2 border-b-2 border-gray-500'>
              {row.approach_date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
